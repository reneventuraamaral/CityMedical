import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { paciente, medico, data } = req.query;
        const connection = await connectToDatabase();

        let query = `
            SELECT a.id, p.nome AS paciente, m.nome AS medico, u.nome AS unidade, 
                   dtconsulta, 
                   DATE_FORMAT(a.horario, '%H:%i') as horario
            FROM agendamentos a
            INNER JOIN cadpaciente p ON a.id_paciente = p.id
            INNER JOIN medicos m ON a.id_medico = m.id
            INNER JOIN unidades u ON a.id_unidade = u.id
            WHERE 1 = 1
        `;
        const values = [];

        if (paciente) {
            query += " AND a.id_paciente = ?";
            values.push(paciente);
        }
        if (medico) {
            query += " AND a.id_medico = ?";
            values.push(medico);
        }
        if (data) {
            query += " AND a.dtconsulta = ?";
            values.push(data);
        }

        const [rows] = await connection.query(query, values);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
    }
}
