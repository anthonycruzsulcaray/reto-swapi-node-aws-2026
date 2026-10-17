import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress, { getCurrentInvoke } from '@codegenie/serverless-express';
import { AppModule } from '../app.module';

type LambdaHandler = ReturnType<typeof serverlessExpress>;

declare module 'express-serve-static-core' {
  interface Request {
    apiGateway?: ReturnType<typeof getCurrentInvoke>;
  }
}

async function bootstrap(): Promise<LambdaHandler> {
  const expressApp = express();
  const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), { cors: true });
  nestApp.use((request: any, _response: any, next: any) => {
    request.apiGateway = getCurrentInvoke();
    next();
  });
  // nestApp.setGlobalPrefix('starwars-api')
  await nestApp.init();

  return serverlessExpress({ app: expressApp });
}

let cachedHandler: LambdaHandler | undefined;
let bootstrapPromise: Promise<LambdaHandler> | undefined;

export const handler = async (...args: Parameters<LambdaHandler>) => {
  if (!cachedHandler) {
    bootstrapPromise ??= bootstrap();
    try {
      cachedHandler = await bootstrapPromise;
    } catch (error) {
      bootstrapPromise = undefined;
      throw error;
    }
  }

  const [event, context] = args;
  console.log('REQUEST:: \n', JSON.stringify(event));
  console.log('REQUEST::RESOURCE:: \n', event.resource);
  console.log('REQUEST::pathParameters:: \n', event.pathParameters);
  if (event.body && getContentType(event)) {
    console.log('REQUEST::BODY:: \n', 'binary \n');
  } else {
    console.log('REQUEST::BODY:: \n', event.body);
  }

  const response = await cachedHandler(event, context);
  console.log('REPONSE::', JSON.stringify(response));
  return response;
};

function getContentType(event: Parameters<LambdaHandler>[0]): boolean {
  return Object.entries(event.headers ?? {}).some(
    ([name, value]) =>
      name.toLowerCase() === 'content-type' &&
      typeof value === 'string' &&
      value.includes('multipart/form-data'),
  );
}
