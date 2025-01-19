//import mysql from 'mysql2/promise';
import { connectToDatabase } from  '../../lib/db';

export default async function handler(req, res) {
  try {
    // Conexão com o banco de dados
 
    const connection = await connectToDatabase();
    // Consulta à tabela unidades
    const [rows] = await connection.query('SELECT id,nome FROM unidades');

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    res.status(500).json({ message: 'Erro ao buscar unidades' });
  } finally {
    if (connection) await connection.end(); // Fecha a conexão após o uso
  }
}
