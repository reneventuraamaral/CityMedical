import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/router';

export default function Agendamentos() {
    const [pacientes, setPacientes] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState('');
    const [selectedMedico, setSelectedMedico] = useState('');
    const [selectedUnidade, setSelectedUnidade] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [horarios, setHorarios] = useState([]);
    const [selectedHora, setSelectedHora] = useState('');
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }

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

        const fetchUnidades = async () => {
            const res = await fetch('/api/getUnidades');
            const data = await res.json();
            setUnidades(data);
        };

        fetchPacientes();
        fetchMedicos();
        fetchUnidades();
    }, [user, router]);

    const fetchHorariosDisponiveis = async (date) => {
        setSelectedDate(date);
        const res = await fetch(`/api/getHorariosDisponiveis?medico=${selectedMedico}&data=${date}`);
        const data = await res.json();
        setHorarios(data); // Agora data inclui ocupado: true/false
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const res = await fetch('/api/cadAgendamento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paciente: selectedPaciente,
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
            <h1>Agendar Consulta</h1>
            <form onSubmit={handleSubmit}>
                <label>Paciente:</label>
                <select value={selectedPaciente} onChange={(e) => setSelectedPaciente(e.target.value)}>
                    <option value="">Selecione...</option>
                    {pacientes.map((p) => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                </select>

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

                <label>Horário:</label>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
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

                <button type="submit" disabled={!selectedPaciente || !selectedMedico || !selectedUnidade || !selectedDate || !selectedHora}>
                    Confirmar Agendamento
                </button>
                
                <button type="button" onClick={limparFormulario} style={{ marginLeft: '10px', backgroundColor: '#ffcc00' }}>
                    Cancelar
                </button>

                <button type="button" onClick={() => router.push('/menu')} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>
                    Voltar ao Menu
                </button>
            </form>
        </Layout>
    );
}
