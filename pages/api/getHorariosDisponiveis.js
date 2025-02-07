import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { medico, data } = req.query;

    if (!medico || !data) {
        return res.status(400).json({ error: 'Médico e data são obrigatórios' });
    }

    try {
        const connection = await connectToDatabase();

        // Lista de horários padrão (8h às 18h)
        const horariosDisponiveis = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30","14:00", "14:30","15:00", "15:30", "16:00", "16:30","17:00", "17:30", "18:00"];

        // Buscar horários já agendados usando os nomes corretos das colunas
        const [agendamentos] = await connection.query(
            "SELECT horario FROM agendamentos WHERE id_medico = ? AND dtconsulta = ?",
            [medico, data]
        );

        // Criar um array com os horários ocupados
        const horariosOcupados = agendamentos.map(a => a.horario);

        // Retornar os horários com a informação de ocupado ou não
        const resposta = horariosDisponiveis.map(hora => ({
            hora,
            ocupado: horariosOcupados.includes(hora)
        }));

        res.status(200).json(resposta);
    } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        res.status(500).json({ error: 'Erro ao buscar horários' });
    }
}




