import { Inject, Injectable } from "@nestjs/common";
import { FilmBodySpanish, FilmBodyEnglish } from "../../domain/entities/film.entities";
import { FILM_REPOSITORY } from "../../domain/repository/film.repository";
import type { FilmRepository } from "../../domain/repository/film.repository";

import { filmToSpanish } from "../mapper/film.mapper";
import { validateEnglishFilm } from "../validation/film.validator";

@Injectable()
export class FilmService {
    constructor(
        @Inject(FILM_REPOSITORY)
        private readonly filmRepository: FilmRepository,
    ) { }

    async getListFilms(): Promise<FilmBodySpanish[]> {
        const films = await this.filmRepository.getListFilms();
        return films.map((film) => filmToSpanish(film));
    }

    async getFilmById(filmId: number): Promise<FilmBodySpanish | null> {
        const film = await this.filmRepository.getFilmById(filmId);
        return film ? filmToSpanish(film) : null;
    }

    async createFilm(bodyFilm: FilmBodyEnglish): Promise<FilmBodySpanish | null> {
        validateEnglishFilm(bodyFilm);
        const totalFilms = (await this.filmRepository.getListFilms()).length;
        bodyFilm.id = totalFilms + 1;
        await this.filmRepository.createFilm(bodyFilm);
        return filmToSpanish(bodyFilm);
    }

}