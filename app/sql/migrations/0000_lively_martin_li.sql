CREATE TYPE "public"."join_path" AS ENUM('email', 'google', 'kakao', 'naver');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('traveler', 'creator');--> statement-breakpoint
CREATE TYPE "public"."business_category" AS ENUM('restaurant', 'cafe', 'performance', 'exhibition', 'shopping', 'accommodation', 'attraction', 'entertainment', 'sports', 'spa', 'other');--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"phone" text,
	"avatar" text,
	"username" text,
	"country" text,
	"language" text,
	"interests" text[],
	"role" "role" DEFAULT 'traveler' NOT NULL,
	"join_path" "join_path" DEFAULT 'email' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "board_images" (
	"image_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "board_images_image_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"board_id" bigint NOT NULL,
	"image_url" text NOT NULL,
	"image_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "board_likes" (
	"board_id" bigint,
	"profile_id" uuid,
	CONSTRAINT "board_likes_board_id_profile_id_pk" PRIMARY KEY("board_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "boards" (
	"board_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "boards_board_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"region" text NOT NULL,
	"city" text NOT NULL,
	"location" text NOT NULL,
	"bcategory" "business_category" NOT NULL,
	"theme" text,
	"sub_themes" text[],
	"seasons" text[],
	"description" text NOT NULL,
	"thumbnail_image" text NOT NULL,
	"keywords" text[],
	"business_info" jsonb,
	"recommended_seasons" text[],
	"stats" jsonb DEFAULT '{"views":0,"clippings":0,"likes":0}'::jsonb NOT NULL,
	"profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_images" ADD CONSTRAINT "board_images_board_id_boards_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("board_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_likes" ADD CONSTRAINT "board_likes_board_id_boards_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("board_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_likes" ADD CONSTRAINT "board_likes_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;