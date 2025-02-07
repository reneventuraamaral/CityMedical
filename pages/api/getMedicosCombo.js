import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const connection = await connectToDatabase();
        const [rows] = await connection.query("SELECT id, nome FROM medicos");
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar médicos:', error);
        res.status(500).json({ error: 'Erro ao buscar médicos' });
    }
}
