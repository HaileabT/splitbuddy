import { ApiError } from "@/lib/server/error";
import { accountServices, bookServices } from "@/lib/server/services";
import { membersRepo } from "@/lib/server/db/repos";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await getServerAuth();
    const user = await supabase.auth.getSession();
    if (!user.data.session?.user) {
        return NextResponse.json(formatErrorRespnse(401, "unauthorized"), { status: 401 });
    }

    try {
        const { id } = await params;
        const numericId = Number(id);

        const dbUser = await accountServices.getEmailProfile(user.data.session.user.email || "");
        if (!dbUser) {
            return NextResponse.json(formatErrorRespnse(404, "user profile not found"), { status: 404 });
        }

        const membership = await membersRepo.getMember(numericId, dbUser.id);
        if (!membership && user.data.session.user.role !== "admin") {
            return NextResponse.json(formatErrorRespnse(403, "forbidden: you are not a member of this book"), { status: 403 });
        }

        const book = await bookServices.get(numericId);
        if (!book) {
            return NextResponse.json(formatErrorRespnse(404, "book not found"), { status: 404 });
        }
        return NextResponse.json(formatSuccessRespnse(200, "book found", 1, book), { status: 200 });
    } catch (error) {
        let errMsg = "book not found";
        let status = 404;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await getServerAuth();
    const user = await supabase.auth.getSession();
    if (!user.data.session?.user) {
        return NextResponse.json(formatErrorRespnse(401, "unauthorized"), { status: 401 });
    }

    try {
        const { id } = await params;
        const numericId = Number(id);
        const body = await req.json();

        const dbUser = await accountServices.getEmailProfile(user.data.session.user.email || "");
        if (!dbUser) {
            return NextResponse.json(formatErrorRespnse(404, "user profile not found"), { status: 404 });
        }

        const updatedBook = await bookServices.update(numericId, dbUser.id, body.name || "");
        return NextResponse.json(formatSuccessRespnse(200, "book updated", 1, updatedBook), { status: 200 });
    } catch (error) {
        let errMsg = "failed to update book";
        let status = 500;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await getServerAuth();
    const user = await supabase.auth.getSession();
    if (!user.data.session?.user) {
        return NextResponse.json(formatErrorRespnse(401, "unauthorized"), { status: 401 });
    }

    try {
        const { id } = await params;
        const numericId = Number(id);

        const dbUser = await accountServices.getEmailProfile(user.data.session.user.email || "");
        if (!dbUser) {
            return NextResponse.json(formatErrorRespnse(404, "user profile not found"), { status: 404 });
        }

        const removed = await bookServices.remove(numericId, dbUser.id);
        return NextResponse.json(formatSuccessRespnse(200, "book deleted", 1, removed), { status: 200 });
    } catch (error) {
        let errMsg = "failed to delete book";
        let status = 500;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}