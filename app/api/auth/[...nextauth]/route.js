import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Optionnel : Forcer le rôle lors de la création via Google si besoin
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? "PATIENT", // Définit le rôle par défaut à la création
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: profile.role ?? "PATIENT",
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Identifiants manquants");
        }
        
        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email } 
        });

        if (!user) throw new Error("Aucun utilisateur trouvé avec cet email");
        
        if (!user.password) {
          throw new Error("Ce compte utilise une connexion sociale (Google/GitHub)");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error("Mot de passe incorrect");

        // On retourne l'utilisateur AVEC son rôle récupéré en DB
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, 
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Lors de la connexion initiale, l'objet 'user' est disponible
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // 2. RECHERCHE EN DB (Optionnel mais recommandé) : 
      // Si le token n'a pas de rôle (ex: session persistante), on peut rafraîchir depuis la DB
      if (!token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { role: true }
        });
        if (dbUser) token.role = dbUser.role;
      }

      return token;
    },
    async session({ session, token }) {
      // On injecte les données du token dans la session accessible côté client
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || "PATIENT";
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // Redirige les erreurs vers la page de login
  },
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };