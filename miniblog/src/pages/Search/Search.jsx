//CSS
import styles from "./Search.module.css";

//Hooks
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useQuery } from "../../hooks/useQuery";

//Componentes
import PostDetail from "../../components/PostDetail";

import { Link } from "react-router-dom";

const Search = () => {
  const query = useQuery();
  const search = query.get("q");

  const { documents: posts } = useFetchDocuments("posts", search);

  return (
    <div className={styles.search_container}>
      <h2>Resultados da busca</h2>
      <div>
        {/*Condição se não houver post*/}
        {posts && posts.length === 0 && (
          <div className={styles.nopost}>
            <p>Não foram encontrados posts a partir da sua busca</p>
            <Link to="/" className="btn btn_dark">
              Voltar
            </Link>
          </div>
        )}
        {/*Condição se houver post*/}
        {posts && posts.map((post) => <PostDetail post={post} key={post.id} />)}
      </div>
    </div>
  );
};

export default Search;
