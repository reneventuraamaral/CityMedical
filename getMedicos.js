import { connectToDatabase } from  '../../lib/db';
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
     
      const connection = await connectToDatabase();
     // let query;
     // query = 'SELECT id, nome, especialidade, telefone, crm, uf_crm FROM medicos';
      const [rows] = await connection.query('SELECT id, nome, especialidade, telefone, crm, uf_crm FROM medicos');
      //const [rows] = await db.execute(query);
      res.status(200).json(rows);
      //await connection.end();
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    } finally {
      //if (connection) await connection.end(); // Fecha a conexão após o uso
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }
}
