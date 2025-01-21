import Link from 'next/link';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext'; // Importa o contexto

export default function Menu() {
  const { user } = useUser(); // Mova o hook para dentro do componente funcional
  
  const linhausuario = user ? `Bem-vindo,  ${user.nome} ' - ' ${user.desctipo} ` : 'Não logado';
  console.log('Usuário: ', linhausuario);
  if (!user) {
    return <p>Você precisa estar logado para acessar esta página.</p>;
  }
  return (
    <div className="menu-container">
       {/*<h2 style={{ textAlign: 'center', color: '#333' }}>Atualizar/Entregar Medicamentos</h2> */}
      <Layout>
        
        <div className="titulo">
          <h3>Menu Principal</h3>
          <div className="barra-horizontal-azul" style={{alignItems: 'center'}}></div>
          <h6 style={{ textAlign: 'left' }}>{linhausuario}</h6>
        </div>
        <div className="vertical-menu">
          <ul className="menu">
          {(user.tipousuario === 'R' || user.tipousuario === 'A') && (
            <>
              <li><Link href="/cadpaciente">Cadastro de Pacientes</Link></li>
              <li><Link href="/medicamentos/atualizar"> Atualizar ou Entregar Medicamentos </Link></li>
              <li><Link href="/agendamentos">Agendamentos</Link></li>
             
            </>
          )} 
           {user.tipousuario === 'M'  && (
            <>
              <li><Link href="/consulta"> Consulta Médica</Link></li>
              <li><Link href="/medicamentos"> Cadastrar Medicamentos</Link></li>
              <li><Link href="/agendamentos">Agendamentos</Link></li>
             
            </>
          )} 
           {user.tipousuario === 'A' && (
            <>
              <li><Link href="/consulta"> Consulta Médica</Link></li>
              <li><Link href="/propaganda"> Cadastro de Propaganda</Link></li>
              <li><Link href="/tratamentos"> Cadastro de Tratamentos</Link></li>
              <li><Link href="/contratos"> Cadastro de Contratos e Pagamentos</Link></li>
              <li><Link href="/relatorios">Relatórios</Link></li>
              <li><Link href="/configuracoes">Configurações</Link></li>
              
            </>
          )}
            <li><Link href="/login"> Voltar ao Login</Link></li>
         
          </ul>
        </div>
      </Layout>
    </div>
  );
}
