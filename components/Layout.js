import React from 'react';
import '../styles/global.css';
import { useUser } from '../context/UserContext'; // Importa o contexto
//const { user } = useUser();
  
export default function Layout({ children }) {
  return (
    
   
    <div style={styles.container} >
    
      {/* Logo */}
      <div style={styles.header}>
        <img src="/images/city.jpg" alt="Logo" style={styles.logo} />
        <h4 style={styles.title}>City Medical Group</h4>
        
               
      
      </div>
      <div class="barra-horizontal-azul" style={{alignItems: 'center'}}></div>
      {/* Conteúdo */}
      <div style={styles.content}>
      
        {children}
       
      </div>
   

    </div>
  
  );

}

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
    justifyContent: 'center',
    marginBottom: '20px',
  },
  logo: {
    width: '100px',
    marginRight: '10px',
  },
  title: {
    color: '#333',
    textAlign: 'center',
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

