import axios from "axios";
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { StarwarsRepository } from "../../domain/repository/starwars.repository";
import { FilmBodyPagedEnglish, FilmBodyEnglish } from "../../domain/entities/film.entities";

@Injectable()
export class StarwarsApiRest implements StarwarsRepository {
      constructor(private readonly httpService: HttpService) {}

    // nestjs/axios - Libreria para consumir la API de Star Wars
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

    // axios - Libreria directa para consumir la API de Star Wars
    async listAll(): Promise<any> {
        try {
            const response = await axios.get(`${process.env.API_URL_BASE}films`, {
                headers: {
                    'Content-Type': "application/json"
                },
                maxBodyLength: Infinity,
            });
            console.log("Response from API:", response.config.url, response.status, response.statusText);
            return response.data;
        } catch (error) {
            console.log("Error al consumir api - films: " + error);
            throw error;
        }
    }

    async listById(id: number): Promise<any> {
        try {
            const response = await axios.get(`${process.env.API_URL_BASE}films/${id}`, {
                headers: {
                    'Content-Type': "application/json"
                },
                maxBodyLength: Infinity,
            });
            return response.data;
        } catch (error) {
            console.log("Error al consumir api - films: " + error);
            throw error;
        }
    }

}