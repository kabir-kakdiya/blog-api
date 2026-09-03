import { CamelCasePlugin, Kysely } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'
import { type DB } from 'kysely-generate'

const db = new Kysely<DB>({
    dialect: new PostgresJSDialect({
        postgres: postgres(process.env.DATABASE_URL!),
    }),
    plugins: [new CamelCasePlugin()]
})
export default db