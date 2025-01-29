import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function CadastroMedicamentos() {
    const [searchValue, setSearchValue] = useState('');
    const [paciente, setPaciente] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    // Função para buscar paciente
    const handleSearch = async () => {
        try {
            setError('');
            const response = await axios.get(`/api/medicamentos?search=${encodeURIComponent(searchValue)}`);
            setPaciente(response.data[0]); // Assume o primeiro resultado como válido
        } catch (error) {
            console.error('Erro ao buscar paciente:', error.response?.data?.message || error.message);
            setError(error.response?.data?.message || 'Erro ao buscar paciente.');
        }
    };

    // Função para cadastrar medicamento
    const handleCadastro = async () => {
        if (!paciente) {
            setError('É necessário buscar um paciente antes de cadastrar.');
            return;
        }

        try {
            setError('');
            setSuccessMessage('');
            //const dtPedido = new Date().toISOString().split('T')[0]; // Data no formato YYYY-MM-DD

          /*  const response = await axios.post('/api/medicamentos', {
                id_paciente: paciente.id_paciente, // Pego do resultado da pesquisa
                id_medico: paciente.id_medico,     // Pego do resultado da pesquisa
                id_tratamento: paciente.id_tratamento, // Pego do resultado da pesquisa
                dt_pedido: dtPedido,               // Data atual
                descricao,                         // Campo preenchido pelo usuário
            });*/

            setSuccessMessage('Medicamento cadastrado com sucesso!');
            setDescricao(''); // Limpa o campo de descrição
        } catch (error) {
            console.error('Erro ao cadastrar medicamento:', error.response?.data?.message || error.message);
            setError(error.response?.data?.message || 'Erro ao cadastrar medicamento.');
        }
    };

    return (
        <div>
        <Layout>
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Cadastro de Medicamentos</h1>

            {/* Busca do paciente */}
            <div style={{ marginBottom: '20px' }}>
                <label>Pesquisar por ID ou Nome do Paciente:</label>
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ marginLeft: '10px', padding: '5px' }}
                />
                <button onClick={handleSearch} style={{ marginLeft: '10px', padding: '5px 10px' }}>
                    Pesquisar
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

            {/* Dados do paciente */}
            {paciente && (
                <div style={{ marginBottom: '20px' }}>
                    <h3>Dados do Paciente</h3>
                    <p><strong>ID Paciente:</strong> {paciente.id_paciente}</p>
                    <p><strong>Nome:</strong> {paciente.nome_paciente}</p>
                    <p><strong>ID Médico:</strong> {paciente.id_medico}</p>
                    <p><strong>ID Tratamento:</strong> {paciente.id_tratamento}</p>
                </div>
            )}

            {/* Formulário de cadastro */}
            <div>
                <h3>Descrição do Medicamento</h3>
                <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Digite a descrição do medicamento"
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />
                <button onClick={handleCadastro} style={{ padding: '10px 20px' }}>
                    Cadastrar Medicamento
                </button>
            </div>

           {/* Botão Voltar */}
           <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
               <button onClick={() => router.push('/menu')} 
                     style={{
                     padding: '10px 20px',
                     backgroundColor: '#6c757d',
                     color: '#fff',
                     border: 'none',
                     borderRadius: '5px',
                     cursor: 'pointer',
                 }}
               >
               Voltar ao Menu
               </button>
           </div>
        </div>
        </Layout>
        </div> 
    );
}
