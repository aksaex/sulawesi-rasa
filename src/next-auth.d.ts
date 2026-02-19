// Buat file: src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  // Memperluas tipe Session
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  // Memperluas tipe User
  interface User extends DefaultUser {
    role: string;
  }
}