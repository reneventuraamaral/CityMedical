import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from '../components/Layout';

export default function CadastroPaciente() {

  const router = useRouter();
  const [user, setUser] = useState(null);
  //const [, setIdUsuario] = useState("");

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [idpropag, setIdpropag] = useState(''); // ID selecionado da combo
  const [propagandaOptions, setPropagandaOptions] = useState([]);
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');
  const [dtnascimento, setDtnascimento] = useState('');
  const [id_unidade, setId_unidade] = useState('');
  const [unidadeOptions, setUnidadeOptions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅ Adicionado estado de carregamento


  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.push("/login");
        return; // Para evitar execuções desnecessárias
      }

      try {
        const [pacientesRes, propagandasRes, unidadesRes] = await Promise.all([
          fetch("/api/getpacientesAntigo"),
          fetch("/api/getPropagandas"),
          fetch("/api/getUnidades")
        ]);

        const [pacientesData, propagandasData, unidadesData] = await Promise.all([
          pacientesRes.json(),
          propagandasRes.json(),
          unidadesRes.json()
        ]);

        setPacientes(pacientesData);
        setPropagandaOptions(propagandasData);
        setUnidadeOptions(unidadesData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <p>Carregando...</p>;
  if (!user) return null; // Evita renderização indevida antes do redirecionamento

// Função para formatar datas  dd/mm/yyyy
const formatDate = (dateString) => {
    if (!dateString) return 'Sem data';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Formatar data  
  const formatarData = (data) => {
    const partes = data.split("/");
    return `${partes[2]}-${partes[1]}-${partes[0]}`; // Converte de DD/MM/YYYY para YYYY-MM-DD
  };
  
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];
  
 
 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 🛠 Obtém o usuário do estado corretamente
   // const idUsuario = user?.id_usuario;
    const idUsuario = user?.id;
  
    if (!idUsuario) {
      alert('Erro: Usuário não autenticado!');
      router.push('/login');
      return;
    }
  
    const endpoint = editId ? `/api/updatepaciente/${editId}` : '/api/cadpaciente';
    const method = editId ? 'PUT' : 'POST';
  
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome, cpf, idpropag, telefone, logradouro, numero, complemento,
          bairro, cidade, uf, cep, dtnascimento, id_unidade, id_usuario: idUsuario
        }),
      });
  
      if (res.ok) {
        alert(editId ? 'Paciente atualizado!' : 'Paciente cadastrado!');
  
        // Recarrega a lista de pacientes
        const response = await fetch("/api/getpacientesAntigo");
        const data = await response.json();
        setPacientes(data);
  
        resetForm();
      } else {
        console.error("Erro ao cadastrar/atualizar paciente:", await res.text());
        alert("Erro ao cadastrar/atualizar paciente.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro na requisição ao servidor.");
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
   // setDtnascimento(formatarData(paciente.dtnascimento));
    setDtnascimento(formatarData(paciente.dtnascimento));

    setId_unidade(paciente.id_unidade);
   
  };
  // Excluir Paciente
  const handleDelete = async (id) => {
    if (confirm('Deseja realmente excluir o paciente?')) {
      try {
        const res = await fetch(`/api/deletepaciente/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Paciente excluído!');
          setPacientes(); // Atualiza a lista de pacientes
        }
      } catch (error) {
        console.error("Erro ao excluir paciente:", error);
      }
    }
  };
  

   // Resetar formulário
   const resetForm = () => {
    setEditId(null);
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
    setDtnascimento('');
    setId_unidade('');
   
  };
  return (
    <Layout>
       <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
         {/* Logo e título */}
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
         
           <h1 style={{ textAlign: 'center', color: '#333' }}>Cadastro de Pacientes</h1>
         </div>
   
         {/* Formulário com Flexbox */}
         <form
           onSubmit={handleSubmit}
           style={{
             display: 'flex',
             flexDirection: 'column',
             gap: '10px',
             margin: 'auto',
             padding: '20px',
             border: '1px solid #ddd',
             borderRadius: '10px',
             backgroundColor: '#f9f9f9',
           }}


         >
        
         <label>Nome:</label>   
         <input
                 type="text"
                 placeholder="Nome"
                 value={nome}
                 onChange={(e) => setNome(e.target.value)}
                 required
                 
               />
         <label>CPF:</label>   
                <input
                 type="text"
                 placeholder="9999.999.99-99"
                 value={cpf}
                 onChange={(e) => setCpf(e.target.value)}
                 required
                 width={100}
               />
           
           
          
           {/* Substituição do input por combobox */}
          
           <label>Propaganda</label>
         <select
           value={idpropag}
           onChange={(e) => setIdpropag(e.target.value)}
           required
           style={{ padding: '10px', borderRadius: '5px' }}
         >
           <option value="">Selecione o veículo de Propaganda...</option>
           {propagandaOptions.map((prop) => (
             <option key={prop.id} value={prop.id}>
               {prop.veiculo}
             </option>
           ))}
         </select>
        
         
         <label>Unidade</label>
         <select
            value={id_unidade}
            onChange={(e) => setId_unidade(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '5px' }}
            >
            <option value="">Selecione a unidade da clínica...</option>
            {unidadeOptions.map((unidade) => (
                <option key={unidade.id} value={unidade.id}>
                {unidade.nome}
                </option>
            ))}
         </select>

           

           <label>Telefone:</label>
           <input
               type="text"
               placeholder='(99) 99999-9999'
           value={telefone}
           onChange={(e) => setTelefone(e.target.value)}
           required
         />
          <label>Logradouro:</label>
           <input
             type="text"
             placeholder="Logradouro"
             value={logradouro}
             onChange={(e) => setLogradouro(e.target.value)}
             required
           />
            <label>Número:</label>
           <input
             type="text"
             placeholder="Numero"
             value={numero}
             onChange={(e) => setNumero(e.target.value)}
             required
           />
            <label>Complemento:</label>
           <input
             type="text"
             placeholder="Complemento"
             value={complemento}
             onChange={(e) => setComplemento(e.target.value)}
             
           />
            <label>Bairro:</label>
           <input
             type="text"
             placeholder="Bairro"
             value={bairro}
             onChange={(e) => setBairro(e.target.value)}
             required
           />

           <label>Cidade:</label>
           <input
             type="text"
             placeholder="Cidade"
             value={cidade}
             onChange={(e) => setCidade(e.target.value)}
             required
           />
        
         <label>Selecione o Estado (UF):</label>
           <select value={uf} onChange={(e) => setUf(e.target.value)} 
            required
            style={{ padding: '10px', borderRadius: '5px' }}
            >
             <option value="">Selecione...</option>
             {estados.map((sigla) => (
               <option key={sigla} value={sigla}>
                 {sigla}
               </option>
            ))}
          </select>
          <label>Cep:</label>
           <input
           type="text"
           placeholder="00000-000"
           value={cep}
           onChange={(e) => setCep(e.target.value)}
           required
         />
        
       
           <label>Data de Nascimento:</label>
           <input
             type="date"
             placeholder="Data de Nascimento"
             value={dtnascimento || ""}
             onChange={(e) => setDtnascimento(e.target.value)}
             required
           />
           
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

           <button onClick={() => resetForm()} 
                              style={{
                              padding: '10px 20px',
                              backgroundColor: '#dc3545', // Vermelho para indicar ação de cancelar
                              color: '#fff',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                          }}
                          className="button button-cancelar"
                        >
                        Cancelar
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
             }}
           >
             Voltar ao Menu
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
                       <td>{propagandaOptions.find(p => p.id === paciente.idpropag)?.veiculo || "Não informado"}</td>
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

