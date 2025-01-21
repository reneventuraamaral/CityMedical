import '../styles/global.css'; // Opcional: estilos globais
import { UserProvider } from '../context/UserContext'; // Importa o contexto

export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}


