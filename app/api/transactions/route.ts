import { ApiError } from "@/lib/server/error";
import { accountServices, transactionServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const loanBookId = searchParams.get("loanBookId");
        const authorId = searchParams.get("authorId");
        const type = searchParams.get("type");
        const parentId = searchParams.get("parentId");

        const transactions = await transactionServices.getMany({
            loanBookId: loanBookId ? Number(loanBookId) : undefined,
            authorId: authorId ? Number(authorId) : undefined,
            type: type || undefined,
            parentId: parentId ? Number(parentId) : undefined,
        });

        return NextResponse.json(formatSuccessRespnse(200, "transactions list", transactions.length, transactions), { status: 200 });
    } catch (error) {
        let errMsg = "failed to get transactions";
        let status = 500;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const supabase = await getServerAuth();
        const res = await supabase.auth.getUser();

        if (res.error || !res.data.user) {
            return NextResponse.json(formatErrorRespnse(401, "unauthorized: please login first"), { status: 401 });
        }

        const dbUser = await accountServices.getEmailProfile(res.data.user.email || "");
        if (!dbUser) {
            return NextResponse.json(formatErrorRespnse(404, "user profile not found"), { status: 404 });
        }

        const transaction = await transactionServices.create({
            ...body,
            authorId: dbUser.id,
        });

        return NextResponse.json(formatSuccessRespnse(201, "transaction created", 1, transaction), { status: 201 });
    } catch (error) {
        let errMsg = "failed to create transaction";
        let status = 500;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}
