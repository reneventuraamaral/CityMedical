import mysql from 'mysql2/promise';
export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { id, nome } = req.query;

        try {
            const db = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'citymedical',
            });

            let query;
            let params;

            if (id) {
                query = 'SELECT c.nome nome_paciente,c.id id_paciente,tt.nome nome_tratamento,t.id id_tratamento,t.id_medico , m.nome nome_medico FROM cadpaciente c JOIN tratamentos t ON (t.id_paciente = c.id) JOIN tipotrat tt ON (t.id_tptrat = tt.id) JOIN medicos m ON (t.id_medico = m.id) WHERE c.id = ?';
                params = [id];
            } else if (nome) {
                query = 'SELECT c.nome nome_paciente,c.id id_paciente,tt.nome nome_tratamento,t.id id_tratamento,t.id_medico , m.nome nome_medico FROM cadpaciente c JOIN tratamentos t ON (t.id_paciente = c.id) JOIN tipotrat tt ON (t.id_tptrat = tt.id) JOIN medicos m ON (t.id_medico = m.id) WHERE c.nome LIKE ?';
                params = [`%${nome}%`];
            }

            const [rows] = await db.execute(query, params);

            if (rows.length > 0) {
                res.status(200).json(rows);
            } else {
                res.status(404).json({ message: 'Paciente não encontrado' });
            }

            await db.end();
        } catch (error) {
            console.error('Erro no servidor:', error.message); // Log detalhado
            console.log('Query recebida:', req.query);

            res.status(500).json({ message: 'Erro no servidor', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
