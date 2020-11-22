import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";
import EssayCard from "../components/EssayCard";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Controller, useForm } from "react-hook-form";

function Essay(props) {
  const writer = props.match.params.writer;
  const [search, setSearch] = useState("");

  let essays = "";
  let filteredEssays = "";
  let options = "";
  const { loading, data } = useQuery(FETCH_AUTHOR_QUERY, {
    variables: {
      author: writer
    }
  });

  console.log(`Loading: ${loading}`);

  if (data) {
    essays = { data: data.getEssay2 };
    options = [...new Set(essays.data.map(option => option.topic))];
    filteredEssays = essays.data.filter(x => x.topic.includes(search));
  }

  const { loading: loading2, data: data2 } = useQuery(FETCH_AUTHOR_2_QUERY, {
    variables: {
      author: writer
    }
  });

  console.log(`Loading: ${loading2}`);
  let author2 = "";
  if (data2) {
    author2 = { data2: data2.getAuthor2 };
    //const hello = author2[Object.keys(author2)[0]];
    //const hello2 = hello[Object.keys(hello)[0]];
    //let john = hello2;
  }

  const [formState, setFormState] = useState("");
  const { control, handleSubmit } = useForm();

  const onSubmit = () => {
    let hello = formState;
    setSearch(hello);
    console.log(filteredEssays);
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
        <h1>Essays from {writer}</h1>
        {loading
          ? ""
          : author2.data2 &&
            author2.data2.map(x => (
              <div key={x.id} className="description">
                {x.Description_1}
              </div>
            ))}
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
                      label="e.g. Technology"
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
        essays.data &&
        filteredEssays.map(essay => (
          <Grid.Column key={essay.id} style={{ marginBottom: 20 }}>
            <EssayCard essay={essay} />
          </Grid.Column>
        ))
      )}
      <Grid.Row></Grid.Row>
    </Grid>
  );
}
const FETCH_AUTHOR_2_QUERY = gql`
  query getAuthor2($author: String!) {
    getAuthor2(author: $author) {
      author
      Description_1
      Description_2
    }
  }
`;

const FETCH_AUTHOR_QUERY = gql`
  query getEssay2($author: String!) {
    getEssay2(author: $author) {
      id
      title
      year
      topic

      likeCount
      likes {
        username
      }
    }
  }
`;

export default Essay;
