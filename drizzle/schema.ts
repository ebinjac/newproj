import { pgTable, text, timestamp, boolean, uuid, index, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  teamName: text('team_name').notNull(),
  prcGroup: text('prc_group').notNull(),
  vpName: text('vp_name').notNull(),
  directorName: text('director_name').notNull(),
  email: text('email').notNull(),
  slack: text('slack').notNull(),
  requestedBy: text('requested_by').notNull(),
  approved: boolean('approved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  appName: text('app_name').notNull(),
  carId: text('car_id').notNull(),
  description: text('description').notNull(),
  vp: text('vp').notNull(),
  dir: text('dir').notNull(),
  engDir: text('eng_dir').notNull(),
  engDir2: text('eng_dir2'),
  slack: text('slack').notNull(),
  email: text('email').notNull(),
  snowGroup: text('snow_group').notNull(),
  teamId: uuid('team_id').references(() => teams.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    teamIdIdx: index('team_id_idx').on(table.teamId)
  };
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  groups: text('groups').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});



// Add this new table definition
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  teamId: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // Template name
  subject: text('subject').notNull(),
  fromName: text('from_name').notNull(),
  fromEmail: text('from_email').notNull(),
  replyTo: text('reply_to'),
  to: text('to').notNull(), // Can be an email or placeholder like {{user.email}}
  cc: text('cc'),
  bcc: text('bcc'),
  body: jsonb('body').notNull(), // Store the email editor's JSON structure
  htmlContent: text('html_content'), // Generated HTML content
  textContent: text('text_content'), // Plain text version
  status: text('status').notNull().default('draft'), // draft, active, archived
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Add this relations definition
export const notificationsRelations = relations(notifications, ({ one }) => ({
  team: one(teams, {
    fields: [notifications.teamId],
    references: [teams.id],
  }),
}));

// Update your teams relations to include notifications
export const teamsRelations = relations(teams, ({ many }) => ({
  applications: many(applications),
  notifications: many(notifications), // Add this line
}));
