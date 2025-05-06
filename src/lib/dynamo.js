import { v4 as uuidv4 } from "uuid";
import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export async function saveUserToDynamo(user) {
    const item = {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: new Date().toISOString(),
    };

    try {
        await docClient.send(new PutItemCommand({
            TableName: "Users-recipe-ai",
            Item: marshall(item),
        }));
        console.log("User saved to DynamoDB");
    } catch (err) {
        console.error("DynamoDB save error:", err);
    }
}


export async function saveRecipeToDynamo(userId, recipe) {
    const item = {
        recipeID: uuidv4(),
        userID: userId,
        title: recipe.title,
        description: recipe.description,
        image: recipe.image || null,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        createdAt: new Date().toISOString(),
    };

    try {
        await docClient.send(new PutItemCommand({
            TableName: "Recipes-recipe-ai",
            Item: marshall(item),
        }));
        console.log("Recipe saved to DynamoDB");
    } catch (err) {
        console.error("DynamoDB recipe save error:", err);
        throw err;
    }
}

export async function getSavedRecipesByUser(userID) {
  const params = {
    TableName: process.env.DYNAMO_TABLE_NAME,
    IndexName: "userID-index", // Use the name you defined in the console
    KeyConditionExpression: "userID = :uid",
    ExpressionAttributeValues: {
      ":uid": { S: userID },
    },
  };

  const command = new QueryCommand(params);
  const result = await client.send(command);
  return result.Items.map(item => unmarshall(item));
}

export async function getRecipeByID(recipeID, userID) {
    const params = {
        TableName: process.env.DYNAMO_TABLE_NAME,
        Key: marshall({ recipeID, userID }),
    };

    try {
        const result = await docClient.send(new GetItemCommand(params));
        return result.Item ? unmarshall(result.Item) : null;
    } catch (err) {
        console.error("DynamoDB get error:", err);
        throw err;
    }
}