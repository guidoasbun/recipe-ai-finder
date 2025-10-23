import { CognitoIdentityProviderClient, ConfirmSignUpCommand, ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";
import { NextResponse } from "next/server";
import crypto from "crypto";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

// Function to calculate SECRET_HASH
function calculateSecretHash(username, clientId, clientSecret) {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

export async function POST(req) {
  try {
    const { username, email, code, action } = await req.json();

    // Use email if username not provided (for backwards compatibility)
    const usernameOrEmail = username || email;

    if (!usernameOrEmail) {
      return NextResponse.json(
        { message: "Username or email is required" },
        { status: 400 }
      );
    }

    const secretHash = calculateSecretHash(
      usernameOrEmail,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    );

    // Handle resend code action
    if (action === "resend") {
      const resendCommand = new ResendConfirmationCodeCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: usernameOrEmail,
        SecretHash: secretHash,
      });

      await cognitoClient.send(resendCommand);

      console.log("Verification code resent to:", usernameOrEmail);

      return NextResponse.json(
        { message: "Verification code has been resent to your email" },
        { status: 200 }
      );
    }

    // Handle verification
    if (!code) {
      return NextResponse.json(
        { message: "Verification code is required" },
        { status: 400 }
      );
    }

    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: usernameOrEmail,
      ConfirmationCode: code,
      SecretHash: secretHash,
    });

    await cognitoClient.send(command);

    console.log("Email verified successfully for:", usernameOrEmail);

    return NextResponse.json(
      { message: "Email verified successfully! You can now log in." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);

    if (error.name === "CodeMismatchException") {
      return NextResponse.json(
        { message: "Invalid verification code. Please try again" },
        { status: 400 }
      );
    } else if (error.name === "ExpiredCodeException") {
      return NextResponse.json(
        { message: "Verification code has expired. Please request a new one" },
        { status: 400 }
      );
    } else if (error.name === "NotAuthorizedException") {
      return NextResponse.json(
        { message: "User is already confirmed" },
        { status: 400 }
      );
    } else if (error.name === "LimitExceededException") {
      return NextResponse.json(
        { message: "Too many attempts. Please try again later" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Failed to verify email. Please try again" },
      { status: 500 }
    );
  }
}
