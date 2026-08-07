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

        const reqMembership = await membersRepo.getMember(numericId, dbUser.id);
        if (!reqMembership && user.data.session.user.role !== "admin") {
            return NextResponse.json(formatErrorRespnse(403, "forbidden: only members can manage book members"), { status: 403 });
        }

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
    const supabase = await getServerAuth();
    const user = await supabase.auth.getSession();
    if (!user.data.session?.user) {
        return NextResponse.json(formatErrorRespnse(401, "unauthorized"), { status: 401 });
    }

    try {
        const { id } = await params;
        const numericId = Number(id);

        const { searchParams } = new URL(req.url);
        const targetUserIdStr = searchParams.get("targetUserId");
        if (!targetUserIdStr) {
            return NextResponse.json(formatErrorRespnse(400, "targetUserId query param required"), { status: 400 });
        }

        const dbUser = await accountServices.getEmailProfile(user.data.session.user.email || "");
        if (!dbUser) {
            return NextResponse.json(formatErrorRespnse(404, "user profile not found"), { status: 404 });
        }

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
