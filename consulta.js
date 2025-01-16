import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import Layout from '../components/Layout';

export default function Medicos() {
  const { user } = useUser();
  const router = useRouter();

  // Estados para médicos e formulário
  const [medicos, setMedicos] = useState([]);
  const [error, setError] = useState('');
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dtcad, setDtCad] = useState('');
  const [crm, setCrm] = useState('');
  const [uf_crm, setUfCRM] = useState('');
  const [editId, setEditId] = useState(null);

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ];

  // Proteção de acesso à página
  useEffect(() => {
    if (!user) {
      router.push('/login'); // Redireciona para o login se não autenticado
    }
  }, [user, router]);

  // Função para buscar médicos
  const fetchMedicos = async () => {
    try {
      const res = await fetch('/api/getMedicos');
      if (!res.ok) throw new Error('Erro ao buscar médicos');
      const data = await res.json();
      setMedicos(data || []);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar os médicos.');
    }
  };

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

  // Buscar médicos ao carregar a página
  useEffect(() => {
    fetchMedicos();
  }, []);

  // Submeter formulário (Cadastrar ou Atualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editId ? `/api/updateMedicos/${editId}` : '/api/medicos';
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, especialidade, telefone, dtcad, crm, uf_crm, id_usuario: user.id }),
      });

      if (res.ok) {
        alert(editId ? 'Médico atualizado!' : 'Médico cadastrado!');
        resetForm();
        fetchMedicos();
      } else {
        throw new Error('Erro ao salvar os dados.');
      }
    } catch (err) {
      console.error(err);
      alert('Não foi possível salvar os dados.');
    }
  };

  // Editar médico
  const handleEdit = (id) => {
    const medico = medicos.find((m) => m.id === id);
    if (medico) {
      setEditId(medico.id);
      setNome(medico.nome || '');
      setEspecialidade(medico.especialidade || '');
      setTelefone(medico.telefone || '');
      setDtCad(formatDateForInput(medico.dtcad) || '');
      setCrm(medico.crm || '');
      setUfCRM(medico.uf_crm || '');
    }
  };

  // Excluir médico
  const handleDelete = async (id) => {
    if (confirm('Deseja realmente excluir o médico?')) {
      try {
        const res = await fetch(`/api/deleteMedicos/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Médico excluído!');
          fetchMedicos();
        } else {
          throw new Error('Erro ao excluir o médico.');
        }
      } catch (err) {
        console.error(err);
        alert('Não foi possível excluir o médico.');
      }
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setEditId(null);
    setNome('');
    setEspecialidade('');
    setTelefone('');
    setDtCad('');
    setCrm('');
    setUfCRM('');
  };

  // Formatar data para o campo de input tipo date
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Proteção de carregamento
  if (!user) {
    return null;
  }

  return (
    <Layout>
      <h1>Ficha Médica</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
            

            {/* Busca do paciente */}
            <div style={{ marginBottom: '20px',  padding: '20px', fontFamily: 'Arial, sans-serif' }}>
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

     <form onSubmit={handleSubmit}>
        
          <div style={{ marginBottom: '10px' }}>
                       
          </div>
          <div className="input-container">
            <input
              
              type="text"
              placeholder="Nome do Médico"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              
            />
        <input
          type="text"
          placeholder="Especialidade"
          value={especialidade}
          onChange={(e) => setEspecialidade(e.target.value)}
          required
		  />
		
		</div>
        <div className="input-container">
            <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
            <input type="date" placeholder="Data de Cadastro" value={dtcad} onChange={(e) => setDtCad(e.target.value)} />
        </div>
		<div className="input-container">
            <input type="text" placeholder="CRM" value={crm} onChange={(e) => setCrm(e.target.value)} />
     
        <div className="select-container">
        <select
          value={uf_crm}
          onChange={(e) => setUfCRM(e.target.value)}
          required
        >
         <option value="">Selecione UF...</option>
          {estados.map((sigla) => (
            <option key={sigla} value={sigla}>
              {sigla}
            </option>
         ))}
       </select>
	   {/*  <button type="submit">{editId ? 'Atualizar' : 'Cadastrar'}</button>      */}
		</div>  
        
        
        
      
        </div>  
       
       
         
        {/*<input placeholder="ID do Usuario" onChange={(e) => setIdUsuario(e.target.value)} />*/}

        <div className="button-container">
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}></div>  
                  <button
                    type="submit"
                    className="button button-submit"
                    onClick={() => console.log('Botão Enviar clicado')}
                  >
                   {editId ? 'Atualizar' : 'Cadastrar'}
                  </button>

                      {/* Botão Cancelar */}
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}></div>
                        <button onClick={() => resetForm()} 
                              style={{
                              padding: '10px 20px',
                              
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                          }}
                          className="button button-cancelar"
                        >
                        Cancelar
                        </button>

                        {/* Botão Voltar */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}></div>
                        <button onClick={() => router.push('/menu')} 
                              style={{
                              padding: '10px 20px',
                            
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                          }}
                          className="button button-back"
                        >
                        Voltar ao Menu
                        </button>
                      </div>   
                
         
      </form>

      {medicos.length > 0 ? (
         <table border="1" style={{ width: '100%', marginTop: '20px'}}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Especialidade</th>
              <th>Telefone</th>
              <th>CRM</th>
              <th>UF CRM</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {medicos.map((medico) => (
              <tr key={medico.id}>
                <td>{medico.id}</td>
                <td>{medico.nome}</td>
                <td>{medico.especialidade}</td>
                <td>{medico.telefone}</td>
                <td>{medico.crm}</td>
                <td>{medico.uf_crm}</td>
                <td>
                  <button onClick={() => handleEdit(medico.id)}style={{
                        marginRight: '5px',
                        padding: '5px',
                        border: 'none',
                        backgroundColor: '#ffc107',
                        color: '#fff',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}>Editar</button>
                  <button onClick={() => handleDelete(medico.id)}style={{
                        padding: '5px',
                        border: 'none',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum médico cadastrado.</p>
      )}
    </Layout>
  
  );
}
