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

  if (method !== 'GET') {
    res.status(405).json({ message: 'Método não permitido. Use GET.' });
    return;
  }

  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'ID do medicamento é necessário!' });
    return;
  }

  try {
    const connection = await connectToDatabase();

    console.log('ID recebido para busca do medicamento:', id);

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
      WHERE m.id = ?
    `;

    const params = [id];
    const [rows] = await connection.execute(query, params);
    console.log('ID recebido para busca do medicamento:', id);


    if (rows.length > 0) {
      res.status(200).json(rows[0]); // Retorna apenas o primeiro registro
    } else {
      res.status(404).json({ message: 'Medicamento não encontrado.' });
    }

    connection.end();
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ error: 'Erro no servidor.' });
  }
}
