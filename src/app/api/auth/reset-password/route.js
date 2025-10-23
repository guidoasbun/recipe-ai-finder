import { CognitoIdentityProviderClient, ConfirmForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
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
    const { email, code, password } = await req.json();

    if (!email || !code || !password) {
      return NextResponse.json(
        { message: "Email, code, and new password are required" },
        { status: 400 }
      );
    }

    const secretHash = calculateSecretHash(
      email,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    );

    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: password,
      SecretHash: secretHash,
    });

    await cognitoClient.send(command);

    console.log("Password reset successful for:", email);

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);

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
    } else if (error.name === "InvalidPasswordException") {
      return NextResponse.json(
        { message: "Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, numbers, and special characters" },
        { status: 400 }
      );
    } else if (error.name === "LimitExceededException") {
      return NextResponse.json(
        { message: "Too many attempts. Please try again later" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Failed to reset password. Please try again" },
      { status: 500 }
    );
  }
}
