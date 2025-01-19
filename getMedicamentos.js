import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const pool = await connectToDatabase(); // Use o pool de conexões

    //const { search } = req.query;
    const { search, id } = req.query;
      console.log(req.query);
      //let query;
      let params;
      console.log('Valores recebidos para busca:', search,id);

    if (!search) {
      return res.status(400).json({ error: 'Parâmetro de pesquisa é necessário.' });
    }

    if (id) {
        console.log('ID recebido para busca:', id); // Log do ID
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
          WHERE p.id = ?
        `;
        params = [id];
        console.log('Query executada:', query, 'Parâmetros:', params); // Log da query
      } 
      // Busca por Nome
      else {
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
          WHERE p.nome LIKE ?
        `;
        params = [`%${search}%`];
      }

      const [rows] = await connection.execute(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nenhum medicamento encontrado.' });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar medicamentos:', error);
    res.status(500).json({ message: 'Erro ao buscar medicamentos.' });
  }
}