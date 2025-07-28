// Located at: netlify/functions/add-wish.js

// We need the 'pg' library to connect to the PostgreSQL database.
const { Pool } = require('pg');

// The DATABASE_URL is a secret environment variable we will set in the Netlify UI.
// This is the secure way to connect to our database.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

exports.handler = async (event) => {
  // We only accept POST requests to this function.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { username, wish } = JSON.parse(event.body);

    // Basic validation
    if (!username || !wish) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Username and wish are required.' }) };
    }
    
    // The SQL query to insert a new wish into our table.
    // We use parameterized queries ($1, $2) to prevent SQL injection attacks.
    const query = 'INSERT INTO wishes (username, wish_text) VALUES ($1, $2) RETURNING *';
    const values = [username, wish];
    
    // Execute the query
    const result = await pool.query(query, values);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Wish added successfully!', wish: result.rows[0] }),
    };

  } catch (error) {
    console.error('Error adding wish:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to add wish to the database.' }),
    };
  }
};
