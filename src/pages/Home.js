import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";
import AuthorCard from "../components/AuthorCard";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Controller, useForm } from "react-hook-form";

function Author() {
  const [search2, setSearch2] = useState("");

  let authors = "";
  let filteredAuthors = "";
  let options = "";
  const { loading, data } = useQuery(FETCH_AUTHORS_QUERY);

  console.log(`Loading: ${loading}`);

  if (data) {
    authors = { data: data.getAuthors };

    options = [...new Set(authors.data.map(option => option.author))].sort();

    filteredAuthors = authors.data.filter(x => x.author.includes(search2));
  }
  const [formState, setFormState] = useState("");
  const { control, handleSubmit } = useForm();

  const onSubmit = () => {
    let hello = formState;
    setSearch2(hello);
    console.log(filteredAuthors);
  };

  const handleChange = (e, newValue, reason) => {
    return newValue;
  };

  const handleInputChange = (e, data) => {
    setFormState(data);
  };

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Authors</h1>
        <div style={{ width: 300 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="autocomplete"
              control={control}
              onChange={([e, data, reason]) => handleChange(e, data, reason)}
              onInputChange={(e, data) => handleInputChange(e, data)}
              //defaultValue=""
              as={
                <Autocomplete
                  id="free-solo-demo"
                  freeSolo
                  options={options}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Choose an Author"
                      margin="normal"
                      variant="outlined"
                    />
                  )}
                />
              }
            />
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </Grid.Row>
      {loading ? (
        <h1>Loading essays..</h1>
      ) : (
        authors.data &&
        filteredAuthors.map(author => (
          <Grid.Column key={author.id} style={{ marginBottom: 20 }}>
            <AuthorCard author={author} />
          </Grid.Column>
        ))
      )}
      <Grid.Row></Grid.Row>
    </Grid>
  );
}
const FETCH_AUTHORS_QUERY = gql`
  {
    getAuthors {
      id

      author
      Description_1
      Description_2
      image_address
    }
  }
`;

export default Author;
