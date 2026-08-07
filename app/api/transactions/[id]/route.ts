import { ApiError } from "@/lib/server/error";
import { accountServices, transactionServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const numericId = Number(id);

        const tx = await transactionServices.get(numericId);
        if (!tx) {
            return NextResponse.json(formatErrorRespnse(404, "transaction not found"), { status: 404 });
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
    try {
        const { id } = await params;
        const numericId = Number(id);

        const supabase = await getServerAuth();
        const res = await supabase.auth.getUser();
        if (res.error || !res.data.user) {
            return NextResponse.json(formatErrorRespnse(401, "unauthorized: please login first"), { status: 401 });
        }

        const dbUser = await accountServices.getEmailProfile(res.data.user.email || "");
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
