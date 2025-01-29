// medicos.js antiga (com problemas no build)
import { useEffect} from 'react';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
//import React, { useState } from 'react';
//import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Medicos() {
  const { user } = useUser();
  const [medicos, setMedicos] = useState([]);
  //const [error, setError] = useState('');
  const [error] = useState('');
  // Declarar os campos de edição
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dtcad, setDtCad] = useState('');
  const [crm, setCrm] = useState('');
  const [uf_crm, setUfCRM] = useState('');
  const router = useRouter();
  const [editId, setEditId] = useState(null);
  //const [id_usuario, setId_Usuario] = useState('');

 
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

/*  if (!user) {
    return <p>Você precisa estar logado para acessar esta página.</p>;
  }*/

  //const linhausuario = user ? `Usuário: ${user.nome}` : 'Não logado';
  const id_usuario = user.id;
  
    // Função para formatar datas
    /*const formatDate = (dateString) => {
      if (!dateString) return 'Sem data';
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };*/
  
    // Função para formatar a data no formato YYYY-MM-DD para campos de input tipo date
    const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Função para buscar médicos
  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const res = await fetch('/api/getMedicos');
        if (!res.ok) throw new Error('Erro ao buscar médicos');
        const data = await res.json();
        setMedicos(data || []); // Defina como [] se data for null
      } catch (error) {
        console.error('Erro ao buscar médicos:', error);
        setMedicos([]);
      }
    };

    fetchMedicos();
  }, []);

/*
  const fetchMedicos = async () => {
    try {
      const response = await fetch('/api/getMedicos');
      if (!response.ok) {
        throw new Error('Erro ao buscar dados dos médicos.');
      }
      const data = await response.json();
      setMedicos(data || []); // Defina como [] se data for null
    } catch (error) {
      console.error('Erro ao buscar médicos:', error);
      setError('Não foi possível carregar a lista de médicos.');
      setMedicos([]);
    }
  };

 */

  // Submeter (Cadastrar ou Alterar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editId ? `/api/updateMedicos/${editId}` : '/api/medicos';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, especialidade, telefone,dtcad, id_usuario, crm,uf_crm}),
    });

    if (res.ok) {
      alert(editId ? 'Médico atualizado!' : 'Médico cadastrado!');
      setNome('');
      setEspecialidade('');
      setTelefone('');
      setDtCad('');
      //setId_Usuario('');
      setCrm('');
      setUfCRM('');
      setEditId(null);
      fetchMedicos();
    
    }
  };

   // Editar Paciente
   const handleEdit = (id) => {
    const medico = medicos.find((medico) => medico.id === id); // Encontra o médico na lista
    if (medico) {
      setEditId(medico.id); // Define o ID para edição
      setNome(medico.nome || '');
      setEspecialidade(medico.especialidade || '');
      setTelefone(medico.telefone || '');
      setDtCad(formatDateForInput(medico.dtcad) || ''); // Formata a data para o input de tipo date
      setCrm(medico.crm || '');
      setUfCRM(medico.uf_crm || '');
    } else {
      console.error(`Médico com ID ${id} não encontrado.`);
    }
  };
  

  // Excluir Paciente
  const handleDelete = async (id) => {
    if (confirm('Deseja realmente excluir o Médico?')) {
      const res = await fetch(`/api/deleteMedicos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Médico excluído!');
        fetchMedicos();
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setNome('');
    setEspecialidade('');
    setTelefone('');
    setDtCad('');
    setCrm('');
    setUfCRM('');
  };
  
  /*useEffect(() => {
    if (userIsAdmin) {
      fetchDataForAdmins();
    }
  }, [userIsAdmin]); // Certifique-se de incluir 'userIsAdmin' nas dependências 
 
 useEffect(() => {
  fetchMedicos();
}, []); // Sem dependências adicionais
*/
 fetchMedicos();
  return (
    <div>
      <Layout>
      <h1>Cadastro de Médicos</h1>
    
    {/*}  {user ? <p>Usuário logado: {user.nome}</p> : <p>Não logado.</p>}*/}
      {error && <p style={{ color: 'red' }}>{error}</p>}

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
                    Cadastrar
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



      {/* Tabela de médicos */}

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
                  <button onClick={() => handleEdit(medico.id)}
                      style={{
                        marginRight: '5px',
                        padding: '5px',
                        border: 'none',
                        backgroundColor: '#ffc107',
                        color: '#fff',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}>Editar</button>
                  <button onClick={() => handleDelete(medico.id)}
                      style={{
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
    </div>
  );
}
