import { NextRequest, NextResponse } from "next/server";

// 1. Specify protected and public routes
// const protectedRoutes = ["/", "/product", "/project", "/tasks", "/user"];
const publicRoutes = ["/login"];
const defaultGuessRoute = "/work_share";

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is public
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  // 3. Decrypt the session from the cookie
  // const session = await getSession();
  const session = req.cookies.get("session")?.value;
  let userId: number | null = null;
  let role: string | null = null;
  const guessRoutesCookie = req.cookies.get("menuRoutes")?.value;
  let guessRoutes: string[] = [];

  try {
    const sessionData = JSON.parse(session || "{}");
    userId = sessionData.userId;
    role = sessionData?.role;
  } catch (err) {
    console.error("Invalid session cookie:", err);
  }
  try {
    guessRoutes = JSON.parse(guessRoutesCookie || "[]") || [defaultGuessRoute];
  } catch (e) {
    console.error("Failed to parse guessRoutes cookie", e);
  }
  // 4. Redirect to /login if the user is not authenticated
  if (!session && !isPublicRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  if (role === "Guess" && !guessRoutes.includes(path)) {
    return NextResponse.redirect(new URL(defaultGuessRoute, req.nextUrl));
  }
  // 5. Redirect to /dashboard if the user is authenticated
  if (isPublicRoute && userId) {
    // if (session?.role == "Guess") {
    //   return NextResponse.redirect(new URL("/work_share", req.nextUrl));
    // }
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // 6. Allow the request to continue if the user is authenticated
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
