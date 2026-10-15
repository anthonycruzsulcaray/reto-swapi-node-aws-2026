import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, Observable } from 'rxjs';
import { StarwarsRepository } from "../../domain/repository/starwars.repository";
import { FilmBodyPagedEnglish, FilmBodyEnglish } from "../../domain/entities/film.entities";

interface StarwarsHttpClient {
    get<T>(url: string): Observable<{ data: T }>;
}

@Injectable()
export class StarwarsApiRest implements StarwarsRepository {
    constructor(
        @Inject(HttpService)
        private readonly httpService: StarwarsHttpClient,
    ) { }

    async getListStarwars(): Promise<FilmBodyPagedEnglish> {
        const url = `${process.env.API_URL_BASE}films`;
        const { data } = await firstValueFrom(
            this.httpService.get<FilmBodyPagedEnglish>(url),
        );
        return data;
    }

    async getStarwarsById(id: number): Promise<FilmBodyEnglish | null> {
        const url = `${process.env.API_URL_BASE}films/${id}`;
        const { data } = await firstValueFrom(
            this.httpService.get<FilmBodyEnglish>(url),
        );
        return data;
    }

}