import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { usuario, senha } = req.body;

        if (!usuario || !senha) {
            return res.status(400).json({ message: 'Usuário ou senha não fornecidos.' });
        }

        try {
            const db = await connectToDatabase();
            const [rows] = await db.query(
                'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?',
                [usuario, senha]
            );

            console.log('Dados recebidos no login:', { usuario, senha });


            if (rows.length > 0) {
                res.status(200).json({ message: 'Login realizado com sucesso.', user: rows[0] });
                console.log('Dados retornados pelo banco:', rows[0]);

            } else {
                res.status(401).json({ message: 'Usuário ou senha inválidos.' });
            }
        } catch (error) {
            console.error('Erro ao processar login:', error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido.' });
    }
}
