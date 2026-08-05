import { accountServices } from "@/lib/server/services";
import { getServerAuth } from "@/lib/server/supabase/auth";
import { formatErrorRespnse, formatSuccessRespnse } from "@/lib/utils";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    return NextResponse.json(formatErrorRespnse(503, "coming soon"), {
        status: 503
    })
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const res = await accountServices.register(body.name, body.email)
        return NextResponse.json(formatSuccessRespnse(201, "account", 1, res), {
            status: 201,
        })
    } catch (error) {
        let errMsg = "something went wrong"
        let status = 500
        if (error instanceof ApiError) {
            errMsg = error.message
            status = error.statusCode
        }

        const id = body.id;
        const supabase = await getServerAuth()
        await supabase.auth.admin.deleteUser(id)

        return NextResponse.json(formatErrorRespnse(status, errMsg), {
            status
        })
    }
}