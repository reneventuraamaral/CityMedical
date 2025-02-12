import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { nome_paciente, cpf_paciente, id_propaganda, telefone, medico, unidade, data, hora, id_usuario } = req.body;

        console.log(nome_paciente, cpf_paciente, id_propaganda, telefone, medico, unidade, data, hora, id_usuario);

        if (!nome_paciente|| !id_propaganda || !telefone ||!medico || !unidade || !data || !hora || !id_usuario) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
       
        const connection = await connectToDatabase();
          // Inserir na tabela Cadpaciente
        const queryPaciente = `
        INSERT INTO cadpaciente (nome, cpf, idpropag, telefone, id_usuario)
        VALUES (?, ?, ?, ?, ?)
        `;
        const valuesPaciente = [nome_paciente, cpf_paciente, id_propaganda, telefone, id_usuario];

        const [result] = await connection.execute(queryPaciente, valuesPaciente);

        const id_paciente = result.insertId; // ID gerado na tabela Cadpaciente

        console.log('ID do paciente gerado:', id_paciente);

        await connection.query(
            'INSERT INTO agendamentos (id_paciente, id_medico, id_unidade, dtconsulta, horario, id_usuario) VALUES (?, ?, ?, ?, ?, ?)',
            [id_paciente, medico, unidade, data, hora, id_usuario]
        );

        res.status(201).json({ message: 'Pré-Agendamento realizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar Pré-agendamento:', error);
        res.status(500).json({ error: 'Erro ao cadastrar Pré-agendamento' });
    }
}
