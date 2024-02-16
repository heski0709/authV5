import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/schema";
import bcrypt from "bcryptjs";

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email);

                    if (!user || !user.password) return null;

                    const passwordsMath = await bcrypt.compare(
                        password,
                        user.password
                    );

                    console.log(passwordsMath);
                    if (passwordsMath) return user;
                }

                return null;
            },
        }),
    ],
} satisfies NextAuthConfig;
