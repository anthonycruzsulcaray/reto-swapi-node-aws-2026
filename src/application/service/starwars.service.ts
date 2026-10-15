import { Inject, Injectable } from "@nestjs/common";
import { FilmBodyEnglish, FilmBodyPagedEnglish } from "../../domain/entities/film.entities";
import { STARWARS_REPOSITORY } from "../../domain/repository/starwars.repository";
import type { StarwarsRepository } from "../../domain/repository/starwars.repository";

@Injectable()
export class StarwarsService {
    constructor(
        @Inject(STARWARS_REPOSITORY)
        private readonly starwarsRepository: StarwarsRepository,
    ) { }

    async getListStarwars(): Promise<FilmBodyPagedEnglish> {
        return await this.starwarsRepository.getListStarwars();
    }

    async getStarwarsById(id: number): Promise<FilmBodyEnglish | null> {
        return await this.starwarsRepository.getStarwarsById(id);
    }


}