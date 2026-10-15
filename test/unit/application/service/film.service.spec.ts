import { FilmBodyEnglish } from '../../../../src/domain/entities/film.entities';
import { FilmRepository } from '../../../../src/domain/repository/film.repository';
import { FilmService } from '../../../../src/application/service/film.service';

describe('FilmService', () => {
  let service: FilmService;
  let repository: jest.Mocked<FilmRepository>;

  const film: FilmBodyEnglish = {
    id: 4,
    episode_id: 4,
    title: 'A New Hope',
    opening_crawl: 'It is a period of civil war.',
    director: 'George Lucas',
    producer: 'Gary Kurtz',
    release_date: '1977-05-25',
    characters: ['https://swapi.dev/api/people/1/'],
    planets: ['https://swapi.dev/api/planets/1/'],
    starships: ['https://swapi.dev/api/starships/2/'],
    vehicles: ['https://swapi.dev/api/vehicles/4/'],
    species: ['https://swapi.dev/api/species/1/'],
    created: '2014-12-10T14:23:31.880000Z',
    edited: '2014-12-20T19:49:45.256000Z',
    url: 'https://swapi.dev/api/films/4/',
  };

  beforeEach(() => {
    repository = {
      getListFilms: jest.fn(),
      getFilmById: jest.fn(),
      createFilm: jest.fn(),
    };
    service = new FilmService(repository);
  });

  it('returns films translated to Spanish', async () => {
    repository.getListFilms.mockResolvedValue([film]);

    await expect(service.getListFilms()).resolves.toEqual([
      expect.objectContaining({
        id: 4,
        episodio_id: 4,
        titulo: 'A New Hope',
        productor: 'Gary Kurtz',
      }),
    ]);
  });

  it('returns a translated film by ID', async () => {
    repository.getFilmById.mockResolvedValue(film);

    await expect(service.getFilmById(4)).resolves.toEqual(
      expect.objectContaining({ id: 4, titulo: 'A New Hope' }),
    );
    expect(repository.getFilmById).toHaveBeenCalledWith(4);
  });

  it('returns null when the film does not exist', async () => {
    repository.getFilmById.mockResolvedValue(null);

    await expect(service.getFilmById(99)).resolves.toBeNull();
  });

  it('assigns the next ID and persists a valid film', async () => {
    repository.getListFilms.mockResolvedValue([film, { ...film, id: 5 }]);
    repository.createFilm.mockResolvedValue(null);
    const filmToCreate = { ...film, id: undefined } as unknown as FilmBodyEnglish;

    const result = await service.createFilm(filmToCreate);

    expect(filmToCreate.id).toBe(3);
    expect(repository.createFilm).toHaveBeenCalledWith(filmToCreate);
    expect(result).toEqual(expect.objectContaining({ id: 3, titulo: 'A New Hope' }));
  });

  it('rejects a film with a required field missing without accessing the repository', async () => {
    const invalidFilm = { ...film, title: '' };

    await expect(service.createFilm(invalidFilm)).rejects.toThrow(
      'campo obligatorio: pelicula.title',
    );
    expect(repository.getListFilms).not.toHaveBeenCalled();
    expect(repository.createFilm).not.toHaveBeenCalled();
  });
});