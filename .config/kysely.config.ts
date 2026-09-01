import { defineConfig } from 'kysely-ctl'
import db from '../src/db/db.ts'

export default defineConfig({
	// replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
	kysely: db,			
	migrations: {
		migrationFolder: "../src/db/migrations",
	},
	//   plugins: [],
	//   seeds: {
	//     seedFolder: "seeds",
	//   }
})
