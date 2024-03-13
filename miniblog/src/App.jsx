import "./App.css";

//Firebase
import { onAuthStateChanged } from "firebase/auth";

//import React Router
import { Routes, Route, Navigate } from "react-router-dom";

//import Context
import { AuthContextProvider } from "./context/AuthContext.jsx";

//Import Componentes
import { NavBar } from "./components/NavBar";
import Footer from "./components/Footer";
import Search from "./pages/Search/Search.jsx";
import Post from "./pages/Post/Post.jsx";
import EditPost from "./pages/EditPost/EditPost.jsx";

//Hooks
import { useState, useEffect } from "react";
import { useAuthentication } from "./hooks/useAuthentication.js";

//Páginas
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import About from "./pages/About/About.jsx";
import Register from "./pages/Register/register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import CreatePost from "./pages/CreatePost/CreatePost.jsx";

function App() {
  //Variáveis para verificação/autenticação das informações do usuário
  const [user, setUser] = useState(undefined);
  const { auth } = useAuthentication();

  const loadingUser = user === undefined;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [auth]);

  if (loadingUser) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="app">
      <AuthContextProvider value={{ user }}>
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/posts/:id" element={<Post />} />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" />}
            />
            <Route
              path="/create/post"
              element={user ? <CreatePost /> : <Navigate to="/login" />}
            />
            <Route
              path="/posts/edit/:id"
              element={user ? <EditPost /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <Footer />
      </AuthContextProvider>
    </div>
  );
}

export default App;
