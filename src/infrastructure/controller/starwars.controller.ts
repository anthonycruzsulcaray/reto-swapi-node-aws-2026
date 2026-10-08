import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { StarwarsService } from '../service/starwars.service';
import { FilmBody } from '../../domain/entities/film.entities';
// import { FilmService } from '../../application/service/film.service';

@Controller('starwars')
export class StarwarsController {
  constructor(private readonly starwarsService: StarwarsService) { }

  @Get('films')
  @HttpCode(200)
  async listAll(): Promise<FilmBody[]> {
    return await this.starwarsService.listall();
  }

  @Get('films/:id')
  @HttpCode(200)
  async listById(@Param('id') id: string): Promise<FilmBody> {
    return await this.starwarsService.listById(+id);
  }

  @Post('films')
  @HttpCode(201)
  async add(@Body() requestBody: FilmBody): Promise<FilmBody> {
    return await this.starwarsService.add(requestBody);
  }


}
