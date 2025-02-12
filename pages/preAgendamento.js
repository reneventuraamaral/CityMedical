import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/router';

export default function Preagendamentos() {
   // const [pacientes, setPacientes] = useState([]);
    const [propagandas, setPropagandas] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [unidades, setUnidades] = useState([]);
   // const [selectedPaciente, setSelectedPaciente] = useState('');
    const [selectedPropaganda, setSelectedPropaganda] = useState('');
    const [selectedMedico, setSelectedMedico] = useState('');
    const [selectedUnidade, setSelectedUnidade] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [horarios, setHorarios] = useState([]);
    const [selectedHora, setSelectedHora] = useState('');
    const { user } = useUser();
    const router = useRouter();
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cpf, setCpf] = useState("");
   // const [idpropag, setIdpropag] = useState(''); // ID selecionado da combo
   // const [propagandaOptions, setPropagandaOptions] = useState([]);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }

        const fetchPacientes = async () => {
            const res = await fetch('/api/getPacientesCombo');
            const data = await res.json();
            setPacientes(data);
        };

        
        const fetchpropagandas = async () => {
            const res = await fetch('/api/getPropagandas');
            const data = await res.json();
            setPropagandas(data)
        };

        const fetchMedicos = async () => {
            const res = await fetch('/api/getMedicosCombo');
            const data = await res.json();
            setMedicos(data);
        };

        const fetchUnidades = async () => {
            const res = await fetch('/api/getUnidades');
            const data = await res.json();
            setUnidades(data);
        };

        fetchPacientes();
        fetchMedicos();
        fetchUnidades();
        fetchpropagandas();
    }, [user, router]);

    const fetchHorariosDisponiveis = async (date) => {
        setSelectedDate(date);
        const res = await fetch(`/api/getHorariosDisponiveis?medico=${selectedMedico}&data=${date}`);
        const data = await res.json();
        setHorarios(data); // Agora data inclui ocupado: true/false
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const res = await fetch('/api/cadPreAgendamento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome_paciente: nome,
                cpf_paciente: cpf,
                id_propaganda: selectedPropaganda,
                telefone: telefone,
                //paciente: selectedPaciente,
                medico: selectedMedico,
                unidade: selectedUnidade,
                data: selectedDate,
                hora: selectedHora,
                id_usuario: user.id
            })
        });

        if (res.ok) {
            alert('Agendamento realizado com sucesso!');
            limparFormulario(); // Limpa os campos após salvar
        } else {
            alert('Erro ao realizar agendamento.');
        }
    };

    const limparFormulario = () => {
        setSelectedPaciente('');
        setSelectedMedico('');
        setSelectedUnidade('');
        setSelectedDate('');
        setHorarios([]);
        setSelectedHora('');
        setNome('');
        setCpf('');
        setSelectedPropaganda('');
    };
/* 
    const styles = {
        horariosContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '10px'
        }
    }; */
    

    return (
        <Layout>
            <h1>Pre-Agendar Consulta (Pacientes Novos)</h1>
            <div><p> </p></div>
            <form onSubmit={handleSubmit}>
            <div style={styles.filtroContainer}>
                <label>Paciente:</label>
                
                <input
                        type="text"
                        placeholder="Paciente"
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
                        
                        width={100}
                    />
 </div>
 <div style={styles.filtroContainer}>
                    <label>Propaganda</label>
                            <select
                            value={selectedPropaganda}
                            onChange={(e) => setSelectedPropaganda(e.target.value)}
                            required
                            style={{ padding: '10px', borderRadius: '5px' }}
                            >
                            <option value="">Selecione o veículo de Propaganda...</option>
                            {propagandas.map((prop) => (
                                <option key={prop.id} value={prop.id}>
                                {prop.nomeveiculo}
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
               </div>             

                                

                <label>Médico:</label>
                <select value={selectedMedico} onChange={(e) => setSelectedMedico(e.target.value)}>
                    <option value="">Selecione...</option>
                    {medicos.map((m) => (
                        <option key={m.id} value={m.id}>{m.nome}</option>
                    ))}
                </select>

                <label>Unidade:</label>
                <select value={selectedUnidade} onChange={(e) => setSelectedUnidade(e.target.value)}>
                    <option value="">Selecione...</option>
                    {unidades.map((u) => (
                        <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                </select>



                <label>Data:</label>
                <input type="date" value={selectedDate} onChange={(e) => fetchHorariosDisponiveis(e.target.value)} />

               
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
<label>Horário:</label>
    {horarios.length > 0 ? (
        horarios.map(({ hora, ocupado }) => (
            <button 
                key={hora}
                type="button"
                onClick={() => !ocupado && setSelectedHora(hora)}
                disabled={ocupado}
                style={{
                    margin: '5px',
                    padding: '10px',
                    backgroundColor: ocupado ? '#ccc' : (selectedHora === hora ? '#007bff' : '#28a745'),
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: ocupado ? 'not-allowed' : 'pointer',
                }}
            >
                {hora}
            </button>
        ))
    ) : (
        <p>Selecione um médico e uma data para ver os horários disponíveis.</p>
    )}
</div>
<div style={styles.filtroContainer}>
                <button type="submit" disabled={!nome || !selectedMedico || !selectedUnidade || !selectedDate || !selectedHora}
                style={{  padding: '10px', marginLeft: '10px', backgroundColor: '#007bff', border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer', }}>
                    Confirmar Agendamento
                </button>
                
                <button type="button" onClick={limparFormulario} style={{  padding: '10px', marginLeft: '10px', backgroundColor: '#ffcc00', border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer', }}>
                    Cancelar
                </button>

                <button type="button" onClick={() => router.push('/menu')} style={{  padding: '10px', marginLeft: '10px', backgroundColor: '#6c757d', border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',  }}>
                    Voltar ao Menu
                </button>
                </div>
            </form>
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