import { ApiError } from "@/lib/server/error";
import { accountServices, bookServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const numericId = Number(id);
        const book = await bookServices.get(numericId);
        if (!book) {
            return NextResponse.json(formatErrorRespnse(404, "book not found"), {
                status: 404
            });
        }
        return NextResponse.json(formatSuccessRespnse(200, "book found", 1, book), {
            status: 200
        });
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
    try {
        const { id } = await params;
        const numericId = Number(id);
        const body = await req.json();

        const supabase = await getServerAuth();
        const res = await supabase.auth.getUser();
        if (res.error || !res.data.user) {
            return NextResponse.json(formatErrorRespnse(401, "unauthorized: please login first"), { status: 401 });
        }

        const dbUser = await accountServices.getEmailProfile(res.data.user.email || "");
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
    try {
        const { id } = await params;
        const numericId = Number(id);

        const supabase = await getServerAuth();
        const res = await supabase.auth.getUser();
        if (res.error || !res.data.user) {
            return NextResponse.json(formatErrorRespnse(401, "unauthorized: please login first"), { status: 401 });
        }

        const dbUser = await accountServices.getEmailProfile(res.data.user.email || "");
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