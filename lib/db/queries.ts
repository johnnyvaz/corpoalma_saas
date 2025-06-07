import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from './drizzle';
import {
  activityLogs,
  teams,
  teamMembers,
  users,
  weeklyThemes,
  dailyTasks,
  userProgress,
  weightTracking,
  testimonials,
  type NewActivityLog,
  type NewTeamMember,
  type User,
  type NewUser,
  type Team,
  type NewTeam,
  type WeeklyTheme,
  type DailyTask,
  type UserProgress,
  type NewUserProgress,
  type WeightTracking,
  type NewWeightTracking,
  type Testimonial,
  type NewTestimonial,
} from './schema';

export async function createUser(data: NewUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user || null;
}

export async function createTeam(data: NewTeam): Promise<Team> {
  const [team] = await db.insert(teams).values(data).returning();
  return team;
}

export async function createTeamMember(data: NewTeamMember) {
  await db.insert(teamMembers).values(data);
}

export async function getTeamByStripeCustomerId(customerId: string): Promise<Team | null> {
  const [team] = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);
  return team || null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscription: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscription,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: string) {
  const result = await db
    .select({
      user: users,
      teamMember: teamMembers,
      team: teams,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .leftJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] || null;
}

export async function getActivityLogs(): Promise<
  Array<{
    id: number;
    action: string;
    timestamp: Date;
    user: { id: string; name: string } | null;
  }>
> {
  const logs = await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      user: {
        id: users.id,
        name: users.name,
      },
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);

  return logs;
}

export async function logActivity(
  teamId: number | undefined,
  userId: string | undefined,
  action: string
) {
  if (teamId) {
    const logData: NewActivityLog = {
      teamId,
      userId: userId || null,
      action,
      timestamp: new Date(),
    };

    await db.insert(activityLogs).values(logData);
  }
}

// Program specific queries
export async function getWeeklyTheme(weekNumber: number): Promise<WeeklyTheme | null> {
  const [theme] = await db
    .select()
    .from(weeklyThemes)
    .where(eq(weeklyThemes.weekNumber, weekNumber))
    .limit(1);
  return theme || null;
}

export async function getDailyTask(weekNumber: number, dayNumber: number): Promise<DailyTask | null> {
  const [task] = await db
    .select()
    .from(dailyTasks)
    .where(
      and(
        eq(dailyTasks.weekNumber, weekNumber),
        eq(dailyTasks.dayNumber, dayNumber)
      )
    )
    .limit(1);
  return task || null;
}

export async function getUserProgress(userId: string, weekNumber: number, dayNumber: number): Promise<UserProgress | null> {
  const [progress] = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.weekNumber, weekNumber),
        eq(userProgress.dayNumber, dayNumber)
      )
    )
    .limit(1);
  return progress || null;
}

export async function createUserProgress(data: NewUserProgress): Promise<UserProgress> {
  const [progress] = await db.insert(userProgress).values(data).returning();
  return progress;
}

export async function updateUserProgress(
  userId: string,
  weekNumber: number,
  dayNumber: number,
  data: Partial<NewUserProgress>
) {
  await db
    .update(userProgress)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.weekNumber, weekNumber),
        eq(userProgress.dayNumber, dayNumber)
      )
    );
}

export async function getLatestWeight(userId: string): Promise<WeightTracking | null> {
  const [weight] = await db
    .select()
    .from(weightTracking)
    .where(eq(weightTracking.userId, userId))
    .orderBy(desc(weightTracking.recordedAt))
    .limit(1);
  return weight || null;
}

export async function createWeightTracking(data: NewWeightTracking): Promise<WeightTracking> {
  const [weight] = await db.insert(weightTracking).values(data).returning();
  return weight;
}

export async function getWeightHistory(userId: string): Promise<WeightTracking[]> {
  return db
    .select()
    .from(weightTracking)
    .where(eq(weightTracking.userId, userId))
    .orderBy(desc(weightTracking.recordedAt));
}

export async function createTestimonial(data: NewTestimonial): Promise<Testimonial> {
  const [testimonial] = await db.insert(testimonials).values(data).returning();
  return testimonial;
}

export async function getUserTestimonials(userId: string): Promise<Testimonial[]> {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.userId, userId))
    .orderBy(desc(testimonials.createdAt));
}

export async function getPublicTestimonials(): Promise<Testimonial[]> {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isPublic, true))
    .orderBy(desc(testimonials.createdAt))
    .limit(10);
}

export async function getWeeklyProgress(userId: string, weekNumber: number): Promise<UserProgress[]> {
  return db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.weekNumber, weekNumber)
      )
    )
    .orderBy(userProgress.dayNumber);
}

export async function updateUserWeek(userId: string, weekNumber: number) {
  await db
    .update(users)
    .set({
      currentWeek: weekNumber,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

export async function markProgramCompleted(userId: string) {
  await db
    .update(users)
    .set({
      programCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

// Analytics
export async function getUserCompletionRate(userId: string): Promise<number> {
  const totalTasks = await db.select({ count: sql<number>`count(*)` }).from(dailyTasks);

  const completedTasks = await db
    .select({ count: sql<number>`count(*)` })
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.completed, true)));

  if (totalTasks[0].count === 0) return 0;
  return (completedTasks[0].count / totalTasks[0].count) * 100;
}

export async function getAverageWeightLoss(): Promise<number> {
  const result = await db.execute(sql`
    SELECT AVG(first_weight.weight - last_weight.weight) as avg_loss
    FROM (
      SELECT DISTINCT ON (user_id) user_id, weight
      FROM weight_tracking
      ORDER BY user_id, recorded_at ASC
    ) first_weight
    JOIN (
      SELECT DISTINCT ON (user_id) user_id, weight
      FROM weight_tracking
      ORDER BY user_id, recorded_at DESC
    ) last_weight ON first_weight.user_id = last_weight.user_id
    WHERE first_weight.weight > last_weight.weight
  `);

  const firstRow = result[0] as { avg_loss: number | null } | undefined;

  return firstRow?.avg_loss ?? 0;
}