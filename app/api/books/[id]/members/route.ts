import { ApiError } from "@/lib/server/error";
import { accountServices, bookServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const numericId = Number(id);

        const members = await bookServices.getMembers(numericId);
        return NextResponse.json(formatSuccessRespnse(200, "members list", members.length, members), { status: 200 });
    } catch (error) {
        let errMsg = "failed to get members";
        let status = 500;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const numericId = Number(id);
        const body = await req.json();

        const member = await bookServices.addMember(numericId, body.userId, body.role);
        return NextResponse.json(formatSuccessRespnse(201, "member added", 1, member), { status: 201 });
    } catch (error) {
        let errMsg = "failed to add member";
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

        const { searchParams } = new URL(req.url);
        const targetUserIdStr = searchParams.get("targetUserId");
        if (!targetUserIdStr) {
            return NextResponse.json(formatErrorRespnse(400, "targetUserId query param required"), { status: 400 });
        }

        const supabase = await getServerAuth();
        const res = await supabase.auth.getUser();
        if (res.error || !res.data.user) {
            return NextResponse.json(formatErrorRespnse(401, "unauthorized: please login first"), { status: 401 });
        }

        const dbUser = await accountServices.getEmailProfile(res.data.user.email || "");
        const removed = await bookServices.removeMember(numericId, Number(targetUserIdStr), dbUser.id);
        return NextResponse.json(formatSuccessRespnse(200, "member removed", 1, removed), { status: 200 });
    } catch (error) {
        let errMsg = "failed to remove member";
        let status = 500;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}
