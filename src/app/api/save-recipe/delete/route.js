import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { recipeID, imageKey } = await req.json();

  if (!recipeID || !imageKey) {
    return new Response(JSON.stringify({ error: "Missing recipe ID or image key" }), { status: 400 });
  }

  const params = {
    TableName: process.env.DYNAMO_TABLE_NAME,
    Key: {
      recipeID: { S: recipeID },
      userID: { S: session.user.email },
    },
  };

  try {
    await client.send(new DeleteItemCommand(params));

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageKey,
    };

    await s3.send(new DeleteObjectCommand(s3Params));

    return new Response(JSON.stringify({ message: "Recipe and image deleted" }), { status: 200 });
  } catch (err) {
    console.error("Delete failed:", err);
    return new Response(JSON.stringify({ error: "Delete failed" }), { status: 500 });
  }
}