import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;

    if (!id) {
      res.status(400).json({ message: 'ID do paciente é obrigatório.' });
      return;
    }

    try {
      const connection = await connectToDatabase();
      const [dadosPaciente] = await connection.query('SELECT * FROM cadpaciente WHERE id = ?', [id]);
      const [prescricoes] = await connection.query('SELECT * FROM fichamedica WHERE id_paciente = ?', [id]);
      const [receitas] = await connection.query('SELECT * FROM receituarios WHERE id_paciente = ?', [id]);

      res.status(200).json({ dadosPaciente, prescricoes, receitas });
    } catch (error) {
      console.error('Erro ao buscar dados do paciente:', error);
      res.status(500).json({ message: 'Erro ao buscar dados do paciente.' });
    }
  } else {
    res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }
}
