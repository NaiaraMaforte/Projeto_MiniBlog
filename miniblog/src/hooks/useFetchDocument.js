//Hooks
import { useState, useEffect } from "react";

//Base de dados
import { db } from "../firebase/config";

//Métodos do Firebase
import { doc, getDoc } from "firebase/firestore";

export const useFetchDocument = (docCollection, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  //Cleanup (memony leak)
  const [cancelled, setCancelled] = useState(false);

  //useEffect para mapeamento dos dados de busca
  useEffect(() => {
    async function loadDocument() {
      if (cancelled) {
        return;
      }

      setLoading(true);

      try {
        const docRef = await doc(db, docCollection, id);
        const docSnap = await getDoc(docRef);

        setDocument(docSnap.data());

        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
      setLoading(false);
    }

    loadDocument();
  }, [docCollection, id, cancelled]);

  console.log(document);

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { document, loading, error };
};
