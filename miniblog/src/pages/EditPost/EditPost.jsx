import styles from "./EditPost.module.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";
import { useFetchDocument } from "../../hooks/useFetchDocument";

const EditPost = () => {
  const { id } = useParams();
  const { document: post } = useFetchDocument("posts", id);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");

  //Preenchimento automático do POST
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setImage(post.image);
      setBody(post.body);

      const textTags = post.tagsArray.join(", ");

      setTags(textTags);
    }
  }, [post]);

  const navigate = useNavigate();

  const { user } = useAuthValue();

  const { updateDocument, response } = useUpdateDocument("posts");

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    //Validação da URL
    try {
      new URL(image);
    } catch (error) {
      return setFormError("A imagem precisa ser uma URL válida.");
    }

    //Criação do array de tags
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

    console.log(tagsArray);

    const data = {
      title,
      image,
      body,
      tagsArray,
    };

    updateDocument(id, data);

    //Validação de todos os valores
    if (!title || !image || !tags || !body) {
      return setFormError("Por favor, preencha todos os campos!");
    }

    if (formError) return;

    //Redirecionamento para o perfil do usuário
    navigate("/dashboard");
  };

  return (
    <div className={styles.edit_post}>
      {post && (
        <>
          <h2>
            Editando o post: <span>#{post.title}#</span>
          </h2>
          <p>Altere seu post como desejar!</p>
          <form onSubmit={handleSubmit}>
            <label>
              <span>Título:</span>
              <input
                type="text"
                name="title"
                //required
                placeholder="Pense em um bom título..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label>
              <span>URL da imagem:</span>
              <input
                type="text"
                name="image"
                //required
                placeholder="Insira uma imagem que represente seu post"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </label>
            <p className={styles.preview_title}>Preview da imagem atual:</p>
            <img
              className={styles.preview_image}
              src={post.image}
              alt={post.title}
            />
            <label>
              <span>Conteúdo:</span>
              <textarea
                name="body"
                //required
                placeholder="Insira o conteúdo do post."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                cols="10"
                rows="0"
              ></textarea>
            </label>

            <label>
              <span>#Tags:</span>
              <input
                type="text"
                name="tags"
                //required
                placeholder="Insira suas tags separadas por vígulas."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </label>

            {!response.loading && <button className="btn">Editar</button>}
            {response.loading && (
              <button className="btn" disabled>
                Aguarde...
              </button>
            )}
            {response.error && <p className="error">{response.error}</p>}
            {formError && <p className="error">{formError}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default EditPost;
