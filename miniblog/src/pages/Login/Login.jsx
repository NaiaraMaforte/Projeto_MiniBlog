import styles from "./Login.module.css";

//Hooks
import { useAuthentication } from "../../hooks/useAuthentication";
import { useEffect, useState } from "react";

const login = () => {
  //Manipulação de dados de cadastro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //Desestruturação do hook useAuthentication
  const {
    login,
    userRealized,
    error: authError,
    loading,
  } = useAuthentication();

  //Função para submissão/salvamento dos dados cadastrados e verificação de senhas
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const user = {
      email,
      password,
    };

    const res = await login(user);
    console.log(res);

    //Reset dos inputs
    setEmail("");
    setPassword("");
  };

  //UseEffect para monitoramento dos erros - Passa o authError para o setError
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className={styles.login}>
      <h1>Entrar</h1>
      <p>Acesse sua conta e compartilhe suas histórias</p>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label>
          <span>E-mail</span>
          <input
            type="email"
            name="email"
            required
            placeholder="E-mail do usuário"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            autoComplete="false"
          />
        </label>
        <label>
          <span>Senha</span>
          <input
            type="password"
            name="password"
            required
            placeholder="Insira sua senha"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            autoComplete="false"
          />
        </label>

        {/*----->Botões de submissão do formulário<-----*/}
        {!loading && <button className="btn">Entrar</button>}
        {loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}

        {/*----->Erros<-----*/}
        {userRealized && <p>Bem vindo à sua conta!</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default login;
