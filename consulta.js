import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';
import jsPDF from 'jspdf';

export default function Consultas() {
  // Hooks devem estar dentro do componente
  const [obs, setObs] = useState('');
  const [dtconsulta, setDtconsulta] = useState('');
  const [id_medico, setIdmedico] = useState('');
  const [id_paciente, setIdpaciente] = useState('');
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState('consulta'); // Aba ativa
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const { user } = useUser(); // Obter o usuário logado
  const router = useRouter();

 

function gerarReceita() {
  const doc = new jsPDF();
  doc.text('Receita Médica', 10, 10);
  doc.text('Paciente: João da Silva', 10, 20);
  doc.text('Data: 10/01/2025', 10, 30);
  doc.text('Medicamentos:', 10, 40);
  doc.text('1. Paracetamol 500mg - 2x ao dia', 10, 50);
  doc.save('receita.pdf');
}


  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const res = await fetch('/api/getpacientes');
        const data = await res.json();
        setPacientes(data);
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
      }
    };
    fetchPacientes();

  }, []);

  useEffect(() => {
    if (selectedPaciente) {
      const fetchDadosPaciente = async () => {
        try {
          const res = await fetch(`/api/getPacienteDados?id=${selectedPaciente}`);
          const data = await res.json();
          console.log('Dados do Paciente:', data);
          // Atualize os estados ou exiba os dados nas abas
        } catch (error) {
          console.error('Erro ao buscar dados do paciente:', error);
        }
      };
      fetchDadosPaciente();
    }
  }, [selectedPaciente]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.tipousuario !== 'M') {
      alert('Apenas médicos podem gravar consultas.');
      return;
    }
    try {
      const response = await fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_paciente: selectedPaciente,
          id_medico: user.tipousuario === 'M' ? user.id : null,
          id_usuario: user.id,
          obs,
          dtconsulta,
        }),
      });

      if (response.ok) {
        alert('Consulta salva com sucesso!');
        setSelectedPaciente('');
        setObs('');
        setDtconsulta('');
      } else {
        throw new Error('Erro ao salvar a consulta.');
      }
    } catch (error) {
      console.error('Erro ao salvar a consulta:', error);
    }
  };

  return (
    <Layout>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Consultas</h1>

        {/* Navegação entre as abas */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('consulta')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === 'consulta' ? '3px solid #007bff' : 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            Consulta
          </button>
          <button
            onClick={() => setActiveTab('paciente')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === 'paciente' ? '3px solid #007bff' : 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            Dados do Paciente
          </button>
        
        <button
            onClick={() => setActiveTab('prescricoes')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === 'prescricoes' ? '3px solid #007bff' : 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            Prescrições Anteriores
          </button>
          <button
            onClick={() => setActiveTab('receitas')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === 'receitas' ? '3px solid #007bff' : 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            Receitas
          </button>
        </div>
        {/* Conteúdo das Abas */}
        <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '20px' }}>
          {activeTab === 'consulta' && (
            <form onSubmit={handleSubmit}>
          <div>
          <label>Selecione o Paciente</label>
          <select
            value={selectedPaciente}
            onChange={(e) => setSelectedPaciente(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {pacientes.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nome}
              </option>
            ))}
          </select>
          </div>
          <div>
          <label>Data da Consulta</label>
          <input
            type="date"
            value={dtconsulta}
            onChange={(e) => setDtconsulta(e.target.value)}
            required
          />
         </div>
         <div>
          <label>Observações</label>
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            required
          ></textarea>
         </div>
              <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>
                Salvar Consulta
              </button>
            </form>
          )}

          {activeTab === 'paciente' && (
            <div>
              <h2>Dados do Paciente</h2>
              <p>Nome: João da Silva</p>
              <p>CPF: 123.456.789-00</p>
            </div>
          )}
        </div>
        {activeTab === 'prescricoes' && (
            <div>
              <h2>Prescrições Anteriores</h2>
              <ul>
                <li>Data: 10/01/2025 - Observações: Prescrição de analgésicos</li>
                <li>Data: 15/12/2024 - Observações: Receita para controle de hipertensão</li>
              </ul>
            </div>
          )}
          {activeTab === 'receitas' && (
            <div>
              <h2>Receitas</h2>
              <button
                 onClick={gerarReceita}
                 style={{
                   padding: '10px',
                   backgroundColor: '#28a745',
                   color: '#fff',
                   border: 'none',
                   borderRadius: '5px',
                   cursor: 'pointer',
                 }}
               >
                 Gerar Receita
              </button>
            </div>
          )}
      </div>
    </Layout>
  );
}
