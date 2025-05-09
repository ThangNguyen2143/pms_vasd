import { NextRequest, NextResponse } from "next/server";

// 1. Specify protected and public routes
// const protectedRoutes = ["/", "/product", "/project", "/tasks", "/user"];
const publicRoutes = ["/login"];
// const guessRoutes: string[] = [];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is public
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  // 3. Decrypt the session from the cookie
  // const session = await getSession();
  const session = req.cookies.get("session")?.value;
  let userId: number | null = null;

  try {
    userId = JSON.parse(session || "{}")?.userId;
  } catch (err) {
    console.error("Invalid session cookie:", err);
  }
  // 4. Redirect to /login if the user is not authenticated
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (isPublicRoute && userId) {
    // if (session?.role == "Guess") {
    //   return NextResponse.redirect(new URL("/work_share", req.nextUrl));
    // }
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  // if (session?.role == "Guess") {
  //   const menu = await getMenu();
  //   if (menu) {
  //     guessRoutes.push(...menu.map((item) => `/${item.code}`));
  //   }
  //   const isGuessRoute = guessRoutes.includes(path);
  //   if (!isGuessRoute) {
  //     return NextResponse.redirect(new URL("/404", req.nextUrl));
  //   }
  // }
  // 6. Allow the request to continue if the user is authenticated
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
