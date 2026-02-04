CREATE TYPE "public"."notification_type" AS ENUM('follow', 'review', 'reply', 'mention', 'tag', 'system', 'other');--> statement-breakpoint
CREATE TABLE "notification" (
	"notification_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "notification_notification_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"source_profile_id" uuid NOT NULL,
	"target_profile_id" uuid NOT NULL,
	"notification_type" "notification_type" NOT NULL,
	"board_id" bigint,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_source_profile_id_profiles_profile_id_fk" FOREIGN KEY ("source_profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_target_profile_id_profiles_profile_id_fk" FOREIGN KEY ("target_profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_board_id_boards_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("board_id") ON DELETE cascade ON UPDATE no action;