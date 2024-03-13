import styles from "./CreatePost.module.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useInsertDocument } from "../../hooks/useInsertDocument";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

  const { user } = useAuthValue();

  const { insertDocument, response } = useInsertDocument("posts");

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

    //Validação de todos os valor]
    if (!title || !image || !tags || !body) {
      return setFormError("Por favor, preencha todos os campos!");
    }

    if (formError) return;

    insertDocument({
      title,
      image,
      body,
      tagsArray,
      uid: user.uid,
      createdBy: user.displayName,
    });

    //Redirecionamento para a página inicial
    navigate("/");
  };

  return (
    <div className={styles.create_post}>
      <h2>Criar Post</h2>
      <p>Escreva sobre o que desejar!</p>
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

        {!response.loading && <button className="btn">Postar</button>}
        {response.loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        {response.error && <p className="error">{response.error}</p>}
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
