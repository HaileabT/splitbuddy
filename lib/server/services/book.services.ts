import { booksRepo, membersRepo } from "../db/repos"
import { LoanBook, LoanBookMember } from "../db/schema";

async function create() {

}

type UserBooksType = (LoanBook & { membership: LoanBookMember })[]

async function getUserBooks(id: string): Promise<UserBooksType> {
    const memberships = await membersRepo.getMany({ userId: id });
    if (!memberships || memberships.length < 1) {
        return [];
    }

    const data: UserBooksType = [];

    for (const m of memberships) {
        const book = await booksRepo.get(m.loanBookId);
        if (!book) continue;
        data.push({ ...book, membership: m });
    }

    return data;
}

async function inviteMember() {

}

async function removeMember() {

}

async function getMembers() {

}

async function update() {

}

async function remove() {

}

export const bookServices = { create, getUserBooks, remove, inviteMember, removeMember, getMembers, update }