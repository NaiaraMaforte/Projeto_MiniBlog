import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

//Estado Inicial
const initialState = {
  loading: null,
  error: null,
};

//Tratamento dos estados
const DeleteReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "DELETED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

//Hook
export const useDeleteDocument = (docCollection) => {
  const [response, dispatch] = useReducer(DeleteReducer, initialState);

  //Cleanup (memony leak)
  const [cancelled, setCancelled] = useState(false);

  const checkIsCancelledBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };
  //Função para deleção de dados no banco
  const deleteDocument = async (id) => {
    //Verificação de erro no carregamento do documento
    checkIsCancelledBeforeDispatch({ type: "LOADING" });

    try {
      //Deleção do documento no banco de dados
      const deletedDocument = await deleteDoc(doc(db, docCollection, id));
      //Verificação de erro na deleção
      checkIsCancelledBeforeDispatch({
        type: "DELETED_DOC",
        payload: deletedDocument,
      });
    } catch (error) {
      checkIsCancelledBeforeDispatch({ type: "ERROR", payload: error.message });
    }
  };

  // useEffect(() => {
  //   return setCancelled(true);
  // }, []);

  return { deleteDocument, response };
};
