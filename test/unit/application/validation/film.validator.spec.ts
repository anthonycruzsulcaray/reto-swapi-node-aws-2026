import { FilmBodyEnglish } from '../../../../src/domain/entities/film.entities';
import { validateEnglishFilm } from '../../../../src/application/validation/film.validator';

describe('validateEnglishFilm', () => {
  const validFilm: FilmBodyEnglish = {
    id: 1,
    episode_id: 1,
    title: 'A New Hope',
    opening_crawl: 'Opening crawl',
    director: 'George Lucas',
    producer: 'Gary Kurtz',
    release_date: '1977-05-25',
    characters: ['character-url'],
    planets: ['planet-url'],
    starships: ['starship-url'],
    vehicles: ['vehicle-url'],
    species: ['species-url'],
    created: 'created',
    edited: 'edited',
    url: 'film-url',
  };

  it('accepts a film with all required fields', () => {
    expect(() => validateEnglishFilm(validFilm)).not.toThrow();
  });

  it.each([
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
  ] as const)('rejects an empty required field: %s', (field) => {
    const invalidFilm = { ...validFilm, [field]: '' } as FilmBodyEnglish;

    expect(() => validateEnglishFilm(invalidFilm)).toThrow(
      `campo obligatorio: pelicula.${field}`,
    );
  });
});