import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export default class DynamoDatabase {
  private readonly client = DynamoDBDocumentClient.from(
    new DynamoDBClient({}),
  );

  dynamoClient() {
    return this.client;
  }
}