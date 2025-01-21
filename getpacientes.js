import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let pool; // Inicializa a variável para o pool de conexões
    try {
      pool = await connectToDatabase(); // Obtenha o pool de conexões
      const query = 'SELECT * FROM cadpaciente';
      const [rows] = await pool.execute(query); // Use o pool para executar a consulta

      res.status(200).json(rows);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      res.status(500).json({ message: 'Erro ao buscar pacientes.' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
