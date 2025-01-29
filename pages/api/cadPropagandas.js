import { connectToDatabase } from '../../lib/db';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { veiculo, nome, dtcad, id_usuario } = req.body;

    if (!veiculo || !nome) {
      return res.status(400).json({ message: 'Nome e especialidade são obrigatórios.' });
    }

    try {
      
      //const { user } = useUser();
      //const id_usuario = user.id;
      console.log('Iniciando conexão com o banco...');
      const connection = await connectToDatabase();
      console.log('Conexão estabelecida com sucesso.');
      console.log('Dados recebidos:', req.body);

      const query = 'INSERT INTO propagandas (veiculo, nome, dtcad, id_usuario) VALUES (?, ?, ?, ?)';
      const values = [veiculo, nome, dtcad, id_usuario];

      console.log('Tentando executar a query:', query, 'com valores:', values);

      await connection.execute(query, values);
      //connection.end();

      res.status(201).json({ message: 'Propaganda cadastrada com sucesso!' });
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido.' });
  }
}
