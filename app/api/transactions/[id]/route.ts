import { ApiError } from "@/lib/server/error";
import { accountServices, transactionServices } from "@/lib/server/services";
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

        const tx = await transactionServices.get(numericId);
        if (!tx) {
            return NextResponse.json(formatErrorRespnse(404, "transaction not found"), { status: 404 });
        }

        if (tx.loanBookId) {
            const membership = await membersRepo.getMember(tx.loanBookId, dbUser.id);
            if (!membership && user.data.session.user.role !== "admin") {
                return NextResponse.json(formatErrorRespnse(403, "forbidden: you are not a member of this book"), { status: 403 });
            }
        }

        return NextResponse.json(formatSuccessRespnse(200, "transaction found", 1, tx), { status: 200 });
    } catch (error) {
        let errMsg = "transaction not found";
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

        const updatedTx = await transactionServices.update(numericId, dbUser.id, body);

        return NextResponse.json(formatSuccessRespnse(200, "transaction updated", 1, updatedTx), { status: 200 });
    } catch (error) {
        let errMsg = "failed to update transaction";
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

        const removed = await transactionServices.remove(numericId, dbUser.id);

        return NextResponse.json(formatSuccessRespnse(200, "transaction deleted", 1, removed), { status: 200 });
    } catch (error) {
        let errMsg = "failed to delete transaction";
        let status = 500;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}
