CREATE TABLE "invites" (
	"id" serial PRIMARY KEY NOT NULL,
	"loan_book_id" text NOT NULL,
	"invited_by_user_id" text NOT NULL,
	"identifier" text NOT NULL,
	"status" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loan_book_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"loan_book_id" text NOT NULL,
	"role" "loan_book_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loan_books" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"loan_book_id" text NOT NULL,
	"type" text NOT NULL,
	"amount" text NOT NULL,
	"from_user_id" text NOT NULL,
	"to_user_id" text NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "invites_loan_book_id_idx" ON "invites" USING btree ("loan_book_id");--> statement-breakpoint
CREATE INDEX "invites_identifier_idx" ON "invites" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "invites_status_idx" ON "invites" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invited_user_id_idx" ON "invites" USING btree ("invited_by_user_id");--> statement-breakpoint
CREATE INDEX "loan_book_members_user_id_idx" ON "loan_book_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "loan_book_members_loan_book_id_idx" ON "loan_book_members" USING btree ("loan_book_id");--> statement-breakpoint
CREATE INDEX "loan_book_members_role_idx" ON "loan_book_members" USING btree ("role");--> statement-breakpoint
CREATE INDEX "loan_books_created_at_idx" ON "loan_books" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "transactions_loan_book_id_idx" ON "transactions" USING btree ("loan_book_id");--> statement-breakpoint
CREATE INDEX "transactions_from_user_id_idx" ON "transactions" USING btree ("from_user_id");--> statement-breakpoint
CREATE INDEX "transactions_to_user_id_idx" ON "transactions" USING btree ("to_user_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");