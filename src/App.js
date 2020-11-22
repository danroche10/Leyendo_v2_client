import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";
import MenuBar from "./components/MenuBar";
import Essay from "./pages/Essays";
import Author from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SingleEssay from "./pages/SingleEssay";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Author} />
          <Route exact path="/:writer" component={Essay} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/:writer/:essayId" component={SingleEssay} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
