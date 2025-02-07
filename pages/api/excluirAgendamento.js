import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { id } = req.query;
        
        if (!id) {
            return res.status(400).json({ error: 'ID do agendamento é obrigatório' });
        }

        const connection = await connectToDatabase();
        await connection.query('DELETE FROM agendamentos WHERE id = ?', [id]);

        res.status(200).json({ message: 'Agendamento excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        res.status(500).json({ error: 'Erro ao excluir agendamento' });
    }
}
