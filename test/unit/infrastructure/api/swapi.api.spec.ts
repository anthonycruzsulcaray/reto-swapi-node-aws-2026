jest.mock('@nestjs/axios', () => ({
  HttpService: class HttpService {},
}));

import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { FilmBodyEnglish, FilmBodyPagedEnglish } from '../../../../src/domain/entities/film.entities';
import { StarwarsApiRest } from '../../../../src/infrastructure/api/swapi.api';

describe('StarwarsApiRest', () => {
  let api: StarwarsApiRest;
  let httpGet: jest.Mock;

  beforeEach(() => {
    process.env.API_URL_BASE = 'https://swapi.test/api/';
    httpGet = jest.fn();
    api = new StarwarsApiRest({ get: httpGet } as unknown as HttpService);
  });

  afterEach(() => {
    delete process.env.API_URL_BASE;
  });

  it('fetches the film list through HttpService', async () => {
    const films: FilmBodyPagedEnglish = {
      count: 1,
      next: null,
      previous: null,
      results: [],
    };
    httpGet.mockReturnValue(of({ data: films }));

    await expect(api.getListStarwars()).resolves.toBe(films);
    expect(httpGet).toHaveBeenCalledWith('https://swapi.test/api/films');
  });

  it('fetches a film by ID through HttpService', async () => {
    const film = { id: 3, title: 'Return of the Jedi' } as FilmBodyEnglish;
    httpGet.mockReturnValue(of({ data: film }));

    await expect(api.getStarwarsById(3)).resolves.toBe(film);
    expect(httpGet).toHaveBeenCalledWith('https://swapi.test/api/films/3');
  });

  it('propagates HttpService errors', async () => {
    const error = new Error('SWAPI unavailable');
    httpGet.mockReturnValue(throwError(() => error));

    await expect(api.getListStarwars()).rejects.toBe(error);
  });
});