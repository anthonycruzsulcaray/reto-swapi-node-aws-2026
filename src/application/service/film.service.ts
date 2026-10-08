import { FilmBody } from "../../domain/entities/film.entities";
import { FilmRepository } from "../../domain/repository/film.repository";

export class FilmService{
    constructor(private readonly filmRepository: FilmRepository) {}

    async getListFilms() {
        await this.filmRepository.getListFilms();
    }

    async getFilmById(filmId: number) {
        await this.filmRepository.getFilmById(filmId);
    }

    async createFilm(film: FilmBody) {
        await this.filmRepository.createFilm(film);
    }


}