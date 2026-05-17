import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDbConnection } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "SaaS Portal Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        try {
          const pool = await getDbConnection();
          const result = await pool.request()
            .input('username', credentials.username)
            .query(`
              SELECT ua.*, s.FullName as StudentName, s.Email as StudentEmail
              FROM UserAccounts ua
              LEFT JOIN Students s ON ua.StudentID = s.StudentID
              WHERE ua.Username = @username
            `);

          const user = result.recordset[0];

          if (user && credentials.password === user.PasswordHash) {
            return {
              id: user.UserID.toString(),
              name: user.StudentName || user.Username,
              email: user.StudentEmail || null,
              role: user.Role,
              ownerId: user.OwnerID || null,
              studentId: user.StudentID || null,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.ownerId = (user as any).ownerId;
        token.studentId = (user as any).studentId;
        token.displayName = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).ownerId = token.ownerId;
        (session.user as any).studentId = token.studentId;
        (session.user as any).displayName = token.displayName;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
