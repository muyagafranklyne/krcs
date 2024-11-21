const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: postgresql//postgres.uvesvahzdtvxfbapahul:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
