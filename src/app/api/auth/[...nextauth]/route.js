import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { saveUserToDynamo } from "@/lib/dynamo";
import crypto from "crypto";

// Initialize Cognito Identity Provider Client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

// Function to calculate SECRET_HASH (required for client secret)
function calculateSecretHash(username, clientId, clientSecret) {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

export const authOptions = {
  trustHost: true,
  providers: [
    // Google OAuth Provider (direct Google sign-in, no Cognito redirect)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account", // Forces account selection every time
        },
      },
    }),
    // Credentials Provider (for email/password sign-in via Cognito)
    CredentialsProvider({
      name: "Cognito",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const secretHash = calculateSecretHash(
            credentials.email,
            process.env.COGNITO_CLIENT_ID,
            process.env.COGNITO_CLIENT_SECRET
          );

          // Authenticate with Cognito using USER_PASSWORD_AUTH flow
          const authCommand = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: process.env.COGNITO_CLIENT_ID,
            AuthParameters: {
              USERNAME: credentials.email,
              PASSWORD: credentials.password,
              SECRET_HASH: secretHash,
            },
          });

          const authResponse = await cognitoClient.send(authCommand);

          if (!authResponse.AuthenticationResult) {
            throw new Error("Authentication failed - no result");
          }

          const { AccessToken, IdToken, RefreshToken } =
            authResponse.AuthenticationResult;

          // Decode the ID token to get user info
          const idTokenPayload = JSON.parse(
            Buffer.from(IdToken.split(".")[1], "base64").toString()
          );

          console.log("Authentication successful for:", credentials.email);
          return {
            id: idTokenPayload.sub,
            email: idTokenPayload.email,
            username:
              idTokenPayload["cognito:username"] || idTokenPayload.email,
            accessToken: AccessToken,
            idToken: IdToken,
            refreshToken: RefreshToken,
          };
        } catch (error) {
          console.error("Cognito authentication error:", error);

          // Handle specific Cognito errors
          if (error.name === "NotAuthorizedException") {
            throw new Error("Incorrect username or password");
          } else if (error.name === "UserNotConfirmedException") {
            throw new Error("UserNotConfirmedException");
          } else if (error.name === "UserNotFoundException") {
            throw new Error("UserNotFoundException");
          }

          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Custom sign-in page
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // On first sign in (when user object exists)
      if (user) {
        // Handle Google OAuth login (direct Google sign-in)
        if (account?.provider === "google") {
          const userId = token.sub || user.id;
          const userEmail = token.email || user.email || profile?.email;
          const userName = user.name || profile?.name || userEmail?.split("@")[0];

          // Save user to DynamoDB (will be created if first time)
          await saveUserToDynamo({
            id: userId,
            email: userEmail,
            username: userName,
          });

          console.log("Google authentication successful for:", userEmail);

          return {
            ...token,
            accessToken: account.access_token,
            idToken: account.id_token,
            refreshToken: account.refresh_token,
            email: userEmail,
            username: userName,
            sub: userId,
          };
        }

        // Handle credentials login (email/password via Cognito)
        await saveUserToDynamo({
          id: user.id,
          email: user.email,
          username: user.username,
        });

        return {
          ...token,
          accessToken: user.accessToken,
          idToken: user.idToken,
          refreshToken: user.refreshToken,
          email: user.email,
          username: user.username,
          sub: user.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          accessToken: token.accessToken,
          idToken: token.idToken,
          email: token.email,
          username: token.username,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
