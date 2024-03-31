import { withAuth } from "next-auth/middleware"
import { authOptions } from "./lib/auth";

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    (req) => console.log(`[MIDDLEWARE]`, req.nextauth.token),
    {
        ...authOptions,
        callbacks: {
            authorized: ({ token }) => !!token //?.role === "admin"
        },

    }
)

export const config = { matcher: ["/dashboard", "/test"] };