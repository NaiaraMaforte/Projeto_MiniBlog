import styles from "./Dashboard.module.css";

import { Link } from "react-router-dom";

//Hooks
import { useAuthValue } from "../../context/AuthContext";
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useDeleteDocument } from "../../hooks/useDeleteDocuments";

const Dashboard = () => {
  const { user } = useAuthValue();
  const uid = user.uid;

  const { documents: posts } = useFetchDocuments("posts", null, uid);

  const { deleteDocument } = useDeleteDocument("posts");

  return (
    <div className={styles.dashboard}>
      <h2>Seu perfil</h2>
      <p>Gerencie seus post</p>
      {posts && posts.length === 0 ? (
        <div className={styles.noposts}>
          <p>Não foram encontrados posts</p>
          <Link to="/create/post" className="btn">
            Criar primeiro post
          </Link>
        </div>
      ) : (
        <>
          {posts &&
            posts.map((post) => (
              <div key={post.id} className={styles.post_row}>
                <p>{post.title}</p>
                <div>
                  <Link to={`/posts/${post.id}`} className=" btn btn-outline">
                    Ver
                  </Link>
                  <Link
                    to={`/posts/edit/${post.id}`}
                    className=" btn btn-outline"
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-outline btn-danger"
                    onClick={() => deleteDocument(post.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default Dashboard;
