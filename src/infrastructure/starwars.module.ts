import { Module } from '@nestjs/common';
import { StarwarsController } from './controller/starwars.controller';
import { HttpModule } from '@nestjs/axios';
import { TranslateObject } from './utils/translateObject';
import FilmsValidator from './validator/filmsValidation';
import { DynamoRepository } from './repository/dynamo.repository';
import { FilmService } from '../application/service/film.service';
import DynamoDatabase from './database/dynamo.database';
import { StarwarsApiRest } from './api/swapi.api';
import { StarwarsService } from '../application/service/starwars.service';
import { ConfigModule } from '@nestjs/config';


@Module({
imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule], 
 controllers: [StarwarsController],
  providers: [
    StarwarsService,
    StarwarsApiRest,
    FilmService,
    DynamoRepository,
    DynamoDatabase,
    TranslateObject,FilmsValidator
  ],
})
export class StarwarsModule {}
