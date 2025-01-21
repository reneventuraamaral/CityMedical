import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      nome,
      cpf,
      idpropag,
      telefone,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
      cep,
      dtnascimento,
      id_usuario,
      id_unidade,
    } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !cpf || !id_usuario || !idpropag) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando!' });
    }

    try {
      // Conexão com o banco de dados
      const connection = await connectToDatabase();

      // Query para inserir o paciente
      const query = `
        INSERT INTO cadpaciente (
          nome, cpf, idpropag, telefone, logradouro, numero, complemento,
          bairro, cidade, uf, cep, dtnascimento, id_usuario, dtcad, id_unidade
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
      `;

      const values = [
        nome,
        cpf,
        idpropag,
        telefone,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        uf,
        cep,
        dtnascimento,
        id_usuario,
        id_unidade,
      ];

      await connection.execute(query, values);

      // Fechar conexão e enviar resposta
      //connection.end();
      res.status(201).json({ message: 'Paciente cadastrado com sucesso!' });
    } catch (error) {
      console.error('Erro ao cadastrar paciente:', error);
      res.status(500).json({ message: 'Erro no servidor.' });
    } finally {
      //if (connection) await connection.end(); // Fecha a conexão após o uso
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
