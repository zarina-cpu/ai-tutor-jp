import { and, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { getAcademicDay } from "./academic-day";
import { FREE_DAILY_LESSONS, FREE_DAILY_SECONDS } from "./config";
import { getDb, hasDatabase } from "./db";
import {
  lessonProgress,
  mistakes,
  practiceQuotas,
  subscriptions,
} from "./db/schema";
import { readStore, withStore } from "./local-store";
import { getLesson, isProLesson, stageForLevel } from "./curriculum";

function periodActive(row, now = new Date()) {
  if (!row) return false;
  const live = row.status === "active" || row.status === "trialing" || row.status === "canceled";
  if (!live) return false;
  if (!row.currentPeriodEnd) return row.status === "active" || row.status === "trialing";
  return new Date(row.currentPeriodEnd).getTime() > now.getTime();
}

export async function getSubscription(userId) {
  if (hasDatabase()) {
    const db = getDb();
    const rows = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);
    return rows[0] || null;
  }
  const store = await readStore();
  return store.subscriptions[userId] || null;
}

export async function upsertSubscription(userId, data) {
  if (hasDatabase()) {
    const db = getDb();
    await db
      .insert(subscriptions)
      .values({ userId, ...data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: subscriptions.userId,
        set: { ...data, updatedAt: new Date() },
      });
    return;
  }
  await withStore(async (store) => {
    store.subscriptions[userId] = {
      userId,
      ...(store.subscriptions[userId] || {}),
      ...data,
    };
  });
}

export async function isProUser(userId) {
  const sub = await getSubscription(userId);
  return periodActive(sub);
}

async function getQuotaRow(userId, academicDay) {
  if (hasDatabase()) {
    const db = getDb();
    const rows = await db
      .select()
      .from(practiceQuotas)
      .where(
        and(eq(practiceQuotas.userId, userId), eq(practiceQuotas.academicDay, academicDay)),
      )
      .limit(1);
    return rows[0] || { secondsUsed: 0, lessonSlugs: [] };
  }
  const store = await readStore();
  return store.quotas[`${userId}:${academicDay}`] || { secondsUsed: 0, lessonSlugs: [] };
}

async function saveQuota(userId, academicDay, row) {
  if (hasDatabase()) {
    const db = getDb();
    const existing = await db
      .select()
      .from(practiceQuotas)
      .where(
        and(eq(practiceQuotas.userId, userId), eq(practiceQuotas.academicDay, academicDay)),
      )
      .limit(1);
    if (existing[0]) {
      await db
        .update(practiceQuotas)
        .set({ secondsUsed: row.secondsUsed, lessonSlugs: row.lessonSlugs })
        .where(
          and(eq(practiceQuotas.userId, userId), eq(practiceQuotas.academicDay, academicDay)),
        );
    } else {
      await db.insert(practiceQuotas).values({
        userId,
        academicDay,
        secondsUsed: row.secondsUsed,
        lessonSlugs: row.lessonSlugs,
      });
    }
    return;
  }
  await withStore(async (store) => {
    store.quotas[`${userId}:${academicDay}`] = {
      userId,
      academicDay,
      secondsUsed: row.secondsUsed,
      lessonSlugs: row.lessonSlugs,
    };
  });
}

export async function getEntitlements(userId, lesson) {
  const pro = await isProUser(userId);
  const academicDay = getAcademicDay();
  const quota = await getQuotaRow(userId, academicDay);
  const secondsUsed = quota.secondsUsed || 0;
  const lessonSlugs = quota.lessonSlugs || [];
  const secondsLeft = pro ? Infinity : Math.max(0, FREE_DAILY_SECONDS - secondsUsed);
  const lessonOpen =
    pro || lessonSlugs.includes(lesson?.slug) || lessonSlugs.length < FREE_DAILY_LESSONS;
  const stageLocked = lesson ? isProLesson(lesson) && !pro : false;
  return {
    pro,
    academicDay,
    secondsUsed,
    secondsLeft,
    lessonSlugs,
    lessonsLeft: pro ? Infinity : Math.max(0, FREE_DAILY_LESSONS - lessonSlugs.length),
    lessonOpen,
    stageLocked,
    canPractice: pro || secondsLeft > 0,
  };
}

export function canAccessFeature(pro, feature) {
  if (pro) return true;
  return feature === "kana" || feature === "quiz" || feature === "grammar";
}

export async function addPracticeSeconds(userId, delta) {
  const pro = await isProUser(userId);
  if (pro) {
    return getEntitlements(userId);
  }
  const academicDay = getAcademicDay();
  const quota = await getQuotaRow(userId, academicDay);
  const next = Math.min(FREE_DAILY_SECONDS, (quota.secondsUsed || 0) + delta);
  await saveQuota(userId, academicDay, {
    secondsUsed: next,
    lessonSlugs: quota.lessonSlugs || [],
  });
  return getEntitlements(userId);
}

export async function openLessonSlot(userId, slug) {
  const lessonStage = stageForLevel(getLesson(slug)?.level || "N5");
  const pro = await isProUser(userId);
  if (lessonStage?.requiresPro && !pro) {
    return { ok: false, reason: "pro" };
  }
  const academicDay = getAcademicDay();
  const quota = await getQuotaRow(userId, academicDay);
  const slugs = quota.lessonSlugs || [];
  if (slugs.includes(slug) || pro) {
    return { ok: true, entitlements: await getEntitlements(userId) };
  }
  if (slugs.length >= FREE_DAILY_LESSONS) {
    return { ok: false, reason: "lessons" };
  }
  await saveQuota(userId, academicDay, {
    secondsUsed: quota.secondsUsed || 0,
    lessonSlugs: [...slugs, slug],
  });
  return { ok: true, entitlements: await getEntitlements(userId) };
}

export async function saveProgress(userId, lessonSlug, score) {
  if (hasDatabase()) {
    const db = getDb();
    await db.insert(lessonProgress).values({
      userId,
      lessonSlug,
      score,
      completedAt: new Date(),
    });
    return;
  }
  await withStore(async (store) => {
    store.progress.push({
      userId,
      lessonSlug,
      score,
      completedAt: new Date().toISOString(),
    });
  });
}

export async function listProgress(userId) {
  if (hasDatabase()) {
    const db = getDb();
    return db.select().from(lessonProgress).where(eq(lessonProgress.userId, userId));
  }
  const store = await readStore();
  return store.progress.filter((row) => row.userId === userId);
}

export async function addMistake(userId, payload) {
  const row = {
    id: randomUUID(),
    userId,
    source: payload.source,
    prompt: payload.prompt,
    answer: payload.answer,
    correction: payload.correction || "",
    audioKey: payload.audioKey || null,
    createdAt: new Date().toISOString(),
  };
  if (hasDatabase()) {
    const db = getDb();
    await db.insert(mistakes).values({
      ...row,
      createdAt: new Date(),
    });
    return row;
  }
  await withStore(async (store) => {
    store.mistakes.push(row);
  });
  return row;
}

export async function listMistakes(userId) {
  if (hasDatabase()) {
    const db = getDb();
    return db.select().from(mistakes).where(eq(mistakes.userId, userId));
  }
  const store = await readStore();
  return store.mistakes.filter((row) => row.userId === userId);
}

export async function findUserIdByCustomer(customerId) {
  if (hasDatabase()) {
    const db = getDb();
    const rows = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeCustomerId, customerId))
      .limit(1);
    return rows[0]?.userId || null;
  }
  const store = await readStore();
  return (
    Object.values(store.subscriptions).find((row) => row.stripeCustomerId === customerId)
      ?.userId || null
  );
}
