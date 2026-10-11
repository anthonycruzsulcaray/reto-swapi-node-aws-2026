
export class FilmBodyPagedEnglish {
    count: number
    next: string | null
    previous: string | null
    results: FilmBodyEnglish[]
}


export class FilmBodyEnglish {
    id: number
    episode_id: number
    title: string
    opening_crawl: string
    director: string
    producer: string
    release_date: string
    characters: string[]
    planets: string[]
    starships: string[]
    vehicles: string[]
    species: string[]
    created: string
    edited: string
    url: string
}

export class FilmBodySpanish {
    id: number
    episodio_id: number
    titulo: string
    rastreo_apertura: string
    director: string
    productor: string
    fecha_lanzamiento: string
    caracteres: string[]
    planetas: string[]
    naves_estelares: string[]
    vehiculos: string[]
    especies: string[]
    creado: string
    editado: string
    url: string
}
