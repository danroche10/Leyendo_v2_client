import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid, Button } from "semantic-ui-react";
import AuthorCard from "../components/AuthorCard";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
//import Button from "@material-ui/core/Button";
import { Controller, useForm } from "react-hook-form";

function Author() {
  const [search2, setSearch2] = useState("");
  const [topic, setTopic] = useState("");
  const { loading: loading2, data: data2 } = useQuery(FETCH_ESSAYS_QUERY);
  console.log(`Loading: ${loading2}`);

  let essays = "";
  let array = "";
  let author_topics = "";
  let filteredAuthors2 = "";
  let result = "";
  let options2 = "";

  if (data2) {
    essays = { data2: data2.getEssays };
    array = essays.data2;

    author_topics = Array.from(new Set(array.map(JSON.stringify))).map(
      JSON.parse
    );

    options2 = [...new Set(array.map((option) => option.topic))].sort();
    filteredAuthors2 = author_topics.filter((x) => x.topic.includes(topic));

    result = [...new Set(filteredAuthors2.map((a) => a.author))];
    console.log(result);
  }

  let authors = "";
  let filteredAuthors = "";
  let options = "";
  let filtery = "";

  const { loading, data } = useQuery(FETCH_AUTHORS_QUERY);

  console.log(`Loading: ${loading}`);

  if (data) {
    authors = { data: data.getAuthors };

    filtery = authors.data.filter((x) => result.includes(x.author));
    console.log(filtery);

    // Options should be filtered according to chosen topic
    options = [...new Set(filtery.map((option) => option.author))].sort();

    filteredAuthors = filtery.filter((x) => x.author.includes(search2));

    filteredAuthors.sort((a, b) =>
      a.author.split(" ").reverse() > b.author.split(" ").reverse() ? 1 : -1
    );
    console.log(filteredAuthors.length);
  }

  const [formState, setFormState] = useState("");
  const { control, handleSubmit } = useForm();

  const onSubmit = () => {
    let hello = formState;
    setTopic(hello);
    console.log(result);
    setFormState("");
  };

  const onSubmit2 = () => {
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

  const clearFilters = () => {
    setTopic("");
    setSearch2("");
  };

  React.useEffect(() => {
    const data = localStorage.getItem("chosen-topic");
    if (data) {
      setTopic(JSON.parse(data));
    }
    const data2 = localStorage.getItem("chosen-author");
    if (data2) {
      setSearch2(JSON.parse(data2));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("chosen-topic", JSON.stringify(topic));
    localStorage.setItem("chosen-author", JSON.stringify(search2));
  });

  console.log(formState);

  return (
    <div>
      <br></br>
      <br></br>
      <div className="hello">Leyendo</div>
      <div className="hello2">
        Read the best essays from across the internet
      </div>
      <Grid className="ui stackable four column grid" columns={3}>
        <Grid.Row className="page-title">
          <div style={{ width: 300 }} className="search">
            {!topic || filteredAuthors2.length < 1 ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="autocomplete"
                  control={control}
                  onChange={([e, data, reason]) =>
                    handleChange(e, data, reason)
                  }
                  onInputChange={(e, data) => handleInputChange(e, data)}
                  //defaultValue=""
                  as={
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      options={options2}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="e.g. Technology"
                          helperText="Choose a Topic"
                          margin="normal"
                          variant="outlined"
                        />
                      )}
                    />
                  }
                />
                <Button color="blue" basicvariant="contained" type="submit">
                  Submit
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit(onSubmit2)}>
                <Controller
                  name="autocomplete"
                  control={control}
                  onChange={([e, data, reason]) =>
                    handleChange(e, data, reason)
                  }
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
                          //label="e.g. Paul Graham"

                          helperText="Choose an Author"
                          margin="normal"
                          variant="outlined"
                        />
                      )}
                    />
                  }
                />
                <Button color="blue" variant="contained" type="submit">
                  Submit
                </Button>
              </form>
            )}
          </div>
        </Grid.Row>

        {topic || search2 ? (
          <div className="clearFilter">
            <Button
              className="clearFilters"
              labelPosition="left"
              onClick={clearFilters}
            >
              <b>Clear Filters</b>
            </Button>
          </div>
        ) : null}

        <Grid.Row stretched>
          {loading ? (
            <h1>Loading authors..</h1>
          ) : filtery.length < 1 || filteredAuthors.length < 1 ? (
            <h3>Sorry, your search didnt' return anything :(</h3>
          ) : (
            authors.data &&
            filteredAuthors.map((author) => (
              <Grid.Column key={author.id} style={{ marginBottom: 20 }}>
                <AuthorCard author={author} />
              </Grid.Column>
            ))
          )}
        </Grid.Row>
      </Grid>
    </div>
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

const FETCH_ESSAYS_QUERY = gql`
  {
    getEssays {
      id
      topic
      author
    }
  }
`;

export default Author;
