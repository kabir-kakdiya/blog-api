import { sql, type Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	await sql`
    CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';
  `.execute(db);

	await sql`DO $$
DECLARE
    -- Variable to hold table names during the loop
    r RECORD;
BEGIN
    -- Loop through all user tables in the 'public' schema
    -- (Exclude tables that already have this trigger attached)
    FOR r IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          AND table_name NOT IN (
              SELECT DISTINCT event_object_table 
              FROM information_schema.triggers 
              WHERE trigger_name = 'trg_update_modified_column'
          )
    LOOP
        -- 1. Ensure the table actually has an 'updated_at' column before adding the trigger
        IF EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND table_name = r.table_name 
              AND column_name = 'updated_at'
        ) THEN
            -- 2. Execute dynamic SQL to bind the trigger to the table
            EXECUTE format('
                CREATE TRIGGER trg_update_modified_column
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_modified_column();', 
                r.table_name
            );
            
            RAISE NOTICE 'Attached trigger to table: %', r.table_name;
        END IF;
    END LOOP;
END $$;
`.execute(db)
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	// down migration code goes here...
	// note: down migrations are optional. you can safely delete this function.
	// For more info, see: https://kysely.dev/docs/migrations
	await sql`DO $$
DECLARE
    r RECORD;
BEGIN
    -- Loop through all tables in the 'public' schema that currently have the trigger
    FOR r IN 
        SELECT DISTINCT event_object_table AS table_name
        FROM information_schema.triggers 
        WHERE table_schema = 'public'
          AND trigger_name = 'trg_update_modified_column'
    LOOP
        -- Execute dynamic SQL to safely drop the trigger
        EXECUTE format('
            DROP TRIGGER IF EXISTS trg_update_modified_column ON %I;', 
            r.table_name
        );
        
        RAISE NOTICE 'Dropped trigger from table: %', r.table_name;
    END LOOP;
END $$;
`.execute(db)
	await sql`DROP FUNCTION IF EXISTS update_modified_column();`.execute(db)
}
