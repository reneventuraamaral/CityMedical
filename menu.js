import Link from 'next/link';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext'; // Importa o contexto

export default function Menu() {
  const { user } = useUser(); // Mova o hook para dentro do componente funcional
  const linhausuario = user ? `Usuário: ${user.nome}` : 'Não logado';

  return (
    <div className="menu-container">
       {/*<h2 style={{ textAlign: 'center', color: '#333' }}>Atualizar/Entregar Medicamentos</h2> */}
      <Layout>
        
        <div className="titulo">
          <h3>Menu Principal</h3>
          <div class="barra-horizontal-azul" style={{alignItems: 'center'}}></div>
          <h6 style={{ textAlign: 'right' }}>{linhausuario}</h6>
        </div>
        <div className="vertical-menu">
          <ul className="menu">
            <li>
              <Link href="/cadpaciente">Cadastro de Pacientes</Link>
            </li>
            <li>
              <Link href="/medicos">Cadastro de Médicos</Link>
            </li>
            <li>
              <Link href="/propaganda">Cadastro de Propaganda</Link>
            </li>
            <li>
              <Link href="/tratamentos">Cadastro de Tratamentos</Link>
            </li>
            <li>
              <Link href="/medicamentos">Cadastrar Medicamentos</Link>
            </li>
            <li>
              <Link href="/medicamentos/atualizar">Atualizar/Entregar Medicamentos</Link>
            </li>
            <li>
              <Link href="/contratos">Cadastro de Contratos/Pagamentos</Link>
            </li>
            <li>
              <Link href="/consulta">Consulta Médica</Link>
            </li>
          </ul>
        </div>
      </Layout>
    </div>
  );
}
