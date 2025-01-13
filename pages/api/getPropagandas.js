import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'citymedical',
      });

      const [rows] = await connection.execute('SELECT id, veiculo, nome, dtcad, id_usuario FROM propagandas');
      res.status(200).json(rows);
      await connection.end();
    } catch (error) {
      console.error('Erro ao buscar propagandas:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }
}
