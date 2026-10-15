import { Logger } from '@nestjs/common';
import { GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { FilmBodyEnglish } from '../../../../src/domain/entities/film.entities';
import { DynamoClientDatabase } from '../../../../src/infrastructure/database/dynamo.client';
import { DynamoRepository } from '../../../../src/infrastructure/repository/dynamo.repository';

describe('DynamoRepository', () => {
  let repository: DynamoRepository;
  let send: jest.Mock;

  const film: FilmBodyEnglish = {
    id: 7,
    episode_id: 6,
    title: 'Return of the Jedi',
    opening_crawl: 'Luke Skywalker has returned to his home planet.',
    director: 'Richard Marquand',
    producer: 'Howard G. Kazanjian',
    release_date: '1983-05-25',
    characters: ['character-url'],
    planets: ['planet-url'],
    starships: ['starship-url'],
    vehicles: ['vehicle-url'],
    species: ['species-url'],
    created: 'created',
    edited: 'edited',
    url: 'film-url',
  };

  beforeEach(() => {
    process.env.DYNAMO_DB_TABLE = 'films-test';
    send = jest.fn();
    const database = { client: { send } } as unknown as DynamoClientDatabase;
    repository = new DynamoRepository(database);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.DYNAMO_DB_TABLE;
  });

  it('scans the table and maps stored records to films', async () => {
    send.mockResolvedValue({ Items: [{ id: 12, data: film }] });

    await expect(repository.getListFilms()).resolves.toEqual([{ ...film, id: 12 }]);
    expect(send).toHaveBeenCalledWith(expect.any(ScanCommand));
    expect(send.mock.calls[0][0].input).toEqual({ TableName: 'films-test' });
  });

  it('returns an empty list when the table has no items', async () => {
    send.mockResolvedValue({ Items: [] });

    await expect(repository.getListFilms()).resolves.toEqual([]);
  });

  it('logs and normalizes scan errors', async () => {
    send.mockRejectedValue(new Error('Dynamo unavailable'));
    const loggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    await expect(repository.getListFilms()).rejects.toThrow(
      'No se pudieron listar los elementos',
    );
    expect(loggerError).toHaveBeenCalled();
  });

  it('gets a film by ID and maps the stored record', async () => {
    send.mockResolvedValue({ Item: { id: 7, data: film } });

    await expect(repository.getFilmById(7)).resolves.toEqual(film);
    expect(send).toHaveBeenCalledWith(expect.any(GetCommand));
    expect(send.mock.calls[0][0].input).toEqual({
      TableName: 'films-test',
      Key: { id: 7 },
    });
  });

  it('returns null when an item with the ID does not exist', async () => {
    send.mockResolvedValue({});

    await expect(repository.getFilmById(99)).resolves.toBeNull();
  });

  it('logs and normalizes get errors', async () => {
    send.mockRejectedValue(new Error('Dynamo unavailable'));
    const loggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    await expect(repository.getFilmById(7)).rejects.toThrow(
      'No se pudo obtener el elemento por ID',
    );
    expect(loggerError).toHaveBeenCalled();
  });

  it('stores a film inside a record keyed by its ID', async () => {
    send.mockResolvedValue({});

    await expect(repository.createFilm(film)).resolves.toBe(film);
    expect(send).toHaveBeenCalledWith(expect.any(PutCommand));
    expect(send.mock.calls[0][0].input).toEqual({
      TableName: 'films-test',
      Item: { id: 7, data: film },
    });
  });

  it('logs and normalizes put errors', async () => {
    send.mockRejectedValue(new Error('Dynamo unavailable'));
    const loggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    await expect(repository.createFilm(film)).rejects.toThrow(
      'No se pudo agregar la película',
    );
    expect(loggerError).toHaveBeenCalled();
  });
});