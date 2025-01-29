import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'marcofriorefrigeracao.com.br', // Host do banco de dados
    user: 'marcofri_user',      // Usuário do banco de dados
    password: 'SenhaNova123@', // Senha do banco de dados
    database: 'marcofri_citymedical', // Nome do banco de dados
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Função para obter a conexão com o banco de dados
export const connectToDatabase = async () => {
    return pool;
};
