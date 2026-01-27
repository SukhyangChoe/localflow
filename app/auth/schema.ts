// all the models for the users feature
import {bigint, boolean, jsonb, pgEnum, pgSchema, pgTable, primaryKey, text, timestamp, uuid} from "drizzle-orm/pg-core";

//실제로 push까지 하지는 않음. 이미 users table이 있음.
const users = pgSchema("auth").table("users", {
    id: uuid().primaryKey(),
  });
  
  export const roles = pgEnum("role", [
    "traveler",
    "creator",
  ]);

  export const join_path = pgEnum("join_path", [
    "email",
    "google",
    "kakao",
    "naver",
  ]);
  
export const profiles = pgTable("profiles", {
    profile_id: uuid().primaryKey().references(() => users.id, { onDelete: "cascade" }),
    email: text(),
    phone: text(),
    avatar: text(),
    username: text(),
    bio: text(),
    country: text(),
    language: text(),
    timezone: text().default("UTC"),
    interests: text().array(),
    preferred_currency: text().default("KRW"),
    role: roles().default("traveler").notNull(),
    join_path: join_path().default("email").notNull(),
    email_verified: boolean().default(false),
    phone_verified: boolean().default(false),
    notification_settings: jsonb().$type<{
        email?: boolean;
        push?: boolean;
        marketing?: boolean;
    }>().default({ email: false, push: false, marketing: false }),
    privacy_settings: jsonb().$type<{
        profile_visibility?: "public" | "private" | "friends";
        show_email?: boolean;
        show_phone?: boolean;
    }>().default({ profile_visibility: "public", show_email: false, show_phone: false }),
    stats: jsonb().$type<{
        boards_count?: number;
        followers_count?: number;
        following_count?: number;
    }>().default({ boards_count: 0, followers_count: 0, following_count: 0 }),
    is_active: boolean().default(true),
    is_verified: boolean().default(false), // 크리에이터 인증 여부
    last_login_at: timestamp(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  });
