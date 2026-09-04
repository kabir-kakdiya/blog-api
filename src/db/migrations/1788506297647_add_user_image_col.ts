import type { Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema.alterTable('user')
		.addColumn('image_id', "bigint", col => col.references("media.id").onDelete('set null'))
		.execute()
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.alterTable('user')
		.dropColumn('profile_image_id')
		.execute()
}
