import { sql, type Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createType('media_status')
		.asEnum(['pending', 'active', 'deleted'])
		.execute()

	await db.schema.alterTable("media").addColumn("status", sql`media_status`, col => col.notNull().defaultTo('pending')).execute()
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.alterTable('media').dropColumn("status").execute()
	await db.schema.dropType('media_status').execute()
}
