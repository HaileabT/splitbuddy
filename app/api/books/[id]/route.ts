import { bookServices } from "@/lib/server/services";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    const account = await bookServices.get(id);
    if (!account) {
        return NextResponse.json(formatErrorRespnse(404, "book not found"), {
            status: 404
        })
    }
    return NextResponse.json(formatSuccessRespnse(200, "book found", 1, account), {
        status: 200
    })
}