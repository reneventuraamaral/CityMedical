import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'ID do medicamento é obrigatório.' });
    }

    const pool = await connectToDatabase();

    const query = `
     SELECT 
                      m.id AS id_medicamento,  p.id AS id_paciente, m.dt_pedido, 
                      m.dt_manipulacao, m.dt_chegada, m.dt_entrega, m.descricao, 
                      p.nome AS nome_paciente, t.nome AS nome_tratamento, d.nome AS nome_medico,
                      t.nome AS nome_tratamento,
                      CASE 
                        WHEN (dt_entrega IS NULL) OR (dt_entrega='0000-00-00') 
                        THEN 'Não retirado' 
                        ELSE CONCAT('Medicamento Retirado em ',DATE_FORMAT(m.dt_entrega, '%d/%m/%Y'))
                     END AS st_retirada, co.pago 
                FROM medicamentos m
                    JOIN cadpaciente p ON m.id_paciente = p.id
                    JOIN medicos d ON m.id_medico = d.id
                    JOIN tratamentos t ON m.id_tratamento = t.id
                    JOIN contratos co ON m.id_paciente = co.id_paciente
      WHERE m.id = ?;
    `;

    // **Corrigido**: Passar `id` como um array
    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nenhum medicamento encontrado com esse ID.' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar medicamento:', error);
    res.status(500).json({ message: 'Erro ao buscar medicamento.' });
  }
}