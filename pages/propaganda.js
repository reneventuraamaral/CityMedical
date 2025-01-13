import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
//import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Propagandas() {
  const { user } = useUser();
  const [propagandas, setPropagandas] = useState([]);
  const [error, setError] = useState('');
  // Declarar os campos de edição
  const [nome, setNome] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [dtcad, setDtCad] = useState('');
  const router = useRouter();
  const [editId, setEditId] = useState(null);
  //const [id_usuario, setId_Usuario] = useState('');

 
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  if (!user) {
    return <p>Você precisa estar logado para acessar esta página.</p>;
  }

  const linhausuario = user ? `Usuário: ${user.nome}` : 'Não logado';
  const id_usuario = user.id;
  
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

  // Função para buscar propagandas
  const fetchPropagandas = async () => {
    try {
      const response = await fetch('/api/getPropagandas');
      if (!response.ok) {
        throw new Error('Erro ao buscar dados das propagandas.');
      }
      const data = await response.json();
      setPropagandas(data);
    } catch (error) {
      console.error('Erro ao buscar propagandas:', error);
      setError('Não foi possível carregar a lista de propagandas.');
    }
  };

 

  // Submeter (Cadastrar ou Alterar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editId ? `/api/updatePropagandas/${editId}` : '/api/cadPropagandas';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ veiculo, nome, dtcad, id_usuario}),
    });

    if (res.ok) {
      alert(editId ? 'Médico atualizado!' : 'Médico cadastrado!');
      setNome('');
      setVeiculo('');
      setDtCad('');
      setEditId(null);
      fetchPropagandas();
    
    }
  };

   // Editar Propaganda
   const handleEdit = (id) => {
    const propaganda = propagandas.find((propaganda) => propaganda.id === id); // Encontra o médico na lista
    if (propaganda) {
      setEditId(propaganda.id); // Define o ID para edição
      setVeiculo(propaganda.veiculo || '');
      setNome(propaganda.nome || '');
      setDtCad(formatDateForInput(propaganda.dtcad) || ''); // Formata a data para o input de tipo date
      } else {
      console.error(`Propaganda com ID ${id} não encontrada.`);
    }
  };
  

  // Excluir Propaganda
  const handleDelete = async (id) => {
    if (confirm('Deseja realmente excluir a Propaganda?')) {
      const res = await fetch(`/api/deletePropagandas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Propaganda excluída!');
        fetchPropagandas();
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setNome('');
    setVeiculo('');
    setDtCad('');
  
  };
  

  useEffect(() => {
    fetchPropagandas();
  }, []);

  return (
    <div>
      <Layout>
      <h1>Cadastro de Propagandas</h1>
      {user ? <p>Usuário logado: {user.nome}</p> : <p>Não logado.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
                       
          </div>
          <div className="input-container">
            <input
              
              type="text"
              placeholder="Meio de Comunicação"
              value={veiculo}
              onChange={(e) => setVeiculo(e.target.value)}
              required
              
            />
            
            <input
              type="text"
              placeholder="Nome do Veículo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
  
        </div>

        <div className="input-container">
             <input type="date" placeholder="Data de Cadastro" value={dtcad} onChange={(e) => setDtCad(e.target.value)} />
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



      {/* Tabela de propagandas */}
      {propagandas.length > 0 ? (
        <table border="1" style={{ width: '100%', marginTop: '20px'}}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Veículo</th>
              <th>Nome</th>
              <th>Data de Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {propagandas.map((propaganda) => (
              <tr key={propaganda.id}>
                <td>{propaganda.id}</td>
                <td>{propaganda.veiculo}</td>
                <td>{propaganda.nome}</td>
                <td>{formatDate(propaganda.dtcad)}</td>
                <td>
                  <button onClick={() => handleEdit(propaganda.id)}
                      style={{
                        marginRight: '5px',
                        padding: '5px',
                        border: 'none',
                        backgroundColor: '#ffc107',
                        color: '#fff',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        
                      }}>Editar</button>
                  <button onClick={() => handleDelete(propaganda.id)}
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
        <p>Nenhuma propaganda cadastrado.</p>
      )}
      </Layout>
    </div>
  );
}
