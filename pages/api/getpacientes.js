import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  const db = await connectToDatabase();
  

  if (req.method === 'GET') {
    const [rows] = await db.execute('SELECT * FROM cadpaciente');
    res.status(200).json(rows);
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
