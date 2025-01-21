export default async function handler(req, res) {
  let pool;

  try {
    // Conectar ao banco
   // const pool = await connectToDatabase();

    if (req.method === 'GET') {
      const { search } = req.query;

      if (!search) {
        return res.status(400).json({ error: 'Parâmetro de busca é obrigatório.' });
      }

      let query;
      let params;

      // Diferenciar busca por ID ou Nome
      if (!isNaN(search)) {
        // Busca por ID (numérico)
        query = `
         SELECT 
            m.id AS id_medicamento, 
            m.dt_pedido, m.dt_chegada, m.dt_entrega, 
            m.descricao, co.pago, 
            t.nome AS nome_tratamento, 
            d.nome AS nome_medico, 
            p.nome AS nome_paciente
          FROM medicamentos m
          JOIN cadpaciente p ON m.id_paciente = p.id
          JOIN medicos d ON m.id_medico = d.id
          JOIN tratamentos t ON m.id_tratamento = t.id
          JOIN contratos co ON m.id_paciente = co.id_paciente
          WHERE p.id = ?;
        `;
        params = [search];
      } else {
        // Busca por Nome (string)
        query = `
         SELECT 
            m.id AS id_medicamento, 
            m.dt_pedido, m.dt_chegada, m.dt_entrega, 
            m.descricao, co.pago, 
            t.nome AS nome_tratamento, 
            d.nome AS nome_medico, 
            p.nome AS nome_paciente
          FROM medicamentos m
          JOIN cadpaciente p ON m.id_paciente = p.id
          JOIN medicos d ON m.id_medico = d.id
          JOIN tratamentos t ON m.id_tratamento = t.id
          JOIN contratos co ON m.id_paciente = co.id_paciente
          WHERE p.nome LIKE ?;
        `;
        params = [`%${search}%`];
      }

      const [rows] = await pool.execute(query, params);


      if (rows.length === 0) {
        return res.status(404).json({ message: 'Nenhum medicamento encontrado.' });
      }

      res.status(200).json(rows);
    } else {
      res.status(405).json({ message: `Método ${req.method} não permitido.` });
    }
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ error: 'Erro no servidor.' });
  } 
}