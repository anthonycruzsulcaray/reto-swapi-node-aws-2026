import { FilmBodyEnglish } from '../../domain/entities/film.entities';

export function validateEnglishFilm(film: FilmBodyEnglish): void {
  const requiredFields = [
    'title',
    'opening_crawl',
    'director',
    'producer',
    'release_date',
    'characters',
    'planets',
    'starships',
    'vehicles',
    'species',
  ] as const;

  for (const field of requiredFields) {
    const value = film[field];
    if (!value || value.length === 0) {
      throw new Error(`campo obligatorio: pelicula.${field}`);
    }
  }
}