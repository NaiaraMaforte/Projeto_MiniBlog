import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

//Estado Inicial
const initialState = {
  loading: null,
  error: null,
};

//Tratamento dos estados
const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "INSERTED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

//Hook
export const useInsertDocument = (docCollection) => {
  const [response, dispatch] = useReducer(insertReducer, initialState);

  //Cleanup (memony leak)
  const [cancelled, setCancelled] = useState(false);

  const checkIsCancelledBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };
  //Função para inserção de dados no banco
  const insertDocument = async (document) => {
    //Verificação de erro no carregamento do documento
    checkIsCancelledBeforeDispatch({ type: "LOADING" });

    try {
      //Criação do documento com horário
      const newDocument = { ...document, createdAt: Timestamp.now() };

      //Inserção do documento no banco de dados
      const insertedDocument = await addDoc(
        collection(db, docCollection),
        newDocument
      );
      //Verificação de erro na inserção
      checkIsCancelledBeforeDispatch({
        type: "INSERTED_DOC",
        payload: insertDocument,
      });
    } catch (error) {
      checkIsCancelledBeforeDispatch({ type: "ERROR", payload: error.message });
    }
  };

  // useEffect(() => {
  //   return setCancelled(true);
  // }, []);

  return { insertDocument, response };
};
