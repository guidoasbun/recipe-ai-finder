import { NextResponse } from "next/server";
import { saveRecipeToDynamo } from "@/lib/dynamo";
import { uploadImageToS3 } from "@/lib/s3";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, recipe } = body;

    if (!userId || !recipe) {
      return NextResponse.json({ error: "Missing userId or recipe" }, { status: 400 });
    }

    let imageUrl = recipe.image;

    // Server-side fetch of the OpenAI image
    try {
      const imageRes = await fetch(recipe.image);
      const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
      const fileType = imageRes.headers.get("content-type");
      imageUrl = await uploadImageToS3(imageBuffer, fileType);
    } catch (error) {
      console.error("Image upload to S3 failed. Using original image URL.", error);
    }

    await saveRecipeToDynamo(userId, {
      ...recipe,
      image: imageUrl,
    });

    return NextResponse.json({ message: "Recipe saved successfully" });
  } catch (err) {
    console.error("Failed to save recipe:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}