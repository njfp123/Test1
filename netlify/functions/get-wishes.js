// Located at: netlify/functions/get-wishes.js

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

exports.handler = async (event) => {
  try {
    // The SQL query to get all wishes, ordered by the newest first.
    const query = 'SELECT id, username, wish_text, created_at FROM wishes ORDER BY created_at DESC';
    
    const result = await pool.query(query);

    return {
      statusCode: 200,
      // The frontend expects a JSON array of wishes.
      body: JSON.stringify(result.rows),
    };

  } catch (error) {
    console.error('Error fetching wishes:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch wishes from the database.' }),
    };
  }
};
