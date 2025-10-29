import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ lng: string; ns: string }> }
) {
    const { lng, ns } = await params;

    const namespace = ns.replace('.json', '');

    if (namespace.startsWith('module-')) {
        const moduleName = namespace.replace('module-', '')
        const modulePath = path.join(process.cwd(), 'src', 'modules', moduleName, 'locales', `${lng}.json`)
        if (fs.existsSync(modulePath)) {
            const data = fs.readFileSync(modulePath, 'utf-8')
            return new NextResponse(data, { status: 200, headers: { 'Content-Type': 'application/json' } })
        }
    }

    const publicPath = path.join(process.cwd(), 'public', 'locales', lng, `${namespace}.json`)
    if (fs.existsSync(publicPath)) {
        const data = fs.readFileSync(publicPath, 'utf-8')
        return new NextResponse(data, { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    return new NextResponse(JSON.stringify({ error: 'Not found' }), { status: 404 })
}
