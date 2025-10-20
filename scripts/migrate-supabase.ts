import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL and SUPABASE_ANON_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('🔄 Running Supabase migration...');
    
    const migrationSQL = readFileSync(
      join(process.cwd(), 'migrations', '0000_modern_purifiers.sql'),
      'utf-8'
    );

    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      console.error('❌ Migration failed:', error.message);
      console.log('\n📋 Please run this SQL manually in your Supabase SQL Editor:');
      console.log('\n' + migrationSQL);
      process.exit(1);
    }

    console.log('✅ Migration completed successfully!');
    console.log('✅ Table "analysis_results" created in Supabase');
  } catch (err) {
    console.error('❌ Error:', err);
    console.log('\n📋 Please run this SQL manually in your Supabase SQL Editor:');
    const migrationSQL = readFileSync(
      join(process.cwd(), 'migrations', '0000_modern_purifiers.sql'),
      'utf-8'
    );
    console.log('\n' + migrationSQL);
    process.exit(1);
  }
}

runMigration();
