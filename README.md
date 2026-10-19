# 🌌 Star Wars Films API

API REST desarrollada con **NestJS** para consultar peliculas de Star Wars desde
[SWAPI](https://swapi.dev/) y administrar una coleccion propia de peliculas en
**Amazon DynamoDB**. La aplicacion esta organizada en capas, se ejecuta como
funcion **AWS Lambda** y cuenta con pruebas unitarias y analisis automatizado
con **SonarQube Cloud**.

## ✨ ¿Que puedes hacer?

- Consultar la lista paginada de peliculas de SWAPI y buscar una pelicula por ID.
- Listar, buscar y crear peliculas guardadas en DynamoDB.
- Recibir las peliculas de SWAPI con sus campos en ingles y las peliculas de
  DynamoDB con los campos traducidos al espanol.

## 🧰 Tecnologias

| Tecnologia | Uso |
| --- | --- |
| [NestJS](https://nestjs.com/) y TypeScript | Construccion de la API REST y organizacion de la aplicacion en modulos. |
| Arquitectura limpia por capas y conceptos de DDD | Separacion entre presentacion, aplicacion, dominio e infraestructura. |
| [SWAPI](https://swapi.dev/) | Fuente externa para consultar peliculas de Star Wars. |
| [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) | Base de datos NoSQL para las peliculas creadas por la API. |
| AWS Lambda y Serverless Framework | Despliegue y ejecucion de la API sin administrar servidores. |
| Jest | Pruebas unitarias de servicios, validaciones, mapeadores, repositorios y controlador. |
| SonarQube Cloud y GitHub Actions | Ejecucion automatica de build, pruebas con cobertura y analisis de calidad. |

## 🏛️ Como esta organizada

El codigo de `src/` esta dividido en capas para mantener cada responsabilidad
separada:

- **Presentacion** (`src/presentation/`): controlador NestJS que recibe las
  solicitudes HTTP y las deriva a los servicios.
- **Aplicacion** (`src/application/`): servicios con los casos de uso, validacion
  de peliculas nuevas y transformacion de datos entre ingles y espanol.
- **Dominio** (`src/domain/`): contratos de repositorios y modelos de peliculas,
  independientes de SWAPI, DynamoDB y HTTP.
- **Infraestructura** (`src/infrastructure/`): integraciones concretas con la
  API externa y con DynamoDB.
- **Ejecucion serverless** (`src/serverlessDeploy/`): modulo NestJS y handler que
  adapta las solicitudes de API Gateway para AWS Lambda.

En una consulta de SWAPI, el controlador invoca el servicio de Star Wars, que
usa el contrato del repositorio implementado por el adaptador HTTP. Para las
peliculas propias, el servicio de peliculas usa el repositorio de DynamoDB y
el mapeador para responder en espanol.

## 🚀 Rutas disponibles

La base de las rutas es `/starwars`.

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `GET` | `/starwars/films` | Lista paginada de peliculas de SWAPI (respuesta en ingles). |
| `GET` | `/starwars/films/{id}` | Consulta una pelicula de SWAPI por ID. |
| `GET` | `/starwars/dynamo/films` | Lista las peliculas guardadas en DynamoDB (respuesta en espanol). |
| `GET` | `/starwars/dynamo/films/{id}` | Consulta una pelicula de DynamoDB por ID (respuesta en espanol). |
| `POST` | `/starwars/dynamo/films` | Crea una pelicula en DynamoDB enviando sus datos en ingles; responde en espanol con estado `201`. |

La especificacion OpenAPI se encuentra en [`openapi.yml`](./openapi.yml). Sus
esquemas se mantienen aparte en [`openapi-components.yml`](./openapi-components.yml).

### Ejemplo: crear una pelicula

```http
POST /starwars/dynamo/films
Content-Type: application/json
```

```json
{
  "episode_id": 4,
  "title": "A New Hope",
  "opening_crawl": "It is a period of civil war...",
  "director": "George Lucas",
  "producer": "Gary Kurtz, Rick McCallum",
  "release_date": "1977-05-25",
  "characters": [],
  "planets": [],
  "starships": [],
  "vehicles": [],
  "species": []
}
```

Los campos del cuerpo corresponden al modelo en ingles. La API asigna el `id`
al crear la pelicula y devuelve el resultado con campos en espanol.

## ⚙️ Requisitos y configuracion

- Node.js **24** y npm.
- Una tabla de DynamoDB creada previamente.
- Credenciales de AWS disponibles localmente o en el entorno donde se despliegue.

Instala las dependencias:

```bash
npm install
```

Configura las variables necesarias en un archivo `.env` en la raiz del proyecto:

```dotenv
API_URL_BASE=https://swapi.dev/api/
DYNAMO_DB_TABLE=STARTWARS_DYNAMO
```

`API_URL_BASE` debe terminar en `/`, porque la aplicacion agrega `films` al
final. `DYNAMO_DB_TABLE` debe coincidir con el nombre de la tabla existente en
AWS. La tabla debe estar en la misma region y cuenta que la funcion Lambda, y
tener una clave de particion numerica llamada `id`.

No guardes credenciales de AWS ni secretos en el repositorio. Para desarrollo
local, configura el proveedor estandar de credenciales de AWS y la region
(`AWS_REGION`) para que el SDK pueda conectarse a DynamoDB.

## 🧪 Desarrollo y pruebas

Compilar el proyecto:

```bash
npm run build
```

Iniciar la API localmente con Serverless Offline:

```bash
npm start
```

El servidor local queda disponible normalmente en `http://localhost:3000`.
Por ejemplo, puedes consultar `http://localhost:3000/starwars/films`.
Las rutas de DynamoDB requieren que la tabla configurada sea accesible desde tu
entorno.

Ejecutar las pruebas unitarias:

```bash
npm test -- --runInBand
```

Generar el reporte de cobertura:

```bash
npm run test:cov -- --runInBand
```

## ☁️ Despliegue en AWS

El proyecto compila la aplicacion y Serverless Framework empaqueta y despliega
el handler de NestJS como funcion Lambda con rutas de API Gateway. La tabla de
DynamoDB debe existir antes del despliegue; la infraestructura configurada
otorga a la funcion permisos para leer elementos, guardar elementos y recorrer
la tabla.

Configura las credenciales de AWS, las variables de entorno requeridas y el
nombre de la tabla. Despues ejecuta:

```bash
npm run deploy -- --stage dev --region us-west-1
```

Al finalizar, Serverless muestra la URL de la API desplegada. Para eliminar el
stack de prueba (la tabla creada manualmente no se elimina), ejecuta:

```bash
npx serverless remove --stage dev --region us-west-1
```

## 📊 Calidad continua

El workflow de GitHub Actions en
`.github/workflows/sonarcloud.yml` se ejecuta en `push` a las ramas `develop`,
`release` y `master`, y en pull requests. Ejecuta la compilacion, las pruebas
con cobertura y luego el analisis de SonarQube Cloud.

Para habilitar el analisis, configura el secreto `SONAR_TOKEN` en la
configuracion del repositorio de GitHub. Si el proyecto usa el analisis
automatico de SonarQube Cloud, desactivalo para permitir que el workflow de CI
envie el analisis junto con el reporte de cobertura.
