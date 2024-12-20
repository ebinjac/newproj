import { pgTable, text, timestamp, boolean, uuid, index } from 'drizzle-orm/pg-core';

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
