import { useState } from 'react';
import { useUser } from '../context/UserContext'; // Importa o contexto
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function Login() {
  const [usuario, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Faz a requisição para a API
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: usuario, senha: senha }),
      });
  
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        const errorData = await response.json(); // Apenas UMA chamada ao .json()
        setError(errorData.message || 'Erro ao autenticar');
        return;
      }
  
      const responseData = await response.json(); // Apenas UMA chamada ao .json()
      console.log('Resposta da API:', responseData);
      console.log('Resposta da API (bruta):', response);

  
      if (responseData.user) {
        setUser(responseData.user); // Define o usuário no contexto global
        console.log('Usuário logado:', responseData.user);
        //alert(user.message);
        router.push('/menu'); // Redireciona ao menu
      } else {
        setError('Usuário não encontrado.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro ao tentar realizar o login. Tente novamente.');
    }
  };
  

  return (
    <div>
      <Layout>
      <div class="page">
      <div className="login-container">
      {/* Imagem ao lado */}
      <div className="image-container">
        <img src="/images/city.jpg" alt="Imagem de Login" />
      </div>
      
        <form method="POST" class="formLogin">
        
        <div class="titulo">
          <h1>Login</h1>
          <div class="barra-horizontal"></div>
        </div>
            <p>Digite os seus dados de acesso nos campos abaixo.</p>
            <label for="text">Usuário</label>
            <input class="campo-input" type="text" placeholder="Digite seu login" value={usuario} autofocus="true" onChange={(e) => setLogin(e.target.value)}/>
            <label for="password">Senha</label>
            <input type="password" placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)}/>
            <div class="lembrar-me">
               <input type="checkbox" /> <p>Lembrar-me</p>
            </div>
            <a href="/">Esqueci minha senha</a>
            
            <button className="buttonLogin" 
               type="button" 
               onClick={(e) => {e.preventDefault(); // Evita o comportamento padrão
               handleLogin(); }} >
              Entrar
           </button>

        </form>
    </div>
    </div>





{/* 
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Login"
        value={usuario}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
      */}
      </Layout>
      
    </div>
  );
}
