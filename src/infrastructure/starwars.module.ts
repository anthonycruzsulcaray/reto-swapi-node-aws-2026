import { Module } from '@nestjs/common';
import { StarwarsController } from '../presentation/controller/starwars.controller';
import { HttpModule } from '@nestjs/axios';
import { DynamoRepository } from './repository/dynamo.repository';
import { FilmService } from '../application/service/film.service';
import { StarwarsApiRest } from './api/swapi.api';
import { StarwarsService } from '../application/service/starwars.service';
import { STARWARS_REPOSITORY } from '../domain/repository/starwars.repository';
import { ConfigModule } from '@nestjs/config';
import { FILM_REPOSITORY } from '../domain/repository/film.repository';
import { DynamoDbModule } from './database/dynamo.database';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    DynamoDbModule,
  ],
  controllers: [StarwarsController],
  providers: [
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
