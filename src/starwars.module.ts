import { Module } from '@nestjs/common';
import { StarwarsController } from './presentation/controller/starwars.controller';
import { HttpModule } from '@nestjs/axios';
import { DynamoRepository } from './infrastructure/repository/dynamo.repository';
import { FilmService } from './application/service/film.service';
import { StarwarsApiRest } from './infrastructure/api/swapi.api';
import { StarwarsService } from './application/service/starwars.service';
import { STARWARS_REPOSITORY } from './domain/repository/starwars.repository';
import { ConfigModule } from '@nestjs/config';
import { FILM_REPOSITORY } from './domain/repository/film.repository';
import { DynamoClientDatabase } from './infrastructure/database/dynamo.client';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
  ],
  controllers: [StarwarsController],
  providers: [
    DynamoClientDatabase,
    StarwarsService,
    {
      provide: STARWARS_REPOSITORY,
      useClass: StarwarsApiRest,
    },
    FilmService,
    {
      provide: FILM_REPOSITORY,
      useClass: DynamoRepository,
    },
  ],
})
export class StarwarsModule {}
