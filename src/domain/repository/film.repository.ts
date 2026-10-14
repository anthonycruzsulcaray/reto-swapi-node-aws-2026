import { FilmBodyEnglish, FilmBodySpanish } from "../entities/film.entities";

export const FILM_REPOSITORY = Symbol('FILM_REPOSITORY');

export interface FilmRepository {
  getListFilms(): Promise<FilmBodyEnglish[]>;
  getFilmById(filmId: number): Promise<FilmBodyEnglish | null>;
  createFilm(film: FilmBodyEnglish): Promise<FilmBodyEnglish | null>;
}