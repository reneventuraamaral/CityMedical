import { useState } from 'react';
import { useUser } from '../context/UserContext'; // Importa o contexto
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Login() {
  const [usuario, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [setError] = useState('');
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
        localStorage.setItem('user', JSON.stringify(responseData.user));
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
      <div className="page">
      <div className="login-container">
      {/* Imagem ao lado */}
      <div className="image-container">
        <Image src="/images/city.jpg" alt="Imagem de Login" width={500} height={300} />
       
      </div>
      
        <form method="POST" className="formLogin">
        
        <div className="titulo">
          <h1>Login</h1>
          <div className="barra-horizontal"></div>
        </div>
            <p>Digite os seus dados de acesso nos campos abaixo.</p>
            <label htmlFor="text">Usuário</label>
            <input className="campo-input" type="text" placeholder="Digite seu login" value={usuario} autoFocus="true" onChange={(e) => setLogin(e.target.value)}/>
            <label htmlFor="password">Senha</label>
            <input type="password" placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)}/>
            <div className="lembrar-me">
               <input type="checkbox" /> <p>Lembrar-me</p>
            </div>
            <link href="/" />Esqueci minha senha
            
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
