import { useState } from 'react';
import axios from 'axios';

export default function CadastrarMedicamentos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [description, setDescription] = useState('');

  const searchPatients = async () => {
    //const response = await axios.get(`/api/pacientes`, { params: { search: searchTerm } });
    //const response = await axios.get(`/api/getPaciente?id=${id}`);
    try {
        const response = await axios.get(`/api/getPaciente?id=${id}`);
        setPatients(response.data); 
        console.log('ID do paciente:', id);
        console.log('URL chamada:', `/api/getPaciente?id=${id}`);

    } catch (error) {
        console.error('Erro ao buscar paciente:', error);
        alert('Paciente não encontrado.');
    }
    //setPatients(response.data);
  };

  const saveMedication = async () => {
    if (!selectedPatient || !description) {
      alert('Selecione um paciente e preencha a descrição!');
      return;
    }

    const response = await axios.post(`/api/medicamentos`, {
      id_paciente: selectedPatient.id,
      id_medico: selectedPatient.id_medico,
      id_tratamento: selectedPatient.id_tratamento,
      dt_pedido: new Date().toISOString().split('T')[0],
      descricao: description,
    });

    if (response.status === 200) {
      alert('Medicamento cadastrado com sucesso!');
    }
  };

  return (
    
    <div>
      
      <h1>Cadastrar Medicamentos</h1>
      <input
        type="text"
        placeholder="Pesquisar Paciente"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={searchPatients}>Pesquisar</button>

      {patients.length > 0 && (
        <ul>
          {patients.map((patient) => (
            <li key={patient.id} onClick={() => setSelectedPatient(patient)}>
              {patient.nome} (ID: {patient.id})
            </li>
          ))}
        </ul>
      )}

      {selectedPatient && (
        <div>
          <h3>Paciente Selecionado: {selectedPatient.nome}</h3>
          <textarea
            placeholder="Descrição dos Medicamentos"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={saveMedication}>Salvar</button>
        </div>
      )}
    </div>
  );
}
