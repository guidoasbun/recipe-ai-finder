import { CognitoIdentityProviderClient, ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";
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

    const command = new ResendConfirmationCodeCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      SecretHash: secretHash,
    });

    await cognitoClient.send(command);

    console.log("Verification code resent to:", email);

    return NextResponse.json(
      { message: "Verification code sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);

    if (error.name === "InvalidParameterException") {
      return NextResponse.json(
        { message: "User is already verified" },
        { status: 400 }
      );
    } else if (error.name === "LimitExceededException") {
      return NextResponse.json(
        { message: "Too many requests. Please try again later" },
        { status: 429 }
      );
    } else if (error.name === "UserNotFoundException") {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Failed to resend verification code. Please try again" },
      { status: 500 }
    );
  }
}
