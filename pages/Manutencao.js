import Layout from '../components/Layout';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Manutencao() {
  const router = useRouter();

  return (
    <Layout>
      <div style={styles.container}>
        <Image src="/images/city.jpg" alt="Logo da Clínica" width={150} height={80} />
        <h1 style={styles.title}>Página em Manutenção</h1>
        <p style={styles.message}>Estamos trabalhando para melhorar sua experiência. Volte em breve!</p>
        
        <button onClick={() => router.push('/menu')} style={styles.button}>
          Voltar ao Menu
        </button>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
    margin: '20px 0',
  },
  message: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
