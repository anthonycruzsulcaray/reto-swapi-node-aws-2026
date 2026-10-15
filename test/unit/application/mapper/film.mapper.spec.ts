import { FilmBodyEnglish, FilmBodySpanish } from '../../../../src/domain/entities/film.entities';
import { filmToEnglish, filmToSpanish } from '../../../../src/application/mapper/film.mapper';

describe('film mapper', () => {
  const filmEnglish: FilmBodyEnglish = {
    id: 4,
    episode_id: 4,
    title: 'A New Hope',
    opening_crawl: 'It is a period of civil war.',
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

  it('maps all English film fields to Spanish names', () => {
    expect(filmToSpanish(filmEnglish)).toEqual({
      id: 4,
      episodio_id: 4,
      titulo: 'A New Hope',
      rastreo_apertura: 'It is a period of civil war.',
      director: 'George Lucas',
      productor: 'Gary Kurtz',
      fecha_lanzamiento: '1977-05-25',
      caracteres: ['character-url'],
      planetas: ['planet-url'],
      naves_estelares: ['starship-url'],
      vehiculos: ['vehicle-url'],
      especies: ['species-url'],
      creado: 'created',
      editado: 'edited',
      url: 'film-url',
    });
  });

  it('maps all Spanish film fields to English names', () => {
    const filmSpanish: FilmBodySpanish = {
      id: 4,
      episodio_id: 4,
      titulo: 'A New Hope',
      rastreo_apertura: 'It is a period of civil war.',
      director: 'George Lucas',
      productor: 'Gary Kurtz',
      fecha_lanzamiento: '1977-05-25',
      caracteres: ['character-url'],
      planetas: ['planet-url'],
      naves_estelares: ['starship-url'],
      vehiculos: ['vehicle-url'],
      especies: ['species-url'],
      creado: 'created',
      editado: 'edited',
      url: 'film-url',
    };

    expect(filmToEnglish(filmSpanish)).toEqual(filmEnglish);
  });
});