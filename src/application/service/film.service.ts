import { Inject, Injectable } from "@nestjs/common";
import { FilmBodySpanish, FilmBodyEnglish } from "../../domain/entities/film.entities";
import { FILM_REPOSITORY } from "../../domain/repository/film.repository";
import type { FilmRepository } from "../../domain/repository/film.repository";
import { TranslateObject } from "../../infrastructure/utils/translateObject";
//import FilmsValidator from "../../infrastructure/validator/filmsValidation";

@Injectable()
export class FilmService {
    constructor(
        @Inject(FILM_REPOSITORY)
        private readonly filmRepository: FilmRepository,
        private readonly translate: TranslateObject
        // private readonly validator: FilmsValidator
    ) { }

    async getListFilms(): Promise<FilmBodySpanish[]> {
        const resultRest: any = await this.filmRepository.getListFilms();
        console.log("resultRest:::  ", resultRest)
        let dataResponse: FilmBodySpanish[] = [];

        for (let value of resultRest) {
            const dynamoId = value.id
            const item = value.data
            const films = this.translate.filmsToSpanish(dynamoId, item)
            dataResponse.push(films)
        }
        return dataResponse;
    }

    async getFilmById(filmId: number): Promise<FilmBodySpanish | null> {
        const swapiResponse = await this.filmRepository.getFilmById(filmId);
        const films = this.translate.filmsToSpanish(filmId, swapiResponse)
        return films
    }

    async createFilm(bodyFilm: FilmBodyEnglish): Promise<FilmBodySpanish | null> {
        // this.validator.validate(bodyFilm)
        bodyFilm.created = new Date().toDateString()

        const totalFilms = (await this.filmRepository.getListFilms()).length ?? 0
        bodyFilm.id = totalFilms + 1

        const filmToEspanish = this.translate.filmsToSpanish(bodyFilm.id, bodyFilm)
        const filmDynamo =await this.filmRepository.createFilm(bodyFilm)
        console.log("film.service - createFilm ::: ", filmDynamo)

        return filmToEspanish
    }

}