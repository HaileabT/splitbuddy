ALTER TABLE "invitations" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."invitation_status";--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'cancelled', 'accepted');--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "status" SET DATA TYPE "public"."invitation_status" USING "status"::"public"."invitation_status";