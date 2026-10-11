import { Injectable, Logger } from '@nestjs/common';
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import DynamoDataBase from '../repository/dynamoDB.repository';
import { FilmRepository } from '../../domain/repository/film.repository';
import { FilmBodyEnglish, FilmBodySpanish } from '../../domain/entities/film.entities';

@Injectable()
export class DynamoRepository implements FilmRepository { 
    private readonly dynamoConn: DynamoDBDocumentClient;
    private readonly logger = new Logger(DynamoRepository.name); // Instancia del logger

    constructor(dydb: DynamoDataBase) {
        this.dynamoConn = dydb.dynamoClient()
    }

    async getListFilms(): Promise<FilmBodySpanish[]> {
        try {
            const result = await this.dynamoConn.send(
                new ScanCommand({
                    TableName: process.env.DYNAMO_DB_TABLE,
                }),
            );
            console.log("result::: ", result)
            console.log("result::: ", result.Items)
            return result.Items as FilmBodySpanish[];
        } catch (error: any) {
            this.logger.error('Error al listar todos los elementos', error.stack);
            throw new Error('No se pudieron listar los elementos');
        }
    }
    async getFilmById(id: number): Promise<FilmBodySpanish | null> {
         try {
            const result = await this.dynamoConn.send(
                new GetCommand({
                    TableName: process.env.DYNAMO_DB_TABLE,
                    Key: { id },
                }),
            );
            console.log("result::: ", result)
            console.log("result::: ", result.Item)
            return result.Item as FilmBodySpanish | null;
        } catch (error: any) {
            this.logger.error(`Error al obtener el elemento con ID: ${id}`, error.stack);
            throw new Error('No se pudo obtener el elemento por ID');
        }
    }
    async createFilm(film: FilmBodyEnglish): Promise<FilmBodyEnglish | null> {
        try {
            const result = await this.dynamoConn.send(
                new PutCommand({
                    TableName: process.env.DYNAMO_DB_TABLE,
                    Item: {
                        id: film.id,
                        data: film,
                    },
                }),
            );
            console.log("result::: ", result)
            return film;
        } catch (error: any) {
            this.logger.error(`Error al agregar la película con ID: ${film.id}`, error.stack);
            throw new Error('No se pudo agregar la película');
        }
    }
    
}
