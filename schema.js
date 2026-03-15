import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
    id: serial().primaryKey(),
    name: text('name').notNull(),
    email: varchar('email', {length:100}).notNull()
});

export default users;