//CSS
import styles from "./Home.module.css";

//Hooks
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

//Componentes
import PostDetail from "../../components/PostDetail";

const Home = () => {
  const { documents: posts, loading } = useFetchDocuments("posts");
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    //Condição para redirecionamento para a página de busca
    if (query) {
      return navigate(`/search?q=${query}`);
    }
  };

  console.log(loading);

  return (
    <div className={styles.home}>
      <h1>Veja os posts mais recentes e inspire-se!</h1>

      <form className={styles.search} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ou busque os posts de sua preferencia pelas tags..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn_dark">Pesquisar</button>
      </form>

      <div className="post_list">
        {loading && <p>Carregando...</p>}

        {/*Condição se não houver post*/}
        {posts && posts.length === 0 && (
          <div className={styles.noposts}>
            <p>Não foram encontrados posts</p>
            <Link to="/create/post" className="btn">
              Criar primeiro post
            </Link>
          </div>
        )}

        {/*Condição se houver post*/}
        {posts && posts.map((post) => <PostDetail post={post} key={post.id} />)}
      </div>
    </div>
  );
};

export default Home;
