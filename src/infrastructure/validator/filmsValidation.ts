import { Injectable } from "@nestjs/common"
import { FilmBodyEnglish, FilmBodySpanish } from "../../domain/entities/film.entities"

@Injectable()
export  class FilmValidator {

    validateSpanish(pelicula: FilmBodySpanish) {
        if (!pelicula.titulo || (pelicula.titulo.length) == 0) {
            throw Error("campo obligatorio: pelicula.titulo")
        }
        if (!pelicula.rastreo_apertura || (pelicula.rastreo_apertura.length) == 0) {
            throw Error("campo obligatorio: pelicula.rastreo_apertura")
        }
        if (!pelicula.director || (pelicula.director.length) == 0) {
            throw Error("campo obligatorio: pelicula.director")
        }
        if (!pelicula.productor || (pelicula.productor.length) == 0) {
            throw Error("campo obligatorio: pelicula.productor")
        }
        if (!pelicula.fecha_lanzamiento || (pelicula.fecha_lanzamiento.length) == 0) {
            throw Error("campo obligatorio: pelicula.fecha_lanzamiento")
        }
        if (!pelicula.caracteres || (pelicula.caracteres.length) == 0) {
            throw Error("campo obligatorio: pelicula.caracteres")
        }
        if (!pelicula.planetas || (pelicula.planetas.length) == 0) {
            throw Error("campo obligatorio: pelicula.planetas")
        }
        if (!pelicula.naves_estelares || (pelicula.naves_estelares.length) == 0) {
            throw Error("campo obligatorio: pelicula.naves_estelares")
        }
        if (!pelicula.vehiculos || (pelicula.vehiculos.length) == 0) {
            throw Error("campo obligatorio: pelicula.vehiculos")
        }
        if (!pelicula.especies || (pelicula.especies.length) == 0) {
            throw Error("campo obligatorio: pelicula.especies")
        }
    }


    validateEnglish(pelicula: FilmBodyEnglish) {
        if (!pelicula.title || (pelicula.title.length) == 0) {
            throw Error("campo obligatorio: pelicula.title")
        }
        if (!pelicula.opening_crawl || (pelicula.opening_crawl.length) == 0) {
            throw Error("campo obligatorio: pelicula.opening_crawl")
        }
        if (!pelicula.director || (pelicula.director.length) == 0) {
            throw Error("campo obligatorio: pelicula.director")
        }
        if (!pelicula.producer || (pelicula.producer.length) == 0) {
            throw Error("campo obligatorio: pelicula.producer")
        }
        if (!pelicula.release_date || (pelicula.release_date.length) == 0) {
            throw Error("campo obligatorio: pelicula.release_date")
        }
        if (!pelicula.characters || (pelicula.characters.length) == 0) {
            throw Error("campo obligatorio: pelicula.characters")
        }
        if (!pelicula.planets || (pelicula.planets.length) == 0) {
            throw Error("campo obligatorio: pelicula.planets")
        }
        if (!pelicula.starships || (pelicula.starships.length) == 0) {
            throw Error("campo obligatorio: pelicula.starships")
        }
        if (!pelicula.vehicles || (pelicula.vehicles.length) == 0) {
            throw Error("campo obligatorio: pelicula.vehicles")
        }
        if (!pelicula.species || (pelicula.species.length) == 0) {
            throw Error("campo obligatorio: pelicula.species")
        }
    }

}
