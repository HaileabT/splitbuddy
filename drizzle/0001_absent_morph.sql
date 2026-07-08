ALTER TABLE "loan_books" ADD COLUMN "name" varchar(128);--> statement-breakpoint
CREATE INDEX "loan_books_name_idx" ON "loan_books" USING btree ("name");