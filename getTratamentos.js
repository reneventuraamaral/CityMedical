import { connectToDatabase } from  '../../lib/db';

export default async function handler(req, res) {
  try {
   
    const connection = await connectToDatabase();

    // Consulta à tabela propaganda
    const [rows] = await connection.query('SELECT id, nome, dtcad, duracao, id_usuario FROM tratamentos');

    // Fechar conexão
    //await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar tratamentos:', error);
    res.status(500).json({ message: 'Erro ao buscar tratamentos' });
  } finally {
    //if (connection) await connection.end(); // Fecha a conexão após o uso
  }
}
