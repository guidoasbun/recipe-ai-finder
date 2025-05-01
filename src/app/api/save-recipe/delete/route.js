import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { recipeID } = await req.json();

  if (!recipeID) {
    return new Response(JSON.stringify({ error: "Missing recipe ID" }), { status: 400 });
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
    return new Response(JSON.stringify({ message: "Recipe deleted" }), { status: 200 });
  } catch (err) {
    console.error("Delete failed:", err);
    return new Response(JSON.stringify({ error: "Delete failed" }), { status: 500 });
  }
}