import { Module } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const DYNAMODB_CLIENT = Symbol('DYNAMODB_CLIENT');

@Module({
  providers: [
    {
      provide: DYNAMODB_CLIENT,
      useFactory: () => {
        const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
        const client = new DynamoDBClient({
          region: AWS_REGION,
          credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID ?? "",
            secretAccessKey: AWS_SECRET_ACCESS_KEY ?? "",
          },
        });
        
        return DynamoDBDocumentClient.from(client);
      },
    },
  ],
  exports: [DYNAMODB_CLIENT],
})
export class DynamoDbModule { }
