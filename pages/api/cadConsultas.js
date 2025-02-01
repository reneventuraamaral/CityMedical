import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id_paciente, id_medico, obs, dtconsulta, medicamento, obs_medicamento, id_usuario, gerarReceita, receitaTexto, gerarExame, exameTexto } = req.body;

    if (!id_paciente || !obs) {
      return res.status(400).json({ message: 'ID_Paciente e Observação são obrigatórios.' });
    }

    let connection;
    try {
      console.log('Iniciando conexão com o banco...');
      connection = await connectToDatabase();
      console.log('Conexão estabelecida com sucesso.');
      console.log('Dados recebidos:', req.body);

      // Inserir na tabela fichamedica
      const queryFichamedica = `
        INSERT INTO fichamedica (id_paciente, id_medico, dtconsulta, obs, id_usuario)
        VALUES (?, ?, ?, ?, ?)
      `;
      const valuesFichamedica = [id_paciente, id_medico, dtconsulta, obs, id_usuario];

      const [result] = await connection.execute(queryFichamedica, valuesFichamedica);
      const id_fichamedica = result.insertId; // ID gerado na tabela fichamedica
      console.log('ID da ficha médica gerado:', id_fichamedica);
      
      //Inserir na tabela de medicamentos
      const queryMedicamentos = `
          INSERT INTO medicamentos (id_fichamedica, id_paciente, id_medico, descricao, observacao, id_usuario)
          VALUES (?, ?, ?, ?, ?, ?)
        `; 
      const valuesMedicamentos = [id_fichamedica, id_paciente, id_medico, medicamento, obs_medicamento, id_usuario];

      console.log('Parâmetros para medicamentos:', valuesMedicamentos);
        await connection.execute(queryMedicamentos, valuesMedicamentos);
        console.log('Medicamento gerado e salvo.');

      // Inserir na tabela receituarios, se necessário
      if (gerarReceita && receitaTexto) {
        const queryReceituarios = `
          INSERT INTO receituarios (id_fichamedica, receita, tipo, dtconsulta, id_usuario, id_paciente)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const paramsReceituarios = [
          id_fichamedica,
          receitaTexto,
          'C', // Tipo (comum ou controle especial)
          new Date(), // Data atual
          id_usuario,
          id_paciente,
        ];

        console.log('Parâmetros para receituarios:', paramsReceituarios);
        await connection.execute(queryReceituarios, paramsReceituarios);
        console.log('Receita gerada e salva.');
      }

      // Inserir na tabela exames, se necessário
      if (gerarExame && exameTexto) {
        const queryExames = `
          INSERT INTO exames (id_fichamedica, nome_exame, tipo, dtconsulta, id_usuario, id_paciente)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const paramsExames = [
          id_fichamedica,
          exameTexto,
          'P', // Tipo preventivo ou outro
          dtconsulta,
          id_usuario,
          id_paciente,
        ];

        console.log('Parâmetros para exames:', paramsExames);
        await connection.execute(queryExames, paramsExames);
        console.log('Exame gerado e salvo.');
      }

      res.status(201).json({ message: 'Consulta cadastrada com sucesso!' });
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    } finally {
      if (connection) {
        try {
          await connection.end(); // Fecha a conexão com o banco
        } catch (closeError) {
          console.error('Erro ao fechar a conexão:', closeError);
        }
      }
    }
  } else {
    res.status(405).json({ message: 'Método não permitido.' });
  }
}
