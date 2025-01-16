
import { connectToDatabase } from '../../lib/db'; 

export default async function handler(req, res) {
  try {
    // Conexão com o banco de dados
    const connection = await connectToDatabase();

    // Consulta à view
    const [rows] = await connection.execute('SELECT * FROM view_propagandas');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar propagandas:', error);
    res.status(500).json({ message: 'Erro ao buscar propagandas', error: error.message });
  }
}
