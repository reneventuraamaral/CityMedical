import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = await connectToDatabase();
      const [rows] = await db.query('SELECT * FROM cadpaciente');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      res.status(500).json({ message: 'Erro ao buscar pacientes.' });
    } finally {
      if (db) await db.end(); // Fecha a conexão após o uso
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
