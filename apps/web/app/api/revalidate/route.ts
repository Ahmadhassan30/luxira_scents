import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * On-demand ISR revalidation webhook.
 * Called by the API (e.g. after admin updates a product) to bust Next.js page cache.
 *
 * Security: validates REVALIDATION_SECRET header before doing anything.
 * Without this check anyone could force full catalog rebuilds (DoS vector).
 *
 * Usage: POST /api/revalidate
 * Headers: x-revalidation-secret: <REVALIDATION_SECRET>
 * Body: { "path": "/products/amber-noir" } OR { "tag": "product-amber-noir" }
 */
export async function POST(request: NextRequest) {
    const secret = request.headers.get('x-revalidation-secret');

    if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json() as { path?: string; tag?: string };

        if (body.tag) {
            revalidateTag(body.tag);
            return NextResponse.json({ revalidated: true, tag: body.tag });
        }

        if (body.path) {
            revalidatePath(body.path);
            return NextResponse.json({ revalidated: true, path: body.path });
        }

        return NextResponse.json({ message: 'Provide path or tag' }, { status: 400 });
    } catch {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }
}
