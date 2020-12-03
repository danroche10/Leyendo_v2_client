import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
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
import { WriterContext } from "./context/WriterContext";
//import { TopicContext } from "./context/TopicContext";

function App() {
  const [writer, setWriter] = useState();
  //const [topic, setTopic] = useState();

  return (
    <AuthProvider>
      <WriterContext.Provider value={[writer, setWriter]}>
        <Router>
          <Container>
            <MenuBar />

            <Route exact path="/" component={Author} />

            <Route
              exact
              path="/:writer"
              render={(props) => {
                if (props.match.params.writer === "login")
                  return <Redirect to="/login" />;
                else if (props.match.params.writer === "register")
                  return <Redirect to="/register" />;
                else return <Route exact path="/:writer" component={Essay} />;
              }}
            />

            <AuthRoute exact path="/login" component={Login} />
            <AuthRoute exact path="/register" component={Register} />
            <Route exact path="/:writer/:essayId" component={SingleEssay} />
            <Route render={() => <Redirect to={{ pathname: "/" }} />} />
          </Container>
        </Router>
      </WriterContext.Provider>
    </AuthProvider>
  );
}

export default App;
