import { FilmBodyEnglish, FilmBodyPagedEnglish } from '../../../../src/domain/entities/film.entities';
import { StarwarsRepository } from '../../../../src/domain/repository/starwars.repository';
import { StarwarsService } from '../../../../src/application/service/starwars.service';

describe('StarwarsService', () => {
  let service: StarwarsService;
  let repository: jest.Mocked<StarwarsRepository>;

  beforeEach(() => {
    repository = {
      getListStarwars: jest.fn(),
      getStarwarsById: jest.fn(),
    };
    service = new StarwarsService(repository);
  });

  it('returns the paged film list from the repository', async () => {
    const films: FilmBodyPagedEnglish = {
      count: 1,
      next: null,
      previous: null,
      results: [{ id: 1, title: 'A New Hope' } as FilmBodyEnglish],
    };
    repository.getListStarwars.mockResolvedValue(films);

    await expect(service.getListStarwars()).resolves.toBe(films);
    expect(repository.getListStarwars).toHaveBeenCalledTimes(1);
  });

  it('returns the requested film from the repository', async () => {
    const film = { id: 1, title: 'A New Hope' } as FilmBodyEnglish;
    repository.getStarwarsById.mockResolvedValue(film);

    await expect(service.getStarwarsById(1)).resolves.toBe(film);
    expect(repository.getStarwarsById).toHaveBeenCalledWith(1);
  });

  it('returns null when the requested film does not exist', async () => {
    repository.getStarwarsById.mockResolvedValue(null);

    await expect(service.getStarwarsById(99)).resolves.toBeNull();
  });
});