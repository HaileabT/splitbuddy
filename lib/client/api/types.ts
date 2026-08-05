import { LoanBook, LoanBookMember } from "@/lib/server/db/schema";

export type UserBooksResponseType = (LoanBook & { membership: LoanBookMember })