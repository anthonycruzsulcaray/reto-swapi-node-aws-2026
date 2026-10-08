import { Injectable, Logger } from '@nestjs/common';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import DynamoDataBase from '../repository/dynamoDB.repository';

@Injectable()
export default class DynamoRepository {
    private readonly dynamoConn: DynamoDBDocumentClient;
    private readonly logger = new Logger(DynamoRepository.name); // Instancia del logger

    constructor(dydb: DynamoDataBase) {
        this.dynamoConn = dydb.dynamoClient()
    }

    async listAll() {
        try {
            const result = await this.dynamoConn.send(
                new ScanCommand({
                    TableName: process.env.DYNAMO_DB_TABLE,
                }),
            );
            return result.Items;
        } catch (error: any) {
            this.logger.error('Error al listar todos los elementos', error.stack);
            throw new Error('No se pudieron listar los elementos');
        }
    }

    async listById(id: number) {
        try {
            return await this.dynamoConn.send(
                new GetCommand({
                    TableName: process.env.DYNAMO_DB_TABLE,
                    Key: { id },
                }),
            );
        } catch (error: any) {
            this.logger.error(`Error al obtener el elemento con ID: ${id}`, error.stack);
            throw new Error('No se pudo obtener el elemento por ID');
        }
    }

    async add(idFilm: number, bodyFilm: any) {
        try {
            await this.dynamoConn.send(
                new PutCommand({
                    TableName: process.env.DYNAMO_DB_TABLE,
                    Item: {
                        id: idFilm,
                        data: bodyFilm,
                    },
                }),
            );
        } catch (error: any) {
            this.logger.error(`Error al agregar la película con ID: ${idFilm}`, error.stack);
            throw new Error('No se pudo agregar la película');
        }
    }


}
