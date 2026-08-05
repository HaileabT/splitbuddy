CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'cancelled', 'accepted');--> statement-breakpoint
CREATE TYPE "public"."loan_book_role" AS ENUM('owner', 'member');--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"loan_book_id" integer NOT NULL,
	"invited_by_user_id" text NOT NULL,
	"invited_user_email" text NOT NULL,
	"key" text NOT NULL,
	"status" "invitation_status",
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loan_book_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"loan_book_id" integer NOT NULL,
	"role" "loan_book_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loan_books" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"loan_book_id" integer NOT NULL,
	"type" text NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"paid_amount" numeric(15, 2),
	"authorId" text NOT NULL,
	"parent_id" integer,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_loan_book_id_loan_books_id_fk" FOREIGN KEY ("loan_book_id") REFERENCES "public"."loan_books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_book_members" ADD CONSTRAINT "loan_book_members_loan_book_id_loan_books_id_fk" FOREIGN KEY ("loan_book_id") REFERENCES "public"."loan_books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_loan_book_id_loan_books_id_fk" FOREIGN KEY ("loan_book_id") REFERENCES "public"."loan_books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_parent_id_transactions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invitations_loan_book_id_idx" ON "invitations" USING btree ("loan_book_id");--> statement-breakpoint
CREATE INDEX "invitations_identifier_idx" ON "invitations" USING btree ("key");--> statement-breakpoint
CREATE INDEX "invitations_status_idx" ON "invitations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invited_user_id_idx" ON "invitations" USING btree ("invited_by_user_id");--> statement-breakpoint
CREATE INDEX "loan_book_members_user_id_idx" ON "loan_book_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "loan_book_members_loan_book_id_idx" ON "loan_book_members" USING btree ("loan_book_id");--> statement-breakpoint
CREATE INDEX "loan_book_members_roles_on_book_ids_idx" ON "loan_book_members" USING btree ("role","loan_book_id");--> statement-breakpoint
CREATE INDEX "loan_book_members_role_idx" ON "loan_book_members" USING btree ("role");--> statement-breakpoint
CREATE INDEX "loan_book_member_ids_on_roles_idx" ON "loan_book_members" USING btree ("role","user_id");--> statement-breakpoint
CREATE INDEX "loan_books_created_at_idx" ON "loan_books" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "loan_books_name_idx" ON "loan_books" USING btree ("name");--> statement-breakpoint
CREATE INDEX "transactions_loan_book_id_idx" ON "transactions" USING btree ("loan_book_id");--> statement-breakpoint
CREATE INDEX "transactions_user_id_idx" ON "transactions" USING btree ("authorId");