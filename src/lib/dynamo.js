import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

AWS.config.update({
    region: process.env.AWS_REGION,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function saveUserToDynamo(user) {
    const params = {
        TableName: "Users-recipe-ai",
        Item: {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: new Date().toISOString(),
        },
    };

    try {
        await dynamoDb.put(params).promise();
        console.log("User saved to DynamoDB");
    } catch (err) {
        console.error("DynamoDB save error:", err);
    }
}


export async function saveRecipeToDynamo(userId, recipe) {
    const params = {
        TableName: "Recipes-recipe-ai",
        Item: {
            recipeID: uuidv4(),
            userID: userId,
            title: recipe.title,
            image: recipe.image || null,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            createdAt: new Date().toISOString(),
        },
    };

    try {
        await dynamoDb.put(params).promise();
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