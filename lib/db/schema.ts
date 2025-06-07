
import { pgTable, serial, text, timestamp, varchar, integer, boolean, decimal, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
  // Program specific fields
  currentWeek: integer('current_week').default(1).notNull(),
  programStartDate: timestamp('program_start_date'),
  programCompleted: boolean('program_completed').default(false).notNull(),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').notNull().references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('member'),
  invitedBy: uuid('invited_by').notNull().references(() => users.id),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  teamId: integer('team_id').notNull().references(() => teams.id),
  role: varchar('role', { length: 50 }).notNull().default('member'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').notNull().references(() => teams.id),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

// New tables for the program
export const weeklyThemes = pgTable('weekly_themes', {
  id: serial('id').primaryKey(),
  weekNumber: integer('week_number').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  bibleVerse: text('bible_verse').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const dailyTasks = pgTable('daily_tasks', {
  id: serial('id').primaryKey(),
  weekNumber: integer('week_number').notNull(),
  dayNumber: integer('day_number').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  audioUrl: text('audio_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  weekNumber: integer('week_number').notNull(),
  dayNumber: integer('day_number').notNull(),
  completed: boolean('completed').default(false).notNull(),
  notes: text('notes'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const weightTracking = pgTable('weight_tracking', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  weight: decimal('weight', { precision: 5, scale: 2 }).notNull(),
  weekNumber: integer('week_number').notNull(),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  weekNumber: integer('week_number').notNull(),
  content: text('content').notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type WeeklyTheme = typeof weeklyThemes.$inferSelect;
export type NewWeeklyTheme = typeof weeklyThemes.$inferInsert;
export type DailyTask = typeof dailyTasks.$inferSelect;
export type NewDailyTask = typeof dailyTasks.$inferInsert;
export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;
export type WeightTracking = typeof weightTracking.$inferSelect;
export type NewWeightTracking = typeof weightTracking.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
