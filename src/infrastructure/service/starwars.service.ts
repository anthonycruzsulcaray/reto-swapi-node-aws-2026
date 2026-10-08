import { Injectable } from '@nestjs/common';
import DynamoRepository from '../repository/dynamo.repository';
import { TranslateObject } from '../../infrastructure/utils/translateObject';
import FilmsValidator from '../../infrastructure/utils/filmsValidation';
import { FilmBody } from '../../domain/entities/film.entities';
import { FilmsApiRest } from '../api/swapi.api';


@Injectable()
export class StarwarsService {

  constructor(private readonly apiFilms: FilmsApiRest, private readonly dynamoRepository: DynamoRepository,
    private readonly translate: TranslateObject, private readonly validator: FilmsValidator) { }

  async listall(): Promise<FilmBody[]> {
    // dynamo
    const resultRest: any = await this.dynamoRepository.listAll()
    console.log("resultRest:::  ", resultRest)
    let dataResponse: FilmBody[] = [];
    for (let value of resultRest) {
      const dynamoId = value.id
      const item = value.data
      // translate
      const films = this.translate.filmsToSpanish(dynamoId, item)
      dataResponse.push(films)
    }
    console.log("dataResponse::: ", dataResponse)

    return dataResponse;
  }

  async listById(id: number): Promise<FilmBody> {
    // api startwars
    const swapiResponse = await this.apiFilms.listById(id)
    // dynamo
    await this.dynamoRepository.add(id, swapiResponse)
    // translate
    const films = this.translate.filmsToSpanish(id, swapiResponse)
    return films;
  }

  async add(bodyFilm: FilmBody): Promise<FilmBody> {
    this.validator.validate(bodyFilm)
    bodyFilm.creado = new Date().toDateString()
    // dynamo
    const totalFilms = (await this.dynamoRepository.listAll())?.length ?? 0
    bodyFilm.id = totalFilms + 1
    // translate
    const filmToEnglish = this.translate.filmsToEnglish(bodyFilm.id, bodyFilm)
    await this.dynamoRepository.add(filmToEnglish.id, filmToEnglish)
    return bodyFilm;
  }



}