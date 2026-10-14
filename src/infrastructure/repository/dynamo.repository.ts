import { Inject, Injectable, Logger } from '@nestjs/common';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { FilmRepository } from '../../domain/repository/film.repository';
import { FilmBodyEnglish } from '../../domain/entities/film.entities';
import { DYNAMODB_CLIENT } from '../database/dynamo.database';

interface FilmRecord {
    id: number;
    data: FilmBodyEnglish;
}

@Injectable()
export class DynamoRepository implements FilmRepository {
    private readonly logger = new Logger(DynamoRepository.name); // Instancia del logger

    constructor(
        @Inject(DYNAMODB_CLIENT)
        private readonly dynamoConn: DynamoDBDocumentClient,
    ) { }

    async getListFilms(): Promise<FilmBodyEnglish[]> {
        try {
            const responseItems: FilmBodyEnglish[] = [];
            const result = await this.dynamoConn.send(
                new ScanCommand({
                    TableName: process.env.DYNAMO_DB_TABLE,
                }),
            );
            if (!result.Items || result.Items.length === 0) {
                return responseItems;
            }
            result.Items.forEach((item) => {
                const record = item as FilmRecord;
                responseItems.push({ ...record.data, id: record.id });
            });
            return responseItems;
        } catch (error: any) {
            this.logger.error('Error al listar todos los elementos', error.stack);
            throw new Error('No se pudieron listar los elementos');
        }
    }

    async getFilmById(id: number): Promise<FilmBodyEnglish | null> {
        try {
            let responseItems = new FilmBodyEnglish()
            const result = await this.dynamoConn.send(
                new GetCommand({
                    TableName: process.env.DYNAMO_DB_TABLE,
                    Key: { id },
                }),
            );
            const record = result.Item as FilmRecord | undefined;
            if (!record) {
                return null
            }
            responseItems = { ...record.data, id: record.id }
            return responseItems;
        } catch (error: any) {
            this.logger.error(`Error al obtener el elemento con ID: ${id}`, error.stack);
            throw new Error('No se pudo obtener el elemento por ID');
        }
    }
    async createFilm(film: FilmBodyEnglish): Promise<FilmBodyEnglish | null> {
        try {
            await this.dynamoConn.send(
                new PutCommand({
                    TableName: process.env.DYNAMO_DB_TABLE,
                    Item: {
                        id: film.id,
                        data: film,
                    },
                }),
            );
            return film;
        } catch (error: any) {
            this.logger.error(`Error al agregar la película con ID: ${film.id}`, error.stack);
            throw new Error('No se pudo agregar la película');
        }
    }

}
