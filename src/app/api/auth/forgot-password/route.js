import { CognitoIdentityProviderClient, ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
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
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const secretHash = calculateSecretHash(
      email,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    );

    const command = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      SecretHash: secretHash,
    });

    await cognitoClient.send(command);

    console.log("Password reset code sent to:", email);

    return NextResponse.json(
      { message: "Password reset code sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    if (error.name === "UserNotFoundException") {
      // For security, don't reveal if user exists or not
      return NextResponse.json(
        { message: "If an account exists with this email, a reset code has been sent" },
        { status: 200 }
      );
    } else if (error.name === "InvalidParameterException") {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    } else if (error.name === "LimitExceededException") {
      return NextResponse.json(
        { message: "Too many requests. Please try again later" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { message: "Failed to send reset code. Please try again" },
      { status: 500 }
    );
  }
}
