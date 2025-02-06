import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
    const db = await connectToDatabase();
    const { id, nome } = req.query;

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

        console.log("🟢 Query executada:", query, "| Valores:", values);

        const [rows] = await db.query(query, values);

        if (rows.length === 0) {
            console.warn("⚠️ Nenhum paciente encontrado.");
            return res.status(404).json({ error: 'Paciente não encontrado.' });
        }

        const vid = rows[0].id;
        console.log("✅ Paciente encontrado. ID:", vid);

        // Buscar todos os detalhes do paciente
        const [dadosPaciente] = await db.query('SELECT * FROM cadpaciente WHERE id = ?', [vid]);
        const [prescricoes] = await db.query('SELECT * FROM fichamedica WHERE id_paciente = ?', [vid]);
        console.log("📋 Prescrições armazenadas no estado:", db.prescricoes);
        const [receitas] = await db.query('SELECT * FROM receituarios WHERE id_paciente = ?', [vid]);
        const [exames] = await db.query('SELECT * FROM exames WHERE id_paciente = ?', [vid]);
        const [medicamentos] = await db.query('SELECT * FROM medicamentos WHERE id_paciente = ?', [vid]);
        console.log("📋 Ficha Médica antes do envio:", dadosPaciente);
       // Garante que a API sempre retorna um array
res.status(200).json({
    dadosPaciente,
    prescricoes: prescricoes || [], // Se for null, substitui por []
    receitas: receitas || [],
    exames: exames || [],
    medicamentos: medicamentos || []
});

    } catch (error) {
        console.error("❌ Erro ao buscar dados do paciente:", error);
        return res.status(500).json({ message: 'Erro ao buscar dados do paciente.' });
    }
}
