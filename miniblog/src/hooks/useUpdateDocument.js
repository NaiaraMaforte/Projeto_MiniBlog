import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";

//Estado Inicial
const initialState = {
  loading: null,
  error: null,
};

//Tratamento dos estados
const updateReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "UPDATE_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

//Hook
export const useUpdateDocument = (docCollection) => {
  const [response, dispatch] = useReducer(updateReducer, initialState);

  //Cleanup (memony leak)
  const [cancelled, setCancelled] = useState(false);

  const checkIsCancelledBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };
  //Função para atualização dos dados no banco
  const updateDocument = async (id, data) => {
    //Verificação de erro no carregamento do documento
    checkIsCancelledBeforeDispatch({ type: "LOADING" });

    try {
      //Atualização do documento no banco de dados
      const docRef = await doc(db, docCollection, id);

      const updateDocument = await updateDoc(docRef, data);

      //Verificação de erro na atualizaçao
      checkIsCancelledBeforeDispatch({
        type: "UPDATE_DOC",
        payload: updateDocument,
      });
    } catch (error) {
      checkIsCancelledBeforeDispatch({ type: "ERROR", payload: error.message });
    }
  };

  // useEffect(() => {
  //   return setCancelled(true);
  // }, []);

  return { updateDocument, response };
};
