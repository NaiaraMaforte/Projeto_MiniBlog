import { useContext, createContext } from "react";

//Criação do context
const AuthContext = createContext();

//Criação do provider
export const AuthContextProvider = ({ children, value }) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

//Função que retorna o context já sendo utilizado (não precisa criar um hook)
export const useAuthValue = () => {
  return useContext(AuthContext);
};
