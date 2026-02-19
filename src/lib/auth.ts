// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"; // GANTI INI

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Mencari user di database berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        // Validasi password menggunakan bcrypt
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) return null;

        // Mengembalikan objek user termasuk role untuk disimpan di JWT
        return { 
          id: user.id, 
          email: user.email, 
          name: user.name,
          role: user.role 
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Menambahkan role ke dalam JWT token agar bisa diakses di callback session
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    // Mengirimkan id dan role ke frontend melalui session
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      if (token.role) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});