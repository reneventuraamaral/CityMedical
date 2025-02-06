import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';
import jsPDF from 'jspdf';

export default function Consultas() {
  const [obs, setObs] = useState('');
  const [dtconsulta, setDtconsulta] = useState('');
  const [activeTab, setActiveTab] = useState('consulta'); 
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const { user } = useUser(); 
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const [gerarReceita, setGerarReceita] = useState(false);
  const [gerarExame, setGerarExame] = useState(false);
  const [receitaTexto, setReceitaTexto] = useState('');
  const [exameTexto, setExameTexto] = useState('');
  const [medicamento, setMedicamento] = useState('');
  const [obs_medicamento, setObsMedicamento] = useState('');

  const [dadosPaciente, setDadosPaciente] = useState(null);
  const [prescricoes, setPrescricoes] = useState([]);
  
  const [receitas, setReceitas] = useState([]);
  const [exames, setExames] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);

  useEffect(() => {
    if (!user) {
      alert('Você precisa estar logado para acessar esta página.');
      router.push('/login');
    }

    const fetchPacientes = async () => {
      try {
        const res = await fetch('/api/getPacientesCombo');
        const data = await res.json();
        setPacientes(data || []);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        setPacientes([]);
      }
    };

    fetchPacientes();
  }, [user, router]);



  const fetchDadosGeralConsulta = async (tipo, valor) => {
    console.log("🟢 Tipo de busca:", tipo, "| Valor:", valor);

    if (!valor) {
        console.warn("⚠️ Nenhum ID ou Nome foi fornecido!");
        setMensagemErro && setMensagemErro("Informe um ID ou Nome para buscar.");
        return;
    }

    try {
        console.log("🔄 Buscando paciente...");

        // Define os parâmetros da URL corretamente
        const param = tipo === "idPaciente" ? `id=${valor}` : `nome=${valor}`;

        const response = await fetch(`/api/getPacienteDados?${param}`);
        const data = await response.json();

        console.log("✅ Resposta da API:", data);

        if (response.status === 404 || !data.dadosPaciente || data.dadosPaciente.length === 0) {
            console.warn("⚠️ Paciente não encontrado.");
            setMensagemErro && setMensagemErro("Paciente não encontrado.");
            return;
        }

        setDadosPaciente(data.dadosPaciente);
        console.log("📋 Ficha Médica armazenadas no estado:", data.dadosPaciente);
        setPrescricoes(data.prescricoes);
        console.log("📋 Prescrições armazenadas no estado:", data.prescricoes);
        setReceitas(data.receitas);
        setExames(data.exames);
        setMedicamentos(data.medicamentos);

    } catch (error) {
        console.error("❌ Erro ao buscar dados do paciente:", error);
        setMensagemErro && setMensagemErro("Erro ao buscar dados do paciente.");
    }
};



  /* const fetchDadosGeralConsulta = async (tipo, valor) => {
    if (!valor) {
      alert('Digite um ID ou Nome para buscar.');
      return;
    }

    try {
      const res = await fetch(`/api/getPacienteDados?${tipo}=${valor}`);
      const data = await res.json();
      setDadosPaciente(data.dadosPaciente[0] || null);
      setPrescricoes(data.prescricoes || []);
      setReceitas(data.receitas || []);
      setExames(data.exames || []);
      setMedicamentos(data.medicamentos || []);
    } catch (error) {
      console.error('Erro ao buscar dados do paciente:', error);
      alert('Erro ao buscar os dados. Tente novamente.');
    }
  }; */

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
          medicamento,
          obs_medicamento,
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
        setMedicamento('');
        setObsMedicamento('');
      } else {
        throw new Error('Erro ao salvar a consulta.');
      }
    } catch (error) {
      console.error('Erro ao salvar a consulta:', error);
    }
  };

  const gerarPDF = (titulo, conteudo) => {
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(14);
    doc.text(titulo, 10, 10);
    doc.setFontSize(12);
    doc.text(conteudo, 10, 20, { maxWidth: 180 });
    doc.save(`${titulo}.pdf`);
  };

  const estilos = {
    th: {
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    td: {
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    linhaPar: {
      backgroundColor: '#f2f2f2',
    },
    linhaImpar: {
      backgroundColor: '#fff',
    },
  };

  const styles = {
   /*  tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '20px',
    }, */
    activeTab: {
      backgroundColor: '#007bff',
      color: '#fff',
      fontWeight: 'bold',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    inactiveTab: {
      backgroundColor: '#6c757d',
      color: '#fff',
      fontWeight: 'normal',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    tabContent: {
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
    },
    label: {
      fontWeight: 'bold',
      color: '#333',
    },
    input: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      backgroundColor: '#f8f9fa',
    },
    select: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      backgroundColor: '#f8f9fa',
    },
    textarea: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      backgroundColor: '#f8f9fa',
      resize: 'none',
    },
    checkboxGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
    },
    submitButton: {
      padding: '10px 15px',
      backgroundColor: '#007bff',
      color: '#fff',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
    },
    cancelButton: {
      padding: '10px 15px',
      backgroundColor: '#6c757d',
      color: '#fff',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
    },
    pdfButton: {
      padding: '5px 10px',
      backgroundColor: '#17a2b8',
      color: '#fff',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '15px',
    },
    fichaContainer: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '10px',
      border: '1px solid #ddd',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      marginTop: '15px',
    },
    fichaContent: {
      marginTop: '20px',
      padding: '15px',
      borderRadius: '10px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '15px',
    },
    th: {
      backgroundColor: '#007bff',
      color: '#fff',
      padding: '10px',
      textAlign: 'left',
    },
    td: {
      padding: '10px',
      border: '1px solid #ddd',
    },
    fichaContainer: {
      padding: '20px',
      background: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    input: {
      padding: '10px',
      marginBottom: '10px',
      width: '100%',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
      background: 'white',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    th: {
      background: '#007bff',
      color: 'white',
      padding: '10px',
      textAlign: 'left',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
    },
    tr: {
      background: '#f2f2f2',
    },
  };
  

  // Função para formatar datas (YYYY-MM-DD para DD/MM/YYYY)
const formatarData = (data) => {
  if (!data) return "-";
  return new Intl.DateTimeFormat('pt-BR').format(new Date(data));
};

  

  return (
    <Layout>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Consultas</h1>

       {/*  style={{ padding: '5px 10px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '5px', marginTop: '5px' }} */}

        {/* Navegação entre as abas */}
  {/* Navegação entre as abas */}
<div style={styles.tabContainer}>
  {[
    { id: 'consulta', label: 'Consulta' },
    { id: 'fichamedica', label: 'Ficha Médica' },
    { id: 'prescricoes', label: 'Prescrições' },
    { id: 'medicamentos', label: 'Medicamentos' },
    { id: 'receitas', label: 'Receitas' },
    { id: 'exames', label: 'Exames' },
  ].map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      style={activeTab === tab.id ? styles.activeTab : styles.inactiveTab}
    >
      {tab.label}
    </button>
  ))}
</div>


        {/* Conteúdo das Abas */}
       {/*  <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '20px' }}> */}
       <div style={styles.tabContent}>
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

         <div className="form-group">
             <label className="form-label">Medicamentos:</label>
          
          <textarea
            value={medicamento}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            onChange={(e) => setMedicamento(e.target.value)}
            required
          ></textarea>
         </div>

         <div className="form-group">
             <label className="form-label">Observações na entrega dos Medicamentos:</label>
          
          <textarea
            value={obs_medicamento}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            onChange={(e) => setObsMedicamento(e.target.value)}
            required
          ></textarea>
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
                  <div>
                  <textarea
                    placeholder="Digite a receita"
                    value={receitaTexto}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    onChange={(e) => setReceitaTexto(e.target.value)}
                    required
                  ></textarea>
                   <button 
            type="button"
            onClick={() => gerarPDF('Receita Médica', receitaTexto)}
            style={{ padding: '5px 10px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '5px', marginTop: '5px' }}
          >
            Gerar PDF
          </button>
        </div>
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
                  <div>
                  <textarea
                    placeholder="Digite o exame"
                    value={exameTexto}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    onChange={(e) => setExameTexto(e.target.value)}
                    required
                  ></textarea>
                   <button 
            type="button"
            onClick={() => gerarPDF('Pedido de Exame', exameTexto)}
            style={{ padding: '5px 10px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '5px', marginTop: '5px' }}
          >
            Gerar PDF
          </button>
        </div>
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
{activeTab === 'fichamedica' && (
  <div style={styles.fichaContainer}>
    <h3>Pesquisar Paciente:</h3>
    <input
      type="text"
      placeholder="Digite o ID ou Nome"
      onChange={(e) => setSearchValue(e.target.value)}
      style={styles.input}
    />
    <div style={styles.buttonContainer}>
      <button onClick={() => fetchDadosGeralConsulta('idPaciente', searchValue)}>Buscar por ID</button>
      <button onClick={() => fetchDadosGeralConsulta('nome', searchValue)}>Buscar por Nome</button>
    </div>

    <h2>Dados do Paciente</h2>

    {/* Exibição dos dados do paciente em uma tabela */}
    {Array.isArray(dadosPaciente) && dadosPaciente.length > 0 ? (
      <table style={styles.table}>
        <thead>
          <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
            <th>ID</th>
            <th>Nome</th>
            <th>Data de Nascimento</th>
            <th>Telefone</th>
            <th>CPF</th>
          </tr>
        </thead>
        <tbody>
          {dadosPaciente.map((item) => (
            <tr key={item.id} >
              <td style={estilos.td}>{item.id}</td>
              <td style={estilos.td}>{item.nome}</td>
              <td style={estilos.td}>{formatarData(item.data_nascimento) || '-'}</td>
              <td style={estilos.td}>{item.telefone || '-'}</td>
              <td style={estilos.td}>{item.cpf || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>Nenhuma ficha médica encontrada.</p>
    )}
  </div>
)}


          {activeTab === 'prescricoes' && (
          <div>
             <h2>Prescrições</h2>
             {prescricoes.length > 0 ? (
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
               <thead>
                 <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
                   <th style={estilos.th}>Data da Consulta</th>
                   <th style={estilos.th}>Descrição</th>
                   
                 </tr>
               </thead>
               <tbody>
                 {prescricoes.map((prescricao, index) => (
                   <tr key={index} style={index % 2 === 0 ? estilos.linhaPar : estilos.linhaImpar}>
                     <td style={estilos.td}>{formatarData(prescricao.dtconsulta) || '-'}</td>
                     <td style={estilos.td}>{prescricao.obs || '-'}</td>
                    
                  </tr>
                                     
                 ))}
                </tbody>
                </table>
             ) : (
               <p>Nenhuma prescrição encontrada.</p>
             )}
           </div>
          )}
        </div>

        {activeTab === 'medicamentos' && (
  <div>
    <h2>Medicamentos</h2>
    {medicamentos.length > 0 ? (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
            <th style={estilos.th}>Descrição</th>
            <th style={estilos.th}>Data do Pedido</th>
            <th style={estilos.th}>Data da Manipulação</th>
            <th style={estilos.th}>Data da Chegada</th>
            <th style={estilos.th}>Data da Entrega</th>
            <th style={estilos.th}>Observação</th>
          </tr>
        </thead>
        <tbody>
          {medicamentos.map((medicamento, index) => (
            <tr key={index} style={index % 2 === 0 ? estilos.linhaPar : estilos.linhaImpar}>
              <td style={estilos.td}>{medicamento.descricao}</td>
              <td style={estilos.td}>{formatarData(medicamento.dt_pedido) || '-'}</td>
              <td style={estilos.td}>{formatarData(medicamento.dt_manipulacao) || '-'}</td>
              <td style={estilos.td}>{formatarData(medicamento.dt_chegada) || '-'}</td>
              <td style={estilos.td}>{formatarData(medicamento.dt_entrega) || '-'}</td>
              <td style={estilos.td}>{medicamento.observacao || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>Nenhum medicamento encontrado.</p>
    )}
  </div>
)}


        
   
        {activeTab === 'receitas' && (
  <div>
    <h2>Receitas</h2>
    {receitas.length > 0 ? (
       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
     
        <thead>
        <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
            <th style={estilos.th}>Data</th>
            <th style={estilos.th}>Receita</th>
            <th style={estilos.th}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {receitas.map((receita, index) => (
            <tr key={index}>
              <td>{formatarData(receita.dtconsulta)}</td>
              <td>{receita.receita}</td>
              <td>
                <button 
                  onClick={() => gerarPDF('Receita Médica', receita.receita)}
                  style={{ padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}
                >
                  Gerar PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>Nenhuma receita encontrada.</p>
    )}
  </div>
)}

{activeTab === 'exames' && (
  <div>
    <h2>Exames</h2>
    {exames.length > 0 ? (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
     
      <thead>
      <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
            <th>Data</th>
            <th>Exame</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {exames.map((exame, index) => (
            <tr key={index}>
              <td>{formatarData(exame.dtconsulta)}</td>
              <td>{exame.nome_exame}</td>
              <td>
                <button 
                  onClick={() => gerarPDF('Pedido de Exame', exame.nome_exame)}
                  style={{ padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px' }}
                >
                  Gerar PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>Nenhum exame encontrado.</p>
    )}
  </div>
)}

</div>
    </Layout>
  );
}
