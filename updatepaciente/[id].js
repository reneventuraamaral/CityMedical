import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  const { nome, cpf, idpropag, telefone, logradouro, numero, complemento, bairro, cidade, uf, cep, id_usuario, dtnascimento, id_unidade } = req.body;
  const db = await connectToDatabase();

  if (req.method === 'PUT') {
    await db.execute('UPDATE cadpaciente SET nome=?, cpf=?, idpropag=?, telefone=?, logradouro=?, numero=?, complemento=?, bairro=?, cidade=?, uf=?, cep=?, id_usuario=?, dtnascimento=?, id_unidade=? WHERE id=?', [nome, cpf, idpropag, telefone, logradouro, numero, complemento, bairro, cidade, uf, cep, id_usuario, dtnascimento, id_unidade, id]);
    res.status(200).json({ message: 'Paciente atualizado!' });
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
