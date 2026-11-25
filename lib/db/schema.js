import { jsonb, integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const subscriptions = pgTable("subscriptions", {
  userId: text("user_id").primaryKey(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull().default("free"),
  interval: text("interval"),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const practiceQuotas = pgTable(
  "practice_quotas",
  {
    userId: text("user_id").notNull(),
    academicDay: text("academic_day").notNull(),
    secondsUsed: integer("seconds_used").notNull().default(0),
    lessonSlugs: jsonb("lesson_slugs").notNull().default([]),
  },
  (table) => [primaryKey({ columns: [table.userId, table.academicDay] })],
);

export const lessonProgress = pgTable("lesson_progress", {
  userId: text("user_id").notNull(),
  lessonSlug: text("lesson_slug").notNull(),
  score: integer("score"),
  completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow(),
});

export const mistakes = pgTable("mistakes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  source: text("source").notNull(),
  prompt: text("prompt").notNull(),
  answer: text("answer").notNull(),
  correction: text("correction"),
  audioKey: text("audio_key"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
