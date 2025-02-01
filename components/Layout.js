import React from 'react';
import '../styles/global.css';
import { useUser } from '../context/UserContext'; // Importa o contexto
import Image from 'next/image';

export default function Layout({ children }) {
  const { user } = useUser();
  
  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <div style={styles.header}>
        {/* Logo e título alinhados à esquerda */}
        <div style={styles.logoTitle}>
          <Image src="/images/city.jpg" alt="Logo" width={50} height={30} />
          <h4 style={styles.title}>City Medical Group</h4>
        </div>

        {/* Informações do usuário alinhadas à direita */}
        {user && (
          <div style={styles.userInfo}>
            <p><strong>Usuário:</strong> {user.nome}</p>
            <p><strong>Tipo:</strong> {user.tipousuario === 'A' ? 'Administrador' : user.tipousuario === 'M' ? 'Médico' : 'Recepção'}</p>
          </div>
        )}
      </div>

      <div className="barra-horizontal-azul" style={{ alignItems: 'center' }}></div>

      {/* Conteúdo */}
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
}

// Estilos atualizados
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Alinha logo à esquerda e usuário à direita
    marginBottom: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
  },
  logoTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    marginLeft: '10px',
    fontSize: '18px',
  },
  userInfo: {
    fontSize: '12px',
    textAlign: 'right',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};
