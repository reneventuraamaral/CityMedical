//import Layout from '@components/Layout';
import axios from 'axios';
import { useState } from 'react';
import Layout from '../../components/Layout';

export default function CadastroMedicamentos() {
    const [paciente, setPaciente] = useState(null);
    const [id, setId] = useState('');
    const [desc, setDesc] = useState('');
    

    const buscarPaciente = async (valorBusca, tipoBusca) => {
        try {
            
            const endpoint =
                tipoBusca === 'id'
                    ? `/api/getPaciente?id=${valorBusca}`
                    : `/api/getPaciente?nome=${encodeURIComponent(valorBusca)}`;
    
            console.log('Chamando endpoint:', endpoint); // Log do endpoint
    
            //const response = await axios.get(endpoint);
            const query = search ? `?search=${encodeURIComponent(search)}` : '';
            const response = await axios.get(`/api/medicamentos${query}`);

    
            console.log('Resposta da API:', response.data); // Log da resposta
    
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar paciente:', error.response?.data || error.message);
            throw error;
        }
    };
    
    





    const cadastrarMedicamento = async () => {
        if (!paciente) {
            alert('Por favor, busque um paciente antes de cadastrar.');
            return;
        }

        try {
            const response = await axios.post('/api/addMedicamento', {
                id_paciente: paciente.id,
                id_medico: paciente.id_medico,
                id_tratamento: paciente.id_tratamento,
                desc,
            });
            alert('Medicamento cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao cadastrar medicamento:', error);
            alert('Erro ao cadastrar medicamento.');
        }
    };

    return (
        <Layout>
        <div style={{ padding: '20px' }}>
            <h2>Cadastro de Medicamentos (novo)</h2>
            <div style={{ marginBottom: '20px' }}>
                <label>ID ou Nome do Paciente:</label>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Digite o ID ou nome do paciente"
                />
                <button onClick={buscarPaciente}>Buscar Paciente</button>
            </div>

            {paciente && (
                <div>
                    <p><strong>Nome:</strong> {paciente.nome_paciente}</p>
                    <p><strong>ID Médico:</strong> {paciente.id_medico}</p>
                    <p><strong>ID Tratamento:</strong> {paciente.id_tratamento}</p>
                </div>
            )}

            <div style={{ marginBottom: '20px' }}>
                <label>Descrição dos Medicamentos:</label>
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Descreva os medicamentos"
                />
            </div>

            <button onClick={cadastrarMedicamento}>Cadastrar Medicamento</button>
        </div>
        </Layout>
    );
}
