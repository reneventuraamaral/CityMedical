import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'marcofriorefrigeracao.com.br', // Host do banco de dados
  user: 'marcofri_user',      // Usuário do banco de dados
  password: 'SenhaNova123@', // Senha do banco de dados
  database: 'marcofri_citymedical', // Nome do banco de dados
};

const connectToDatabase = async () => {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
};

export default async function handler(req, res) {
  const { method } = req;

  try {
    const connection = await connectToDatabase();

    if (method === 'GET') {
      const { search, id } = req.query;

      // Validação de parâmetros
      if (!search && !id) {
        res.status(400).json({ error: 'Parâmetro de pesquisa ou ID é necessário!' });
        return;
      }

      let query;
      let params;

      // Busca por ID
      if (id) {
        console.log('ID recebido para busca:', id); // Log do ID
        query = `
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
        query = `
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

      if (rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(404).json({ message: 'Nenhum registro encontrado.' });
      }
      console.log('Parâmetros recebidos na API:', { id, search });
      console.log('Query executada:', query, 'Parâmetros:', params);


    }

    // Adicionar Medicamentos
    if (method === 'POST') {
      const { id_paciente, id_medico, id_tratamento, dt_pedido, descricao } = req.body;

      if (!id_paciente || !id_medico || !id_tratamento || !dt_pedido || !descricao) {
        res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
        return;
      }

      await connection.execute(
        `
        INSERT INTO medicamentos (id_paciente, id_medico, id_tratamento, dt_pedido, descricao)
        VALUES (?, ?, ?, ?, ?)
        `,
        [id_paciente, id_medico, id_tratamento, dt_pedido, descricao]
      );

      res.status(200).json({ message: 'Medicamento cadastrado com sucesso!' });
    }

    // Atualizar Medicamentos
    if (method === 'PUT') {
      const { id } = req.query;
      const { dt_manipulacao, dt_chegada, dt_entrega } = req.body;

      if (!id || (!dt_manipulacao && !dt_chegada && !dt_entrega)) {
        res.status(400).json({ error: 'ID e pelo menos uma data são obrigatórios!' });
        return;
      }

      await connection.execute(
        `
        UPDATE medicamentos
        SET 
          dt_manipulacao = ?, 
          dt_chegada = ?, 
          dt_entrega = ?
        WHERE id = ?
        `,
        [dt_manipulacao, dt_chegada, dt_entrega, id]
      );

      res.status(200).json({ message: 'Medicamento atualizado com sucesso!' });
    }

    connection.end();
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ error: 'Erro no servidor.' });
  }
}
