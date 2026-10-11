import { FilmBodyEnglish, FilmBodySpanish } from "../entities/film.entities";

export const FILM_REPOSITORY = Symbol('FILM_REPOSITORY');

export interface FilmRepository {
  getListFilms(): Promise<FilmBodySpanish[]>;
  getFilmById(filmId: number): Promise<FilmBodySpanish | null>;
  createFilm(film: FilmBodyEnglish): Promise<FilmBodyEnglish | null>;
}