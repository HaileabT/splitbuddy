import { accountsRepo } from "@/lib/server/db/repos";
import { invitationServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
    const { key } = await params;
    const invitation = await invitationServices.getByKey(key);

    if (!invitation) {
        return NextResponse.json(formatErrorRespnse(404, "invitation not found"), { status: 404 })
    }

    return NextResponse.json(formatSuccessRespnse(200, "invitation found", 1, invitation));
}