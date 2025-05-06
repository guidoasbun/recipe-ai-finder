import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { saveUserToDynamo } from "@/lib/dynamo";

export const authOptions = {
  trustHost: true,
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
      profile: (profile) => {
        return {
          id: profile.sub,
          email: profile.email,
          username:
            profile.username || profile["cognito:username"] || profile.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && user) {
        await saveUserToDynamo({
          id: profile.sub,
          email: profile.email,
          username:
            profile.username || profile["cognito:username"] || profile.email,
        });

        return {
          ...token,
          accessToken: account.access_token,
          idToken: account.id_token,
          refreshToken: account.refresh_token,
          email: user.email,
          username: user.username,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          accessToken: token.accessToken,
          email: token.email,
          username: token.username,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// const handler = NextAuth({
//   providers: [
//     CognitoProvider({
//       clientId: process.env.COGNITO_CLIENT_ID,
//       clientSecret: process.env.COGNITO_CLIENT_SECRET,
//       issuer: process.env.COGNITO_ISSUER,
//       profile: (profile) => {
//         return {
//           id: profile.sub,
//           email: profile.email,
//           username:
//             profile.username || profile["cognito:username"] || profile.email,
//         };
//       },
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, account, profile, user }) {
//       // Initial sign in
//       if (account && user) {
//         // Save user once on sign-in
//         await saveUserToDynamo({
//           id: profile.sub,
//           email: profile.email,
//           username:
//               profile.username || profile["cognito:username"] || profile.email,
//         });
//
//         return {
//           ...token,
//           accessToken: account.access_token,
//           idToken: account.id_token,
//           refreshToken: account.refresh_token,
//           email: user.email,
//           username: user.username,
//         };
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           accessToken: token.accessToken,
//           email: token.email,
//           username: token.username,
//         },
//       };
//     },
//   },
// });
//
// export { handler as GET, handler as POST };
