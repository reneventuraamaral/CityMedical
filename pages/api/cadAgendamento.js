import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { paciente, medico, unidade, data, hora, id_usuario } = req.body;

        if (!paciente || !medico || !unidade || !data || !hora || !id_usuario) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const connection = await connectToDatabase();
        await connection.query(
            'INSERT INTO agendamentos (id_paciente, id_medico, id_unidade, dtconsulta, horario, id_usuario) VALUES (?, ?, ?, ?, ?, ?)',
            [paciente, medico, unidade, data, hora, id_usuario]
        );

        res.status(201).json({ message: 'Agendamento realizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar agendamento:', error);
        res.status(500).json({ error: 'Erro ao cadastrar agendamento' });
    }
}
