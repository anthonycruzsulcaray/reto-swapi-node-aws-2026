import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { FilmBodyPagedEnglish, FilmBodyEnglish, FilmBodySpanish } from '../../domain/entities/film.entities';
import { StarwarsService } from '../../application/service/starwars.service';
import { FilmService } from '../../application/service/film.service';

@Controller('starwars')
export class StarwarsController {
  constructor(
    private readonly filmService: FilmService,
    private readonly starwarsService: StarwarsService,
  ) { }

  @Get('films')
  @HttpCode(200)
  async listFilms(): Promise<FilmBodyPagedEnglish> {
    return await this.starwarsService.getListStarwars();
  }

  @Get('films/:id')
  @HttpCode(200)
  async listFilmsById(@Param('id') id: string): Promise<FilmBodyEnglish | null> {
    return await this.starwarsService.getStarwarsById(+id);
  }

  @Get('dynamo/films')
  @HttpCode(200)
  async listDynamoFilms(): Promise<FilmBodySpanish[]> {
    return await this.filmService.getListFilms();
  }

  @Get('dynamo/films/:id')
  @HttpCode(200)
  async listDynamoFilmById(@Param('id') id: string): Promise<FilmBodySpanish | null> {
    return await this.filmService.getFilmById(+id);
  }

  @Post('dynamo/films')
  @HttpCode(201)
  async addDynamoFilm(@Body() requestBody: FilmBodyEnglish): Promise<FilmBodySpanish | null> {
    return await this.filmService.createFilm(requestBody);
  }
}