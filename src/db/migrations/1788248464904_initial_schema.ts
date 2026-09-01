import { sql, type Kysely, CreateTableBuilder } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {

	await withTimestamps(
		db.schema.createTable('user')
			.addColumn("id", "bigint", col => col.generatedAlwaysAsIdentity().primaryKey())
			.addColumn("full_name", "varchar(50)", col => col.notNull())
			.addColumn("email", "varchar(200)", col => col.notNull().unique())
			.addColumn("password", "varchar(500)", col => col.notNull())
			.addColumn("bio", "varchar(100)")
	)
		.execute()

	await withTimestamps(db.schema.createTable('social')
		.addColumn("user_id", "bigint", col => col.references('user.id').onDelete('cascade').primaryKey())
		.addColumn("twitter", "varchar(200)", col => col.unique())
		.addColumn("facebook", "varchar(200)", col => col.unique())
		.addColumn("linkedin", "varchar(200)", col => col.unique())
		.addCheckConstraint('at_least_one_social_link', sql`
			twitter IS NOT NULL 
			OR facebook IS NOT NULL
			OR linkedin IS NOT NULL
			`))
		.execute()

	await withTimestamps(db.schema.createTable('article')
		.addColumn("id", "bigint", col => col.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("title", "varchar(200)", col => col.notNull())
		.addColumn("description", "varchar(400)", col => col.notNull())
		.addColumn("text", "text", col => col.notNull())
		.addColumn("author", "bigint", col => col.references('user.id').notNull().onDelete('cascade')))
		.execute()


	await withTimestamps(db.schema.createTable("comment")
		.addColumn("id", "bigint", col => col.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("article_id", "bigint", col => col.references('article.id').onDelete('cascade').notNull())
		.addColumn("text", "text", col => col.notNull())
		.addColumn("author", "bigint", col => col.references("user.id").notNull().onDelete('cascade'))
		.addColumn("deleted_at", "timestamptz"))
		.execute()

	await withTimestamps(db.schema.createTable("tag")
		.addColumn("id", "bigint", col => col.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("name", "varchar(200)", col => col.notNull()))
		.execute()

	await withTimestamps(db.schema.createTable("article_tag")
		.addColumn("tag_id", "bigint", col => col.references("tag.id").onDelete('cascade'))
		.addColumn("article_id", "bigint", col => col.references('article.id').onDelete('cascade'))
		.addPrimaryKeyConstraint("article_tags_primary_key", ["article_id", "tag_id"]))
		.execute()

	await withTimestamps(db.schema.createTable('media')
		.addColumn("id", "bigint", col => col.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("key", "varchar(200)", col => col.notNull())
		.addColumn("user_id", "bigint", col => col.references("user.id").onDelete("cascade").notNull())
		.addColumn("mime_type", 'varchar(50)', col => col.notNull())
		.addColumn("file_size", "int4", col => col.notNull())
		.addColumn("article_id", "bigint", col => col.references('article.id').onDelete('cascade'))
		.addColumn("comment_id", "bigint", col => col.references('comment.id').onDelete('cascade'))
		.addCheckConstraint("media_single_usage", sql`
			num_nonnulls(article_id, comment_id) <= 1
			`) // num_nonnulls is a postgres built-in function
	)
		.execute()
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("tag").execute()
	await db.schema.dropTable("user").execute()
}

export function withTimestamps(qb: CreateTableBuilder<any, any>) {
	return qb
		.addColumn('created_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('updated_at', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull());
}