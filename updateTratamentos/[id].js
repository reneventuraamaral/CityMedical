import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  const { nome, dtcad, duracao, id_usuario } = req.body;
  const db = await connectToDatabase();

  if (req.method === 'PUT') {
    await db.execute('UPDATE tratamentos SET nome=?, dtcad=?, duracao=?,id_usuario=? WHERE id=?', [nome, dtcad, duracao, id_usuario, id]);
    res.status(200).json({ message: 'Propaganda atualizado!' });
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
