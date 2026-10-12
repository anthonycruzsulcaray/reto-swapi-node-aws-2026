import { Inject, Injectable, Logger } from '@nestjs/common';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { FilmRepository } from '../../domain/repository/film.repository';
import { FilmBodyEnglish, FilmBodySpanish } from '../../domain/entities/film.entities';

@Injectable()
export class DynamoRepository implements FilmRepository {
    private readonly logger = new Logger(DynamoRepository.name); // Instancia del logger

    constructor(
        @Inject('DYNAMODB_CLIENT')
        private readonly dynamoConn: DynamoDBDocumentClient,
    ) { }

    async getListFilms(): Promise<FilmBodySpanish[]> {
        try {
            const result = await this.dynamoConn.send(
                new ScanCommand({
                    TableName: process.env.DYNAMO_DB_TABLE,
                }),
            );
            console.log("dynamo getListFilms - result ::: ", result)
            console.log("dynamo getListFilms - result.items ::: ", result.Items)
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
            console.log("dynamo getFilmById - result ::: ", result)
            console.log("dynamo getFilmById - result.Item ::: ", result.Item)
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
            console.log("dynamo createFilm - result ::: ", result)
            return film;
        } catch (error: any) {
            this.logger.error(`Error al agregar la película con ID: ${film.id}`, error.stack);
            throw new Error('No se pudo agregar la película');
        }
    }

}
