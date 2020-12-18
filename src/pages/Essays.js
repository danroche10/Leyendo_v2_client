import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid, Image } from "semantic-ui-react";
import EssayCard from "../components/EssayCard";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Controller, useForm } from "react-hook-form";
//import { WriterContext } from "../context/WriterContext";

function Essay(props) {
  const writer = props.match.params.writer;

  const [search, setSearch] = useState("");
  let essays = "";
  let filteredEssays = "";
  let options = "";
  const { loading, data } = useQuery(FETCH_AUTHOR_QUERY, {
    variables: {
      author: writer,
    },
  });

  console.log(`Loading: ${loading}`);

  if (data) {
    essays = { data: data.getEssay2 };
    options = [...new Set(essays.data.map((option) => option.year))]
      .sort()
      .reverse();
    filteredEssays = essays.data.filter((x) => x.year.includes(search));
    filteredEssays.sort((a, b) => parseFloat(b.year) - parseFloat(a.year));
  }

  const { loading: loading2, data: data2 } = useQuery(FETCH_AUTHOR_2_QUERY, {
    variables: {
      author: writer,
    },
  });

  console.log(`Loading: ${loading2}`);
  let author2 = "";
  let image_link = "";
  if (data2) {
    author2 = { data2: data2.getAuthor2 };
    image_link = author2.data2[0].image_address;
  }

  const [formState, setFormState] = useState("");
  const { control, handleSubmit } = useForm();

  const onSubmit = () => {
    let hello = formState;
    setSearch(hello);
    console.log(filteredEssays);
  };
  console.log(search);

  const handleChange = (e, newValue, reason) => {
    return newValue;
  };

  const handleInputChange = (e, data) => {
    setFormState(data);
  };

  return (
    <Grid className="ui stackable four column grid" columns={3}>
      <Grid.Row className="page-title">
        <h1>Essays from {writer}</h1>
        <Image className="author_image" size="small" src={image_link} />

        <br></br>
        {loading
          ? ""
          : author2.data2 &&
            author2.data2.map((x) => (
              <div key={x.id} className="essayPageDescription">
                {x.Description_1}
              </div>
            ))}
        <div style={{ width: 300 }} className="search">
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
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="e.g. 2016"
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
      <Link labelPosition="left" as={Link} to={`/`}>
        Back to Authors
      </Link>
      <Grid.Row stretched>
        {loading ? (
          <h1>Loading essays..</h1>
        ) : filteredEssays < 1 ? (
          <h3>Sorry, your search didnt' return anything :(</h3>
        ) : (
          essays.data &&
          filteredEssays.map((essay) => (
            <Grid.Column key={essay.id} style={{ marginBottom: 20 }}>
              <EssayCard essay={essay} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}
const FETCH_AUTHOR_2_QUERY = gql`
  query getAuthor2($author: String!) {
    getAuthor2(author: $author) {
      author
      Description_1
      Description_2
      image_address
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
