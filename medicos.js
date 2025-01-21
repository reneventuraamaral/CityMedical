import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nome, especialidade,telefone, dtcad, id_usuario, crm, uf_crm } = req.body;

    if (!nome || !especialidade) {
      return res.status(400).json({ message: 'Nome e especialidade são obrigatórios.' });
    }

    try {
      
      //const { user } = useUser();
      //const id_usuario = user.id;
      console.log('Iniciando conexão com o banco...');
      const connection = await connectToDatabase();
      console.log('Conexão estabelecida com sucesso.');
      console.log('Dados recebidos:', req.body);

      const query = 'INSERT INTO medicos (nome, especialidade, telefone, dtcad, id_usuario, crm, uf_crm) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [nome, especialidade, telefone, dtcad, id_usuario, crm, uf_crm];

      console.log('Tentando executar a query:', query, 'com valores:', values);

      await connection.execute(query, values);
      //connection.end();

      res.status(201).json({ message: 'Médico cadastrado com sucesso!' });
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    } finally {
      //if (connection) await connection.end(); // Fecha a conexão após o uso
    }
  } else {
    res.status(405).json({ message: 'Método não permitido.' });
  }
}
