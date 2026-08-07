import { ApiError } from "@/lib/server/error";
import { invitationServices } from "@/lib/server/services";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const numericId = Number(id);

        const invitation = await invitationServices.get(numericId);
        if (!invitation) {
            return NextResponse.json(formatErrorRespnse(404, "invitation not found"), { status: 404 });
        }

        return NextResponse.json(formatSuccessRespnse(200, "invitation found", 1, invitation), { status: 200 });
    } catch (error) {
        let errMsg = "invitation not found";
        let status = 404;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}
