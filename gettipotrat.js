import { connectToDatabase } from  '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Configuração de conexão com o banco de dados
      const connection = await connectToDatabase();
    
      // Consulta SQL para buscar os dados da tabela tipotrat
      const [rows] = await connection.query('SELECT id, nome, duracao FROM tipotrat');

      // Retorna os dados em formato JSON
      res.status(200).json(rows);

      // Fecha a conexão com o banco
      //await connection.end();
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    } finally {
      //if (connection) await connection.end(); // Fecha a conexão após o uso
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }
}
