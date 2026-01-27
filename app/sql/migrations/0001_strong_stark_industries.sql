CREATE TYPE "public"."status" AS ENUM('draft', 'published', 'archived', 'hidden');--> statement-breakpoint
CREATE TABLE "board_itineraries" (
	"board_id" bigint NOT NULL,
	"itinerary_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "board_itineraries_board_id_itinerary_id_pk" PRIMARY KEY("board_id","itinerary_id")
);
--> statement-breakpoint
CREATE TABLE "itineraries" (
	"itinerary_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "itineraries_itinerary_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"description" text,
	"slug" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"region" text NOT NULL,
	"city" text NOT NULL,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false,
	"stats" jsonb DEFAULT '{"views":0,"likes":0,"shares":0,"saves":0}'::jsonb,
	"profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "itineraries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "boards" RENAME COLUMN "keywords" TO "slug";--> statement-breakpoint
ALTER TABLE "boards" ALTER COLUMN "stats" SET DEFAULT '{"views":0,"saves":0,"likes":0}'::jsonb;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "timezone" text DEFAULT 'UTC';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "preferred_currency" text DEFAULT 'KRW';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "email_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "phone_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "notification_settings" jsonb DEFAULT '{"email":false,"push":false,"marketing":false}'::jsonb;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "privacy_settings" jsonb DEFAULT '{"profile_visibility":"public","show_email":false,"show_phone":false}'::jsonb;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "stats" jsonb DEFAULT '{"boards_count":0,"followers_count":0,"following_count":0}'::jsonb;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "last_login_at" timestamp;--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "coordinates" jsonb;--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "tags" text[];--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "status" "status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "is_featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "boards" ADD COLUMN "related_board_ids" bigint[];--> statement-breakpoint
ALTER TABLE "board_itineraries" ADD CONSTRAINT "board_itineraries_board_id_boards_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("board_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_itineraries" ADD CONSTRAINT "board_itineraries_itinerary_id_itineraries_itinerary_id_fk" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("itinerary_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_slug_unique" UNIQUE("slug");