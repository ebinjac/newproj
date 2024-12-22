import { pgTable, uuid, varchar, text, timestamp, boolean, foreignKey, json, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Previous Enums
export const emailStatusEnum = pgEnum('email_status', ['DRAFT', 'SENT', 'FAILED', 'SCHEDULED']);
export const emailPriorityEnum = pgEnum('email_priority', ['LOW', 'MEDIUM', 'HIGH']);

// Teams Table
export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: uuid('created_by').notNull(),
  updatedBy: uuid('updated_by').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

// New Applications Table
export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  carId: varchar('car_id', { length: 50 }).notNull(),
  director: varchar('director', { length: 255 }).notNull(),
  engineeringDirector: varchar('engineering_director', { length: 255 }).notNull(),
  snowGroup: varchar('snow_group', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }).notNull(),
  description: text('description'),
  metadata: json('metadata').$type<Record<string, unknown>>().default({}),
  teamId: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: uuid('created_by').notNull(),
  updatedBy: uuid('updated_by').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

// Mail Groups Table
export const mailGroups = pgTable('mail_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  to: json('to').$type<string[]>().default([]).notNull(),
  cc: json('cc').$type<string[]>().default([]),
  bcc: json('bcc').$type<string[]>().default([]),
  teamId: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  applicationId: uuid('application_id').references(() => applications.id),  // Optional link to specific application
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: uuid('created_by').notNull(),
  updatedBy: uuid('updated_by').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

// Templates Table
export const templates = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  variables: json('variables').$type<string[]>().default([]),
  mailGroupId: uuid('mail_group_id').references(() => mailGroups.id),
  teamId: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  applicationId: uuid('application_id').references(() => applications.id),  // Optional link to specific application
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: uuid('created_by').notNull(),
  updatedBy: uuid('updated_by').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

// Emails Table
export const emails = pgTable('emails', {
  id: uuid('id').primaryKey().defaultRandom(),
  templateId: uuid('template_id').references(() => templates.id),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  to: json('to').$type<string[]>().notNull(),
  cc: json('cc').$type<string[]>().default([]),
  bcc: json('bcc').$type<string[]>().default([]),
  status: emailStatusEnum('status').default('DRAFT').notNull(),
  priority: emailPriorityEnum('priority').default('MEDIUM').notNull(),
  scheduledFor: timestamp('scheduled_for'),
  sentAt: timestamp('sent_at'),
  teamId: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  applicationId: uuid('application_id').references(() => applications.id),  // Optional link to specific application
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: uuid('created_by').notNull(),
  updatedBy: uuid('updated_by').notNull(),
  metadata: json('metadata').$type<Record<string, unknown>>().default({}),
});

// Updated Relations
export const teamsRelations = relations(teams, ({ many }) => ({
  mailGroups: many(mailGroups),
  templates: many(templates),
  emails: many(emails),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  team: one(teams, {
    fields: [applications.teamId],
    references: [teams.id],
  }),
  mailGroups: many(mailGroups),
  templates: many(templates),
  emails: many(emails),
}));

export const mailGroupsRelations = relations(mailGroups, ({ one, many }) => ({
  team: one(teams, {
    fields: [mailGroups.teamId],
    references: [teams.id],
  }),
  application: one(applications, {
    fields: [mailGroups.applicationId],
    references: [applications.id],
  }),
  templates: many(templates),
}));

export const templatesRelations = relations(templates, ({ one }) => ({
  team: one(teams, {
    fields: [templates.teamId],
    references: [teams.id],
  }),
  application: one(applications, {
    fields: [templates.applicationId],
    references: [applications.id],
  }),
  mailGroup: one(mailGroups, {
    fields: [templates.mailGroupId],
    references: [mailGroups.id],
  }),
}));

export const emailsRelations = relations(emails, ({ one }) => ({
  team: one(teams, {
    fields: [emails.teamId],
    references: [teams.id],
  }),
  application: one(applications, {
    fields: [emails.applicationId],
    references: [applications.id],
  }),
  template: one(templates, {
    fields: [emails.templateId],
    references: [templates.id],
  }),
}));