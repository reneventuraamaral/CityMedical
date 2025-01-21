import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { id_paciente, id_medico, id_tratamento, desc } = req.body;

        if (!id_paciente || !id_medico || !id_tratamento || !desc) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        try {
            const db = await connectToDatabase();
            const [result] = await db.execute(
                'INSERT INTO medicamentos (id_paciente, id_medico, id_tratamento, dt_pedido, desc) VALUES (?, ?, ?, NOW(), ?)',
                [id_paciente, id_medico, id_tratamento, desc]
            );

            res.status(201).json({ message: 'Medicamento cadastrado com sucesso.', id: result.insertId });
        } catch (error) {
            console.error('Erro ao cadastrar medicamento:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }finally {
            //if (db) await db.end(); // Fecha a conexão após o uso
          }
    } else {
        res.status(405).json({ message: 'Método não permitido.' });
    }
}
