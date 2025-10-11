import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const body = await request.json()
    const locale = JSON.parse(body).locale

    const response = NextResponse.json({ success: true })
    
    response.cookies.set('i18next', locale, { 
        path: '/', 
        maxAge: 60 * 60 * 24 * 365 
    })

    return response
}