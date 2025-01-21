//import mysql from 'mysql2/promise';
import { connectToDatabase } from  '../../lib/db';

/* const dbConfig = {
  host: 'marcofriorefrigeracao.com.br', // Host do banco de dados
  user: 'marcofri_user',      // Usuário do banco de dados
  password: 'SenhaNova123@', // Senha do banco de dados
  database: 'marcofri_citymedical', // Nome do banco de dados
}; */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ message: 'Login e senha são obrigatórios' });
  }

  try {
    //const connection = await mysql.createConnection(dbConfig);
    const connection = await connectToDatabase();

    const [rows] = await connection.query(
      'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?',
      [usuario, senha]
    );

    if (rows.length > 0) {
        //res.status(200).json({ message: 'Login realizado com sucesso.', user: rows[0] });
        console.log('Dados retornados pelo banco:', rows[0]);

    } else {
        res.status(401).json({ message: 'Usuário ou senha inválidos.' });
    }

   /* if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário ou senha inválidos' });
    }*/

    res.status(200).json(rows[0]); // Retorna apenas o primeiro resultado
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  } finally {
    //if (connection) await connection.end(); // Fecha a conexão após o uso
  }
}
