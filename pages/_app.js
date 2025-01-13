import '../styles/global.css'; // Opcional: estilos globais
import { UserProvider } from '../context/UserContext'; // Importa o contexto

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;

