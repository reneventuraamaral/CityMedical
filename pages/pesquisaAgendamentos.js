import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';


export default function PesquisaAgendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [selectedMedico, setSelectedMedico] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchPacientes();
        fetchMedicos();
    }, []);

    const fetchPacientes = async () => {
        const res = await fetch('/api/getPacientesCombo');
        const data = await res.json();
        setPacientes(data);
    };

    const fetchMedicos = async () => {
        const res = await fetch('/api/getMedicosCombo');
        const data = await res.json();
        setMedicos(data);
    };

    const fetchAgendamentos = async () => {
        let query = `/api/getAgendamentos?`;
        if (selectedPaciente) query += `paciente=${selectedPaciente}&`;
        if (selectedMedico) query += `medico=${selectedMedico}&`;
        if (selectedDate) query += `data=${selectedDate}`;

        const res = await fetch(query);
        const data = await res.json();
        setAgendamentos(data);
    };

    const handleExcluir = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este agendamento?')) return;

        try {
            const res = await fetch(`/api/excluirAgendamento?id=${id}`, { method: 'DELETE' });

            if (res.ok) {
                alert('Agendamento excluído com sucesso!');
                fetchAgendamentos(); // Atualiza a lista
            } else {
                alert('Erro ao excluir o agendamento.');
            }
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    };

  // Função para formatar datas  dd/mm/yyyy
   const formatDate = (dateString) => {
    if (!dateString) return 'Sem data';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  

    return (
        <Layout>
            <h1>Pesquisa de Agendamentos</h1>

            <div style={styles.filtroContainer}>
                <label>Paciente:</label>
                <select value={selectedPaciente} onChange={(e) => setSelectedPaciente(e.target.value)}>
                    <option value="">Todos</option>
                    {pacientes.map((p) => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                </select>

                <label>Médico:</label>
                <select value={selectedMedico} onChange={(e) => setSelectedMedico(e.target.value)}>
                    <option value="">Todos</option>
                    {medicos.map((m) => (
                        <option key={m.id} value={m.id}>{m.nome}</option>
                    ))}
                </select>

                <label>Data:</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />

                <button onClick={fetchAgendamentos} style={styles.botaoBuscar}>Buscar</button>
            </div>

            <table style={styles.tabela}>
                <thead>
                    <tr>
                        <th>Paciente</th>
                        <th>Médico</th>
                        <th>Unidade</th>
                        <th>Data</th>
                        <th>Hora</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {agendamentos.length > 0 ? (
                        agendamentos.map((agendamento) => (
                            <tr key={agendamento.id} style={agendamento.id % 2 === 0 ? estilos.linhaPar : estilos.linhaImpar}>
                            
                                <td>{agendamento.paciente}</td>
                                <td>{agendamento.medico}</td>
                                <td>{agendamento.unidade}</td>
                                <td>{formatDate(agendamento.dtconsulta)}</td>
                                <td>{agendamento.horario}</td>
                                <td>
                                    <button onClick={() => handleExcluir(agendamento.id)} style={styles.botaoExcluir}>
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum agendamento encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button onClick={() => router.push('/menu')} style={styles.botaoVoltar}>Voltar ao Menu</button>
        </Layout>
    );
}

const styles = {
    filtroContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
    },
    botaoBuscar: {
        padding: '8px 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    tabela: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    },
    botaoExcluir: {
        padding: '5px 10px',
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    botaoVoltar: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }
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
