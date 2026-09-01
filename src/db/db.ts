import { Kysely } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'
import { type DB } from 'kysely-generate'

// const db = new Kysely<DB>({
//     dialect: new PostgresJSDialect({
//         postgres: postgres({
//             database: process.env.DB || 'blog',
//             host: process.env.DB_HOST || 'localhost',
//             max: Number(process.env.DB_MAX_CONN || 5),
//             port: Number(process.env.DB_PORT || 5432),
//             user: process.env.DB_USER || 'postgres',
//             pass: process.env.DB_PASS || 'root',
//         }),
//     }),
// })


const db = new Kysely<DB>({
    dialect: new PostgresJSDialect({
        postgres: postgres(process.env.DATABASE_URL!),
    }),
})
export default db