import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';


export default function CadPaciente() {
 
  const [pacientes, setPacientes] = useState([]);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');
  const { user } = useUser(); // Acessa o usuário do contexto
  const [idUsuario,setIdUsuario] = useState(null);
  const [dtnascimento, setDtnascimento] = useState('');
  const [id_unidade, setId_unidade] = useState('');
  const [editId, setEditId] = useState(null);
  const [idpropag, setIdpropag] = useState(''); // ID selecionado da combo
  const [propagandaOptions, setPropagandaOptions] = useState([]);
  const [unidadesOptions, setUnidadesOptions] = useState([]);
  const router = useRouter();

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Função para formatar datas
  const formatDate = (dateString) => {
    if (!dateString) return 'Sem data';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return ''; // Retorna vazio se não houver data
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês ajustado (0-11)
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  

  // Buscar as opções da tabela propaganda
  const fetchPropaganda = async () => {
    try {
      const res = await fetch('/api/getpropaganda');
      if (!res.ok) {
        throw new Error('Erro ao buscar propagandas');
      }
      const data = await res.json();
      console.log('Propagandas carregadas:', data); // Verifica os dados retornados
      setPropagandaOptions(data); // Atualiza o estado com os dados
    } catch (error) {
      console.error('Erro ao buscar propagandas:', error);
    }
  };

  useEffect(() => {
   
    fetchPropaganda();
  }, []);
  

// Buscar as opções da tabela Unidades
useEffect(() => {
  const fetchUnidades = async () => {
    try {
      const res = await fetch('/api/getUnidades');
      if (!res.ok) {
        throw new Error('Erro ao buscar Unidades');
      }
      const data = await res.json();
      setUnidadesOptions(data); // Atualiza com os dados
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
    }
  };

  fetchUnidades();
}, []);



  useEffect(() => {
    if (!user) {
      alert('Usuário não autenticado! Faça o login.');
      router.push('/login');
    } else {
      setIdUsuario(user.id); // Salva o ID do usuário no estado
      fetchPacientes(); // Só carrega pacientes se o usuário estiver autenticado
    }
    // Remova 'user' do array de dependências
  }, [setIdUsuario,user,router]); // Somente `router` é uma dependência válida aqui
  


  

  // Buscar pacientes no banco
  const fetchPacientes = async () => {
    const res = await fetch('/api/getpacientes');
    if (res.ok) {
      const data = await res.json();
      setPacientes(data);
    }
  };

  // Submeter (Cadastrar ou Alterar)
  //const idUsuario = localStorage.getItem('id_usuario'); // ou use contexto global

  useEffect(() => {
    const id = localStorage.getItem('id_usuario');
    if (id) {
      setIdUsuario(id); // Atualiza o estado local
    }
  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();
    const endpoint = editId ? `/api/updatepaciente/${editId}` : '/api/cadpaciente';
    const method = editId ? 'PUT' : 'POST';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, cpf, idpropag, telefone, logradouro, numero, complemento, bairro, cidade, uf, cep, dtnascimento, id_unidade, id_usuario: idUsuario}),
    });

    if (res.ok) {
      alert(editId ? 'Paciente atualizado!' : 'Paciente cadastrado!');
      setNome('');
      setCpf('');
      setIdpropag('');
      setTelefone('');
      setLogradouro('');
      setNumero('');
      setComplemento('');
      setBairro('');
      setCidade('');
      setUf('');
      setCep('');
      //setId_Usuario('');
      setDtnascimento('');
      setId_unidade('');
      setEditId(null);
      fetchPacientes();
      //fetchTipotratOptions();
    }
  };

  // Editar Paciente
  const handleEdit = (paciente) => {
    setEditId(paciente.id);
    setNome(paciente.nome);
    setCpf(paciente.cpf);
    setIdpropag(paciente.idpropag);
    setTelefone(paciente.telefone);
    setLogradouro(paciente.logradouro);
    setNumero(paciente.numero);
    setComplemento(paciente.complemento);
    setBairro(paciente.bairro);
    setCidade(paciente.cidade);
    setUf(paciente.uf);
    setCep(paciente.cep);
    setDtnascimento(formatDateForInput(paciente.dtnascimento)); // Converte a data para o formato compatível com o input
    //setDtnascimento(paciente.dtnascimento);
    setId_unidade(paciente.id_unidade);
   
  };

  // Excluir Paciente
  const handleDelete = async (id) => {
    if (confirm('Deseja realmente excluir o paciente?')) {
      const res = await fetch(`/api/deletepaciente/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Paciente excluído!');
        fetchPacientes();
      }
    }
  };

  return (
    <Layout>
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* Logo e título */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
      
        <h1 style={{ textAlign: 'center', color: '#333' }}>Cadastro de Pacientes</h1>
        <p style={{textAlign: 'rigth'}}>Usuário conectado: {user?.nome}</p> {/* Mostra o nome do usuário */}
      </div>

      {/* Formulário com Flexbox */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '800px',
          margin: 'auto',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '10px',
          backgroundColor: '#f9f9f9',
        }}
      >
      <div style={{ marginBottom: '10px' }}>

  <div className="form-row">
      <div className="form-group">
        <label className="form-label">Nome:</label>
        <input
          type="text"
          id="nome"
          className="form-input"
          placeholder="Digite o nome do paciente"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">CPF:</label>
        <input
          type="text"
          id="cpf"
          className="form-input"
          placeholder="999.999.999-99"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
      </div>
  </div>
  <div className="form-row">
      <div className="form-group">
        <label className="form-label">Veículo:</label>
        <select
        className='form-input'
          value={idpropag}
          onChange={(e) => setIdpropag(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '5px' }}
        >
          <option value="">Selecione o veículo de Propaganda...</option>
          {propagandaOptions.map((prop) => (
            <option key={prop.id} value={prop.id}>
              {prop.prop}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
      <label className="form-label">Telefone:</label>
        <input
          type="text"
          id="telefone"
          className="form-input"
          placeholder='(99)99999-9999'
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
      </div>
  </div>
  <div className="form-row">
      <div className="form-group">
        <label className="form-label">Logradouro:</label>
        <input
          type="text"
          id="logradouro"
          className="form-input"
          placeholder="Digite o Logradouro"
          value={logradouro}
          onChange={(e) => setLogradouro(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Número:</label>
        <input
          type="text"
          id="numero"
          className="form-input"
          placeholder="Digite o número"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
        />
      </div>
  </div>                     
  <div className="form-row">
      <div className="form-group">
        <label className="form-label">Complemento:</label>
        <input
          type="text"
          id="complemento"
          className="form-input"
          placeholder="Digite o Complemento"
          value={complemento}
          onChange={(e) => setComplemento(e.target.value)}
          
        />
      </div>

      <div className="form-group">
        <label className="form-label">Bairro:</label>
        <input
          type="text"
          id="bairro"
          className="form-input"
          placeholder="Digite o Bairro"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          required
        />
      </div>
  </div>                 
  <div className="form-row">
      <div className="form-group">
        <label className="form-label">Cidade:</label>
        <input
          type="text"
          id="cidade"
          className="form-input"
          placeholder="Digite a Cidade"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">UF:</label>
        <select value={uf} onChange={(e) => setUf(e.target.value)} 
         required
         style={{ padding: '10px', borderRadius: '5px' }}
         >
          <option value="">Selecione o Estado (UF)</option>
          {estados.map((sigla) => (
            <option key={sigla} value={sigla}>
              {sigla}
            </option>
         ))}
       </select>
      </div>
  </div>    
  <div className="form-row">
  <div className="form-group">
      <label className="form-label">Cep:</label>
        <input
          type="text"
          id="cep"
          className="form-input"
          placeholder='99999-999'
          value={cep}
          onChange={(e) => setCep(e.target.value)}
        />
      </div>
      <div className="form-group">
      <label className="form-label">Nascimento:</label>
        <input
          type="date"
          id="nascimento"
          className="form-input"
          
          value={dtnascimento}
          onChange={(e) => setDtnascimento(e.target.value)}
        />
      </div>
      

     
  </div> 
  <div className="form-row">
  <div className="form-group">
        <label className="form-label">Unidade:</label>
        <select
        className='form-input'
          value={id_unidade}
          id="unid"
          onChange={(e) => setId_unidade(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '5px' }}
        >
          <option value="">Selecione a Unidade...</option>
          {unidadesOptions.map((prop) => (
            <option key={prop.id} value={prop.id}>
              {prop.nome}
            </option>
          ))}
        </select>
      </div>

     
  </div>              

      
    

        

        
       
      

       
        </div>
        <div>
        {/* Substituição do input por combobox */}
       
        <label>            </label>
     
        </div>
       
     
 
           
         <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {editId ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>

      {/* Lista de Pacientes */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ textAlign: 'center', color: '#555' }}>Pacientes Cadastrados</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <table
            border="1"
            cellPadding="10"
            style={{
              width: '95%',
              borderCollapse: 'collapse',
              textAlign: 'center',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              fontSize: "12px"
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
                <th>Nome</th>
                <th>CPF</th>
                <th>Veículo</th>
                <th>Telefone</th>
                <th>Logradouro</th>
                <th>Número</th>
                <th>Complemento</th>
                <th>Bairro</th>
                <th>Cidade</th>
                <th>Uf</th>
                <th>Cep</th>
                <th>Nascimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <tr key={paciente.id}>
                    <td>{paciente.nome}</td>
                    <td>{paciente.cpf}</td>
                    <td>{paciente.idpropag}</td>
                    <td>{paciente.telefone}</td>
                    <td>{paciente.logradouro}</td>
                    <td>{paciente.numero}</td>
                    <td>{paciente.complemento}</td>
                    <td>{paciente.bairro}</td>
                    <td>{paciente.cidade}</td>
                    <td>{paciente.uf}</td>
                    <td>{paciente.cep}</td>
                    <td>{formatDate(paciente.dtnascimento)}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(paciente)}
                      style={{
                        marginRight: '5px',
                        padding: '5px',
                        border: 'none',
                        backgroundColor: '#ffc107',
                        color: '#fff',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(paciente.id)}
                      style={{
                        padding: '5px',
                        border: 'none',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botão Voltar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button
          onClick={() => router.push('/menu')}
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
  );
}
