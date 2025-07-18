import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
        if (token) {
            try {
                const verificationResponse = await fetch(
                    `${request.nextUrl.origin}/api/auth/verify`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token }),
                    }
                );

                const result = await verificationResponse.json();

                if (!result.valid) {
                    const loginUrl = new URL("/admin/login", request.url);
                    return NextResponse.redirect(loginUrl);
                }
            } catch (error) {
                console.error("Middleware token verification failed:", error);
                const loginUrl = new URL("/admin/login", request.url);
                return NextResponse.redirect(loginUrl);
            }
        } else {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/dashboard/:path*"],
};
