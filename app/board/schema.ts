import {bigint, check, integer, jsonb, pgEnum, pgTable, primaryKey, text, timestamp, uuid, boolean, numeric,} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { profiles } from "~/auth/schema";

// 업종 enum 정의
export const businessCategory = pgEnum("business_category", [
    "restaurant",      // 음식점
    "cafe",           // 카페
    "performance",    // 공연
    "exhibition",     // 전시장
    "shopping",       // 쇼핑
    "accommodation",  // 숙박
    "attraction",     // 관광지
    "entertainment",  // 엔터테인먼트
    "sports",         // 스포츠
    "spa",            // 스파/웰니스
    "other",          // 기타
  ]);

// 게시물 상태 enum
export const status = pgEnum("status", [
    "draft",      // 임시 저장
    "published",  // 게시됨
    "archived",   // 보관됨
    "hidden",     // 숨김
]);
  
export const boards = pgTable("boards", {
    board_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    slug: text().unique(),

    region: text().notNull(),
    city: text().notNull(),
    location: text().notNull(),
    coordinates: jsonb().$type<{ lat: number; lng: number }>(), // 지도 기능용 좌표
    
    bcategory: businessCategory().notNull(),
    theme: text(),
    sub_themes: text().array(),
    seasons: text().array(),
    description: text().notNull(),           // text 타입은 최대 1GB까지 가능 (PostgreSQL)
    thumbnail_image: text().notNull(),       // 대표 이미지 (리스트에서 보여줄 이미지)
    tags: text().array(),
    // 영업 정보 (JSONB로 유연하게 저장)
    business_info: jsonb().$type<{
        hours?: {
            monday?: { open: string; close: string; closed?: boolean };
            tuesday?: { open: string; close: string; closed?: boolean };
            wednesday?: { open: string; close: string; closed?: boolean };
            thursday?: { open: string; close: string; closed?: boolean };
            friday?: { open: string; close: string; closed?: boolean };
            saturday?: { open: string; close: string; closed?: boolean };
            sunday?: { open: string; close: string; closed?: boolean };
        };
        holidays?: string[]; // 휴일 날짜 배열 (예: ["2024-01-01", "2024-12-25"])
        regularHoliday?: string; // 정기 휴일 (예: "매주 월요일")
        note?: string; // 영업시간 관련 추가 정보
    }>(),
    recommended_seasons: text().array(),
    stats: jsonb().notNull().default({ views: 0, saves: 0, likes: 0 }),
    
    status: status().default("draft").notNull(),
    is_featured: boolean().default(false), // 추천 게시물
    is_verified: boolean().default(false), // 검증된 게시물
    published_at: timestamp(),
    related_board_ids: bigint({ mode: "number" }).array(),
    profile_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }).notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
});

// 여러 이미지를 저장하는 별도 테이블
export const board_images = pgTable("board_images", {
    image_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    board_id: bigint({ mode: "number" }).references(() => boards.board_id, { onDelete: "cascade" }).notNull(),
    image_url: text().notNull(),
    image_order: integer().notNull().default(0), // 이미지 순서
    created_at: timestamp().notNull().defaultNow(),
});

export const board_likes = pgTable("board_likes",{
    board_id: bigint({ mode: "number" }).references(() => boards.board_id,{onDelete: "cascade",}),
    profile_id: uuid().references(() => profiles.profile_id, {onDelete: "cascade",}),
  },(table) => [primaryKey({ columns: [table.board_id, table.profile_id] })]
);

// 일정 테이블
export const itineraries = pgTable("itineraries", {
    itinerary_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    description: text(),
    slug: text().unique(),
    // 여행 기간
    start_date: timestamp().notNull(),
    end_date: timestamp().notNull(),
    // 여행 지역
    region: text().notNull(),
    city: text().notNull(),
    // 일정 설정
    status: status().default("draft").notNull(),
    is_featured: boolean().default(false),
    // 통계
    stats: jsonb().$type<{
        views?: number;
        likes?: number;
        shares?: number;
        saves?: number;
    }>().default({ views: 0, likes: 0, shares: 0, saves: 0 }),
    // 작성자
    profile_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }).notNull(),
    
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
});

// 일정과 게시물 연결 테이블 (Many-to-Many 관계)
export const board_itineraries = pgTable("board_itineraries", {
    board_id: bigint({ mode: "number" }).references(() => boards.board_id, { onDelete: "cascade" }).notNull(),
    itinerary_id: bigint({ mode: "number" }).references(() => itineraries.itinerary_id, { onDelete: "cascade" }).notNull(),
    created_at: timestamp().notNull().defaultNow(),
}, (table) => [
    primaryKey({ columns: [table.board_id, table.itinerary_id] })
]);