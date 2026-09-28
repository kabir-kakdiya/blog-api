import { CamelCasePlugin, Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";

import env from "../env.ts";
import { type DB } from "./types.ts";

const db = new Kysely<DB>({
    dialect: new PostgresJSDialect({
        postgres: postgres(env.DATABASE_URL),
    }),
    plugins: [new CamelCasePlugin()],
});

export default db;
