import { ApiError } from "@/lib/server/error";
import { bookServices } from "@/lib/server/services";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const numericId = Number(id);
        const owner = await bookServices.getBookOwner(numericId);
        if (!owner) {
            return NextResponse.json(formatErrorRespnse(404, "owner not found"), {
                status: 404
            });
        }
        return NextResponse.json(formatSuccessRespnse(200, "owner profile found", 1, owner), {
            status: 200
        });
    } catch (error) {
        let errMsg = "owner not found";
        let status = 404;
        if (error instanceof ApiError) {
            errMsg = error.message;
            status = error.code;
        }
        return NextResponse.json(formatErrorRespnse(status, errMsg), { status });
    }
}
