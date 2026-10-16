import { FilmBodyEnglish, FilmBodyPagedEnglish, FilmBodySpanish } from '../../../../src/domain/entities/film.entities';
import { FilmService } from '../../../../src/application/service/film.service';
import { StarwarsService } from '../../../../src/application/service/starwars.service';
import { StarwarsController } from '../../../../src/presentation/controller/starwars.controller';

describe('StarwarsController', () => {
  let controller: StarwarsController;
  let filmService: jest.Mocked<FilmService>;
  let starwarsService: jest.Mocked<StarwarsService>;

  beforeEach(() => {
    filmService = {
      getListFilms: jest.fn(),
      getFilmById: jest.fn(),
      createFilm: jest.fn(),
    } as unknown as jest.Mocked<FilmService>;
    starwarsService = {
      getListStarwars: jest.fn(),
      getStarwarsById: jest.fn(),
    } as unknown as jest.Mocked<StarwarsService>;
    controller = new StarwarsController(filmService, starwarsService);
  });

  it('delegates the external film list request', async () => {
    const films = { count: 0, next: null, previous: null, results: [] } as FilmBodyPagedEnglish;
    starwarsService.getListStarwars.mockResolvedValue(films);

    await expect(controller.listFilms()).resolves.toBe(films);
    expect(starwarsService.getListStarwars).toHaveBeenCalledTimes(2);
  });

  it('converts the external film ID to a number', async () => {
    const film = { id: 3 } as FilmBodyEnglish;
    starwarsService.getStarwarsById.mockResolvedValue(film);

    await expect(controller.listFilmsById('3')).resolves.toBe(film);
    expect(starwarsService.getStarwarsById).toHaveBeenCalledWith(3);
  });

  it('delegates the DynamoDB film list request', async () => {
    const films: FilmBodySpanish[] = [];
    filmService.getListFilms.mockResolvedValue(films);

    await expect(controller.listDynamoFilms()).resolves.toBe(films);
    expect(filmService.getListFilms).toHaveBeenCalledTimes(1);
  });

  it('converts the DynamoDB film ID to a number', async () => {
    const film = { id: 3 } as FilmBodySpanish;
    filmService.getFilmById.mockResolvedValue(film);

    await expect(controller.listDynamoFilmById('3')).resolves.toBe(film);
    expect(filmService.getFilmById).toHaveBeenCalledWith(3);
  });

  it('delegates film creation with the request body', async () => {
    const film = { id: 3, title: 'Return of the Jedi' } as FilmBodyEnglish;
    const createdFilm = { id: 3, titulo: 'Return of the Jedi' } as FilmBodySpanish;
    filmService.createFilm.mockResolvedValue(createdFilm);

    await expect(controller.addDynamoFilm(film)).resolves.toBe(createdFilm);
    expect(filmService.createFilm).toHaveBeenCalledWith(film);
  });
});