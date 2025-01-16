import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  const { nome, especialidade, telefone, dtcad, id_usuario, crm, uf_crm } = req.body;
  const db = await connectToDatabase();

  if (req.method === 'PUT') {
    await db.execute('UPDATE medicos SET nome=?, especialidade=?, telefone=?, dtcad=?, id_usuario=?, crm=?, uf_crm=? WHERE id=?', [nome, especialidade, telefone, dtcad, id_usuario, crm, uf_crm, id]);
    res.status(200).json({ message: 'Paciente atualizado!' });
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
