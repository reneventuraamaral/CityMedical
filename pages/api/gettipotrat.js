// pages/api/gettipotrat.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Configuração de conexão com o banco de dados
      const connection = await mysql.createConnection({
        host: 'marcofriorefrigeracao.com.br', // Host do banco de dados
        user: 'marcofri_user',      // Usuário do banco de dados
        password: 'SenhaNova123@', // Senha do banco de dados
        database: 'marcofri_citymedical', // Nome do banco de dados
      });

      // Consulta SQL para buscar os dados da tabela tipotrat
      const [rows] = await connection.execute('SELECT id, nome, duracao FROM tratamentos');

      // Retorna os dados em formato JSON
      res.status(200).json(rows);

      // Fecha a conexão com o banco
      await connection.end();
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }
}
