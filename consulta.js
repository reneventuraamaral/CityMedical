import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';
import jsPDF from 'jspdf';

export default function Consultas() {
  // Hooks devem estar dentro do componente
  const [obs, setObs] = useState('');
  const [dtconsulta, setDtconsulta] = useState('');
  const [activeTab, setActiveTab] = useState('consulta'); // Aba ativa
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const { user } = useUser(); // Obter o usuário logado
  const router = useRouter();

  const [gerarReceita, setGerarReceita] = useState(false);
  const [gerarExame, setGerarExame] = useState(false);
  const [receitaTexto, setReceitaTexto] = useState(''); // Caso queira preencher a receita
  const [exameTexto, setExameTexto] = useState(''); // Caso queira preencher o exame

  useEffect(() => {
    if (!user) {
      alert('Você precisa estar logado para acessar esta página.');
      router.push('/login');
    }
    // Nova função
    const fetchPacientes = async () => {
      try {
        const res = await fetch('/api/getpacientes');
        if (res.ok) {
          const data = await res.json();
          console.log('Dados dos pacientes:', data); // Verifique a estrutura no console
          setPacientes(data || []); // Garante que seja um array
        } else {
          console.error('Erro ao buscar pacientes:', res.statusText);
          setPacientes([]); // Reseta pacientes em caso de erro
        }
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        setPacientes([]); // Reseta pacientes em caso de erro
      }
    };
  
    // Chama a função fetchPacientes ao montar o componente
    fetchPacientes();

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
  }, [user, router, selectedPaciente]);



  if (!user) {
    return <p>Carregando...</p>; // Evita renderizar a página antes de redirecionar
  }

  console.log('Usuario:', user);
  console.log('Tipo do Usuário:', user.tipousuario);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (user.tipousuario !== 'M') {
      alert('Apenas médicos podem gravar consultas.');
      return;
    }
    try {
      const response = await fetch('/api/cadConsultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_paciente: selectedPaciente,
          id_medico: user.tipousuario === 'M' ? user.id : null,
          id_usuario: user.id,
          obs,
          dtconsulta,
          gerarReceita,
          receitaTexto,
          gerarExame,
          exameTexto,
        }),
      });

      if (response.ok) {
        alert('Consulta salva com sucesso!');
        setSelectedPaciente('');
        setObs('');
        setDtconsulta('');
        setGerarReceita(false);
        setReceitaTexto('');
        setGerarExame(false);
        setExameTexto('');
      } else {
        throw new Error('Erro ao salvar a consulta.');
      }
    } catch (error) {
      console.error('Erro ao salvar a consulta:', error);
    }

  }

function gerarReceitas() {
  const doc = new jsPDF();
  doc.text('Receita Médica', 10, 10);
  doc.text('Paciente: João da Silva', 10, 20);
  doc.text('Data: 10/01/2025', 10, 30);
  doc.text('Medicamentos:', 10, 40);
  doc.text('1. Paracetamol 500mg - 2x ao dia', 10, 50);
  doc.save('receita.pdf');
}

 
  console.log('Usuario:', user);
  console.log('Tipo do Usuário:', user.tipousuario);

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
          <button
            onClick={() => setActiveTab('exames')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderBottom: activeTab === 'receitas' ? '3px solid #007bff' : 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            Exames
          </button>
        </div>
        {/* Conteúdo das Abas */}
        <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '20px' }}>
          {activeTab === 'consulta' && (
            <form onSubmit={handleSubmit}>
          
          <div className="form-row">
           <div className="form-group">
             <label className="form-label">Selecione o Paciente:</label>
          
             <select
                value={selectedPaciente}
                onChange={(e) => setSelectedPaciente(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                
                {Array.isArray(pacientes) && pacientes.length > 0 ? (
                  pacientes.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nome}
                    </option>
                  ))
                ) : (
                  <option disabled>Nenhum paciente disponível</option>
                )}
              </select>

          
          <div>
          <div className="form-group">
          <label className="form-label">Data da Consulta:</label>
            <input
            type="date"
            value={dtconsulta}
            onChange={(e) => setDtconsulta(e.target.value)}
            required
          />
         </div>
         </div>
          </div>
          </div>
         <div>
         
           <div className="form-group">
             <label className="form-label">Observações Médicas:</label>
          
          <textarea
            value={obs}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            onChange={(e) => setObs(e.target.value)}
            required
          ></textarea>
         </div>
         </div>
         {/* Inclusão dos checkboxes */}
         <div>
            <input
              type="checkbox"
              id="gerarReceita"
              onChange={(e) => setGerarReceita(e.target.checked)}
            />
            <label htmlFor="gerarReceita">Gerar Receita</label>
                {gerarReceita && (
                  <textarea
                    placeholder="Digite a receita"
                    value={receitaTexto}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    onChange={(e) => setReceitaTexto(e.target.value)}
                    required
                  ></textarea>
                )}
              </div>
              <div>
                <input
                  type="checkbox"
                  id="gerarExame"
                  onChange={(e) => setGerarExame(e.target.checked)}
                />
               <label htmlFor="gerarExame">Gerar Exame</label>
                {gerarExame && (
                  <textarea
                    placeholder="Digite o exame"
                    value={exameTexto}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    onChange={(e) => setExameTexto(e.target.value)}
                    required
                  ></textarea>
                )}
              </div>
              
         <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff' }}>
                Salvar Consulta
              </button>
             
            <button
              onClick={() => router.push('/menu')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex'
              }}
            >
              Voltar ao Menu
            </button>
           
        </div>
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
                 onClick={gerarReceitas}
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
