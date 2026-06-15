import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/* -------------------------------------------------------------------------- */
/*                               BETTER AUTH                                  */
/* -------------------------------------------------------------------------- */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

/* -------------------------------------------------------------------------- */
/*                                    ENUMS                                   */
/* -------------------------------------------------------------------------- */

export const providerEnum = pgEnum("provider", [
  "GOOGLE",
  "CORSAIR",
]);

export const messageRoleEnum = pgEnum("message_role", [
  "USER",
  "ASSISTANT",
  "TOOL",
]);

export const priorityLevelEnum = pgEnum("priority_level", [
  "HIGH",
  "MEDIUM",
  "LOW",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "PENDING",
  "RUNNING",
  "SUCCESS",
  "FAILED",
]);

export const planEnum = pgEnum("plan", [
  "FREE",
  "PREMIUM",
  "ENTERPRISE",
]);

/* -------------------------------------------------------------------------- */
/*                                    USERS                                   */
/* -------------------------------------------------------------------------- */

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 50 }).unique(),

  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),

  image: text("image"),

  // Subscription
  plan: planEnum("plan")
    .default("FREE")
    .notNull(),

  isActive: boolean("is_active")
    .default(true)
    .notNull(),

  trialEndsAt: timestamp("trial_ends_at"),
  premiumEndsAt: timestamp("premium_ends_at"),

  // Future Stripe/Razorpay support
  customerId: text("customer_id").unique(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

/* -------------------------------------------------------------------------- */
/*                               INTEGRATIONS                                 */
/* -------------------------------------------------------------------------- */

export const integrationsTable = pgTable("integrations", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  provider: providerEnum("provider").notNull(),

  providerUserId: text("provider_user_id"),

  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),

  expiresAt: timestamp("expires_at"),
  connectedAt: timestamp("connected_at").defaultNow().notNull(),
});

/* -------------------------------------------------------------------------- */
/*                              USER PREFERENCES                              */
/* -------------------------------------------------------------------------- */

export const userPreferencesTable = pgTable("user_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  theme: varchar("theme", { length: 20 }).default("dark"),
  accentColor: varchar("accent_color", { length: 20 }).default("#D4A65A"),

  aiEnabled: boolean("ai_enabled").default(true),
  keyboardShortcuts: boolean("keyboard_shortcuts").default(true),

  defaultView: varchar("default_view", { length: 50 }).default("inbox"),
});

/* -------------------------------------------------------------------------- */
/*                              AI CONVERSATIONS                              */
/* -------------------------------------------------------------------------- */

export const conversationsTable = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  title: varchar("title", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messagesTable = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversationsTable.id, {
      onDelete: "cascade",
    }),

  role: messageRoleEnum("role").notNull(),

  content: text("content").notNull(),

  toolCalls: jsonb("tool_calls"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* -------------------------------------------------------------------------- */
/*                                EMAIL CACHE                                 */
/* -------------------------------------------------------------------------- */

export const emailCacheTable = pgTable("email_cache", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  gmailId: text("gmail_id").notNull().unique(),
  threadId: text("thread_id").notNull(),

  subject: text("subject").notNull(),
  sender: text("sender").notNull(),

  snippet: text("snippet"),

  aiSummary: text("ai_summary"),

  priority: priorityLevelEnum("priority"),

  hasAttachment: boolean("has_attachment").default(false),
  isRead: boolean("is_read").default(false),

  receivedAt: timestamp("received_at").notNull(),
  syncedAt: timestamp("synced_at").defaultNow().notNull(),
});

/* -------------------------------------------------------------------------- */
/*                               CALENDAR CACHE                               */
/* -------------------------------------------------------------------------- */

export const calendarCacheTable = pgTable("calendar_cache", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  googleEventId: text("google_event_id").notNull().unique(),

  title: text("title").notNull(),
  description: text("description"),

  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),

  attendees: jsonb("attendees"),

  aiGenerated: boolean("ai_generated").default(false),

  syncedAt: timestamp("synced_at").defaultNow().notNull(),
});

/* -------------------------------------------------------------------------- */
/*                                AGENT TASKS                                 */
/* -------------------------------------------------------------------------- */

export const agentTasksTable = pgTable("agent_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  instruction: text("instruction").notNull(),

  status: taskStatusEnum("status").default("PENDING").notNull(),

  executionLog: jsonb("execution_log"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});
