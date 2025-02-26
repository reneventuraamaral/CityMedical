import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    // Conexão com o banco de dados
    const connection = await mysql.createConnection({
      host: 'marcofriorefrigeracao.com.br', // Host do banco de dados
      user: 'marcofri_user',      // Usuário do banco de dados
      password: 'SenhaNova123@', // Senha do banco de dados
      database: 'marcofri_citymedical', // Nome do banco de dados
    });

    // Consulta à tabela propaganda
    const [rows] = await connection.execute('SELECT id, nome, dtcad, duracao, id_usuario FROM tratamentos');

    // Fechar conexão
    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar tratamentos:', error);
    res.status(500).json({ message: 'Erro ao buscar tratamentos' });
  }
}
