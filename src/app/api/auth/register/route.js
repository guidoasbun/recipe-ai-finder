import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
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
    const { email, password, username } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Generate a unique username (not email format)
    // Since the pool is configured for email alias, we need a non-email username
    const generatedUsername = username || `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const secretHash = calculateSecretHash(
      generatedUsername,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    );

    const userAttributes = [
      {
        Name: "email",
        Value: email,
      },
    ];

    // Add preferred_username if provided
    if (username) {
      userAttributes.push({
        Name: "preferred_username",
        Value: username,
      });
    }

    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: generatedUsername,
      Password: password,
      SecretHash: secretHash,
      UserAttributes: userAttributes,
    });

    const response = await cognitoClient.send(command);

    console.log("User registered successfully:", email);

    return NextResponse.json(
      {
        message: "Registration successful",
        userConfirmed: response.UserConfirmed,
        userSub: response.UserSub,
        username: generatedUsername,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error.name === "UsernameExistsException") {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 }
      );
    } else if (error.name === "InvalidPasswordException") {
      return NextResponse.json(
        { message: "Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, numbers, and special characters" },
        { status: 400 }
      );
    } else if (error.name === "InvalidParameterException") {
      return NextResponse.json(
        { message: error.message || "Invalid email or password format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Registration failed. Please try again" },
      { status: 500 }
    );
  }
}
