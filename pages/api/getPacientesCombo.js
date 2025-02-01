import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { id, nome } = req.query; // Obtém os parâmetros da URL
    const db = await connectToDatabase();
    try {
        let query = "SELECT id, nome FROM cadpaciente";
        let values = [];

        if (id) {
            query += " WHERE id = ?";
            values.push(id);
        } else if (nome) {
            query += " WHERE nome LIKE ?";
            values.push(`%${nome}%`);
        }

        const [rows] = await db.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Nenhum paciente encontrado' });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
