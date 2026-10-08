import { FilmBody } from "../entities/film.entities";

export interface FilmRepository {
  getListFilms(): Promise<FilmBody[]>;
  getFilmById(filmId: number): Promise<FilmBody | null>;
  createFilm(film: FilmBody): Promise<void>;
}