import { DefaultSession } from "next-auth";

type User = {
    id?: string;
    name: string;
    email: string;
    role?: "user" | "admin",
    profilePic?: string
};

declare module "next-auth" {
    interface Session {
        user: User;
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT extends User {
        iat: number;
        exp: number;
    }

}