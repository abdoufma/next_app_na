// import { POST_REQUEST } from '@/utils/fetch';

import { NextAuthOptions } from 'next-auth';
import { JWT, JWTDecodeParams, JWTEncodeParams } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { decryptJWT, encryptJWT } from '@/utils/jwt';
// import GithubProvider from 'next-auth/providers/github';

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
const sessionMaxAge = 60; // 1 minute

type User = { id?: string; name: string; email: string; role?: "user" | "admin" };


export const authOptions: NextAuthOptions = {
    cookies: { sessionToken: { name: "jwt", options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" } } },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },

            // @ts-ignore
            async authorize(credentials, { query },) {
                console.log("attempting to log in...");
                console.log({ query });
                if (credentials === undefined) throw new Error('Bad credentials (undefined)');
                console.log("email:", credentials.email);
                try {
                    const res = await fetch(`${backendURL}/authorize`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(credentials)
                    });

                    const response = await res.json();
                    // console.log("response:", response);
                    if (!response.success) throw new Error(response.error ?? 'Email ou mot de passe incorrect');
                    const user = response.user as User
                    if (user == null) throw new Error(response.error ?? "Authentication Error");

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    };

                } catch (err: unknown) {
                    console.log(`[AUTH ERROR]:`, (err as Error).message);
                    throw err;
                }
            },
        }),

        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: sessionMaxAge,
    },
    jwt: {
        async encode({ token, secret, salt }: JWTEncodeParams & { token?: JWT }) {
            // token.
            return await encryptJWT(token, { expiresIn: sessionMaxAge });
        },

        async decode({ token, secret, salt }: JWTDecodeParams) {
            // return a `JWT` object, or `null` if decoding failed
            // console.log(`decoding token:\n`, token)
            return (await decryptJWT(token!)).payload as JWT;
        },
    },

    pages: { signIn: "/login", newUser: "/plaground" },

    callbacks: {
        async signIn({ user }) {
            console.log("signing in...");
            return !!(user);
        },

        async session({ session, user, token }) {
            //TODO: IMPORTANT: user info is inside token. Consider moving the user data into session.user
            // console.log(`[session callback] session:`, session);
            // console.log(`[session callback] user: `, user);
            // console.log(`[session callback] token: `, token);
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role,
                    profilePic: token.profilePic
                }
            };
            // return { ...session, ...token };
        },
        async jwt({ token, user }) {
            return { ...token, ...user };
        },

        redirect: async ({ url, baseUrl }) => url.startsWith("/") ? baseUrl + url : url
        // redirect: async ({ url, baseUrl }) => 'https://google.com'

    }
};
