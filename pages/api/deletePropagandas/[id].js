import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  const db = await connectToDatabase();

  if (req.method === 'DELETE') {
    await db.execute('DELETE FROM propagandas WHERE id=?', [id]);
    res.status(200).json({ message: 'Propaganda excluída!' });
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
