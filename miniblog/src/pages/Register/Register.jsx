import { db } from "../../firebase/config";

import styles from "./Register.module.css";

import { useAuthentication } from "../../hooks/useAuthentication";
import { useEffect, useState } from "react";

const Register = () => {
  //Manipulação de dados de cadastro
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  //Desestruturação do hook useAuthentication
  const {
    createUser,
    userRealized,
    error: authError,
    loading,
  } = useAuthentication();

  // Função para submissão/salvamento dos dados cadastrados e verificação de senhas
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const user = {
      displayName,
      email,
      password,
    };

    if (password !== confirmPassword) {
      setError("As senhas precisam ser iguais.");
      return;
    }
    const res = await createUser(user);
    console.log(user);

    //Reset dos inputs
    setDisplayName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  //UseEffect para monitoramento dos erros - Passa o authError para o setError
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className={styles.register}>
      <h1>Cadastre-se</h1>
      <p>Crie seu usuário e compartilhe suas histórias</p>
      <form onSubmit={handleSubmit} autoComplete="off">
        <label>
          <span>Nome</span>
          <input
            type="text"
            name="displayName"
            required
            placeholder="Nome do usuário"
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
            autoComplete="false"
          />
        </label>
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
        <label>
          <span>Confirmação da senha</span>
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="Confirme sua senha"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            autoComplete="false"
          />
        </label>
        {!loading && <button className="btn">Cadastrar</button>}
        {loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        {userRealized && <p>Cadastro realizado com sucesso!</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
