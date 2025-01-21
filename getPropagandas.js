//import mysql from 'mysql2/promise';
import { connectToDatabase } from  '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
   
      console.log('Iniciando conexão com o banco...');
      const connection = await connectToDatabase();
      console.log('Conexão estabelecida com sucesso.');
      console.log('Dados recebidos:', req.body);

      const query = 'SELECT id, veiculo, nome, dtcad, id_usuario FROM propagandas';
      const [rows] = await connection.query('SELECT id, veiculo, nome, dtcad, id_usuario FROM propagandas');

      console.log('Tentando executar a query:', query);

      //await connection.execute(query);
      // Retorna os dados em formato JSON
      res.status(200).json(rows);

     
      //await connection.end();
    } catch (error) {
      console.error('Erro ao buscar propagandas:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    } finally {
      //if (connection) await connection.end(); // Fecha a conexão após o uso
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }
}
