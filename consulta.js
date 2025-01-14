import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function AtualizarMedicamentos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [dates, setDates] = useState({
    dt_manipulacao: '',
    dt_chegada: '',
    dt_entrega: '',
    listamed: '',
    stpago: '',
    nomemedico: '',

  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Função para formatar datas
  const formatDate = (dateString) => {
    if (!dateString) return 'Sem data';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
// Função para formatar a data no formato YYYY-MM-DD para campos de input tipo date
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  // Função para buscar medicamentos
  const searchMedications = async () => {
    try {
      setError('');
      console.log('Iniciando a busca de medicamentos...');
  
      const paramKey = isNaN(searchTerm) ? 'search' : 'id'; // Define o parâmetro correto
      const response = await axios.get(`/api/medicamentos?${paramKey}=${searchTerm}`);
  
      console.log('Resposta da API:', response.data);
      setMedications(response.data); // Atualiza a lista de medicamentos
      console.log('Lista de medicamentos atualizada:', response.data);
    } catch (error) {
      console.error(
        'Erro ao buscar medicamentos:',
        error.response?.data?.message || error.message
      );
      setError(error.response?.data?.message || 'Erro ao buscar medicamentos.');
    }
  };
  

  // Função chamada ao clicar em um medicamento
  const selectMedication = async (medication) => {
    if (!medication || !medication.id_medicamento) {
      console.error('Medicamento inválido selecionado:', medication);
      setError('Erro ao selecionar medicamento.');
      return;
    }
  
    try {
      console.log('ID do medicamento enviado para a API:', medication.id_medicamento);
      const response = await axios.get(`/api/getMedicamentoById?id=${medication.id_medicamento}`);
  
      if (response.data) {
        const updatedMedication = response.data;
  
        console.log('Medicamento atualizado selecionado:', updatedMedication);
        setSelectedMedication(updatedMedication);
        setDates({
          dt_manipulacao: updatedMedication.dt_manipulacao || '',
          dt_chegada:     updatedMedication.dt_chegada || '',
          dt_entrega:     updatedMedication.dt_entrega || '',
          listamed:       updatedMedication.descricao || '',
          stpago:         updatedMedication.pago || '',
          nometrat:       updatedMedication.nome_tratamento || '',
          nomemedico:     updatedMedication.nome_medico || '',
          isEntregaDisabled: updatedMedication.pago !== 'PG', // Desabilita se não estiver pago
        });
      } else {
        console.error('Nenhum dado retornado para o ID do medicamento:', medication.id_medicamento);
        setError('Nenhum dado encontrado para o medicamento selecionado.');
      }
    } catch (error) {
      console.error('Erro ao buscar medicamento atualizado:', error.message || error);
      setError('Erro ao buscar dados atualizados do medicamento.');
    }
  };
  
  
 
  // Função para atualizar medicamento
  const updateMedication = async () => {
    if (!selectedMedication) {
      setError('Selecione um medicamento para atualizar.');
      return;
    }

    try {
      setError('');
      setSuccessMessage('');
      console.log('Enviando dados para o backend:', dates);
      const response = await axios.put(`/api/medicamentos?id=${selectedMedication.id}`, dates);
      console.log('Resposta do servidor:', response.data);

      if (response.status === 200) {
        setSuccessMessage('Medicamento atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao atualizar medicamento:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Erro ao atualizar medicamento.');
    }
  };

  return (
    <Layout>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Atualizar/Entregar Medicamentos</h2>

      {/* Campo de pesquisa */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Pesquisar Paciente ou ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            marginRight: '10px',
            borderRadius: '5px',
          }}
        />
        <button
          onClick={searchMedications}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Pesquisar
        </button>
      </div>

      {/* Mensagens de Sucesso e Erro */}
      {successMessage && (
        <div style={{ color: 'green', marginBottom: '20px' }}>
          {successMessage}
        </div>
      )}
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Lista de medicamentos */}
      {medications.length > 0 && (
        <ul>
        {medications.map((medication) => {
          const isPaid = medication.pago === 'PG'; // Exemplo de lógica: comparar com 'Sim'
          const statusColor = isPaid ? 'green' : 'red'; // Define a cor com base no valor
          const alertMessage = isPaid
            ? 'Pagamento confirmado'
            : 'Comparecer ao Financeiro !!!!';
      
          return (
            <li
              key={medication.id_medicamento}
              onClick={() => selectMedication(medication)}
              style={{
                cursor: 'pointer',
                padding: '10px',
                border: '1px solid #ddd',
                marginBottom: '5px',
                borderRadius: '5px',
                backgroundColor: isPaid ? '#eaffea' : '#ffeaea', // Cor de fundo dinâmica
              }}
            >
              <strong>Paciente:</strong> {medication.nome_paciente} |{' '}
              <strong>Data Pedido:</strong> {formatDate(medication.dt_pedido) || 'Sem data'} |{' '}
              <strong style={{ color: statusColor }}>Status:</strong> {alertMessage}
            </li>
          );
        })}
      </ul>
      
      )}

      {/* Campos de atualização */}
      {selectedMedication && (
        <div style={{ marginTop: '20px' }}>
          <h4>Atualizar Medicamento de: {selectedMedication.nome_paciente}</h4>
          <h4 style={{
                cursor: 'pointer',
                padding: '10px',
                border: '2px solid #191970',
                marginBottom: '5px',
                borderRadius: '5px',
              }}>Medicamento(s) : {selectedMedication.descricao}</h4>

          <p>
            <strong>Data do Pedido:</strong> {formatDate(selectedMedication.dt_pedido)}
          </p>
          <div style={{ marginBottom: '10px' }}>
            <label>Data de Manipulação</label>
            <input
              type="date"
              value={formatDateForInput(dates.dt_manipulacao)}
              onChange={(e) => setDates({ ...dates, dt_manipulacao: e.target.value })}
              style={{ marginLeft: '10px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Data de Chegada</label>
            <input
              type="date"
              value={formatDateForInput(dates.dt_chegada)}
              onChange={(e) => setDates({ ...dates, dt_chegada: e.target.value })}
              style={{ marginLeft: '10px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
          <label>Data de Entrega</label>
            <input
              type="date"
              value={dates.dt_entrega}
              onChange={(e) => setDates({ ...dates, dt_entrega: e.target.value })}
              disabled={dates.isEntregaDisabled} // Desabilita o campo se o pagamento não for confirmado
              style={{ marginLeft: '10px',
                backgroundColor: dates.isEntregaDisabled ? '#f8d7da' : '#ffffff', // Indica visualmente que está desabilitado
              }}
            />
            {/* Mensagem de alerta caso o campo esteja desabilitado */}
            {dates.isEntregaDisabled && (
              <div style={{ color: 'red', marginTop: '5px', fontSize: '0.9rem' }}>
                O pagamento está pendente. Não é possível registrar a entrega.
              </div>
            )}
          </div>
          <button
            onClick={updateMedication}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Salvar
          </button>

          {/* Botão Voltar */}
          <div style={{ marginTop: '20px'}}>
            <button
              onClick={() => router.push('/menu')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Voltar ao Menu
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
