import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { id, nome } = req.query;

    try {
        const pool = await connectToDatabase(); // Obtém a pool de conexões
        const connection = await pool.getConnection(); // Obtém uma conexão do pool

        let query = "SELECT id, nome FROM cadpaciente";
        let values = [];

        if (id) {
            query += " WHERE id = ?";
            values.push(id);
        } else if (nome) {
            query += " WHERE nome LIKE ?";
            values.push(`%${nome}%`);
        }

        const [rows] = await connection.query(query, values);

        if (rows.length === 0) {
            connection.release(); // Libera a conexão antes de sair
            return res.status(404).json({ error: 'Paciente não encontrado.' });
        }

        const vid = rows[0].id; 

        const [dadosPaciente] = await connection.query('SELECT * FROM cadpaciente WHERE id = ?', [vid]);
        const [prescricoes] = await connection.query('SELECT * FROM fichamedica WHERE id_paciente = ?', [vid]);
        const [receitas] = await connection.query('SELECT * FROM receituarios WHERE id_paciente = ?', [vid]);
        const [exames] = await connection.query('SELECT * FROM exames WHERE id_paciente = ?', [vid]);
        const [medicamentos] = await connection.query('SELECT * FROM medicamentos WHERE id_paciente = ?', [vid]);

        connection.release(); // Libera a conexão após a execução das queries

        res.status(200).json({ dadosPaciente, prescricoes, receitas, exames, medicamentos });
    } catch (error) {
        console.error('Erro ao buscar dados do paciente:', error);
        res.status(500).json({ message: 'Erro ao buscar dados do paciente.' });
    }
}
