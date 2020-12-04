import React from "react";
import App from "./App";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
  uri: "https://mysterious-hamlet-83334.herokuapp.com/",
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),

  //Need proper solution to page crashing before user is able to login.
  //This isn't perfect as it is also catching incorrect crednetials error
  //and so preventing message from being displayed.
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
