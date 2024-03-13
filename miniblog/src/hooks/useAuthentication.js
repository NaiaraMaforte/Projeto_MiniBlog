import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { useState, useEffect } from "react";

//Criação do hook
export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [userRealized, setUserRealized] = useState(null);

  const auth = getAuth();

  //Cleanup (memony leak)
  const [cancelled, setCancelled] = useState(false);

  const checkIsCancelled = () => {
    if (cancelled) {
      return;
    }
  };

  // Registro do usuário
  const createUser = async (data) => {
    checkIsCancelled();
    setLoading(true);
    setError(null);

    //Recebimento da autenticação, email e senha do usuário pelo firebase e criação do Nome de Usuário
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(user, {
        displayName: data.displayName,
      });

      // Retorno de cadastro realizado
      setLoading(false);
      setUserRealized(true);

      return user, userRealized;
    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);

      //Tratamentos de erros
      let systemErrorMessage;

      if (error.message.includes("password")) {
        systemErrorMessage = "A senha deve conter pelo menos 6 caracteres";
      } else if (error.message.includes("email-already")) {
        systemErrorMessage = "E-mail já cadastrado";
      } else {
        systemErrorMessage = "Ocorreu um error, por favor tente mais tarde";
      }
      //Retorno de erros
      setLoading(false);
      setError(systemErrorMessage);
    }
  };

  //Logout do usuário
  const logout = () => {
    checkIsCancelled();

    signOut(auth);
  };

  //Login do usuário
  const login = async (data) => {
    checkIsCancelled();
    setLoading(true);
    setError(false);

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);

      //Tratamentos de erros
      let systemErrorMessage;
      console.log(error);

      if (error.message.includes("invalid-credential")) {
        systemErrorMessage = "Corrija seus dados para prosseguir";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
      }

      setError(systemErrorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    auth,
    createUser,
    error,
    loading,
    userRealized,
    logout,
    login,
  };
};
