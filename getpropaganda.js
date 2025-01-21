
import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.query('SELECT * FROM view_propagandas');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar propagandas:', error);
    res.status(500).json({ message: 'Erro ao buscar propagandas' });
  } finally {
    //if (connection) await connection.end(); // Fecha a conexão após o uso
  }
}
