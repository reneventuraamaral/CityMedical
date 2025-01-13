import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost', // Host do banco de dados
    user: 'root',      // Usuário do banco de dados
    password: '', // Senha do banco de dados
    database: 'citymedical', // Nome do banco de dados
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Função para obter a conexão com o banco de dados
export const connectToDatabase = async () => {
    return pool;
};
