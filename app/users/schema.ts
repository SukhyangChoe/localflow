import { pgEnum, pgTable, bigint, uuid, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { profiles } from "../auth/schema";
import { boards } from "../board/schema";

export const notificationType = pgEnum('notification_type', [
    "follow",
    "review",
    "reply",
    "mention",
    "tag",
    "system",
    "other"
]);

export const notifications = pgTable('notifications', {
    notification_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    source_profile_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }).notNull(),
    target_profile_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }).notNull(),
    notification_type: notificationType().notNull(),
    board_id: bigint({ mode: "number" }).references(() => boards.board_id, { onDelete: "cascade" }),
    is_read: boolean().notNull().default(false),
    created_at: timestamp().notNull().defaultNow(),
});
