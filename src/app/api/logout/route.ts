import makeFetchRequest from "@/utils/fetch/makeFetchRequest";
import { NextResponse } from "next/server";

export async function GET(request: any) {
    const { status } = await makeFetchRequest({
        url: '/logout',
        method: 'GET',
        credentials: "include"
    })

    if(status === 200) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}