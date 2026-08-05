import { accountServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: number }> }) {
    // const { id } = await params;
    // const account = await accountServices.(id);
    // return NextResponse.json(formatSuccessRespnse(200, "profile found", 1, account), {
    //     status: 200
    // })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    const body = await req.json()
    const account = await accountServices.update(id, body.name);
    return NextResponse.json(formatSuccessRespnse(200, "profile updated", 1, account), {
        status: 200
    })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: number, sid: string }> }) {
    const { id, sid } = await params;
    const supabase = await getServerAuth();
    const user = await supabase.auth.getUser();
    if (!user.data.user?.id || user.data.user.id !== sid) {
        return NextResponse.json(formatErrorRespnse(403, "forbidden"), {
            status: 403
        })
    }
    const account = await accountServices.remove(id);
    await supabase.auth.admin.deleteUser(user.data.user.id);

    return NextResponse.json(undefined, {
        status: 204
    });
}