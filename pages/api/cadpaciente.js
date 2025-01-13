import { connectToDatabase } from '../../lib/db';
//import { useRouter } from 'next/router';

//const router = useRouter();

export default async function handler(req, res) {
  const db = await connectToDatabase();

 
  if (req.method === 'GET') {
    // Buscar todos os pacientes
    const [rows] = await db.execute('SELECT * FROM cadpaciente');
    res.status(200).json(rows);
  }

  if (req.method === 'POST') {
    // Inserir um novo paciente
    //const { nome, cpf, idpropag, telefone, logradouro, numero, complemento, bairro, cidade, uf, cep, id_usuario, dtnascimento, id_unidade } = req.body;
    const { nome, cpf, idpropag, telefone, logradouro, numero, complemento, bairro, cidade, uf, cep, id_usuario, dtnascimento, id_unidade } = req.body;
    await db.execute(
      'INSERT INTO cadpaciente (nome, cpf, idpropag, telefone, logradouro, numero, complemento, bairro, cidade, uf, cep, id_usuario, dtnascimento, id_unidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nome, cpf, idpropag, telefone, logradouro, numero, complemento, bairro, cidade, uf, cep, id_usuario, dtnascimento, id_unidade]
    );

    res.status(201).json({ message: 'Paciente cadastrado com sucesso!' });
  }
}
