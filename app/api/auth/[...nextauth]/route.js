import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma), // Connecte NextAuth à PostgreSQL
  providers: [
    // 1. Connexion via Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    // 2. Connexion via GitHub
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    // 3. Connexion Classique (Email / Mot de passe)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("Données manquantes");
        
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        // Si l'utilisateur s'est inscrit via Google, il n'a pas de mot de passe en base
        if (!user || !user.password) throw new Error("Veuillez vous connecter avec Google/GitHub");

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error("Mot de passe incorrect");

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Lors de la première connexion (user existe), on injecte le rôle
      if (user) {
        token.id = user.id;
        token.role = user.role || "PATIENT"; // "PATIENT" par défaut pour les comptes Google/GitHub
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: { strategy: "jwt" }, // Obligatoire quand on mixe OAuth et Credentials
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };