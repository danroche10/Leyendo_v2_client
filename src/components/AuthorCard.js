import React, { useContext } from "react";
import { Button, Card, Image } from "semantic-ui-react";
import { WriterContext } from "../context/WriterContext";

import { Link } from "react-router-dom";
//import moment from "moment";
//Icon, Label

function AuthorCard({
  author: { author, Description_1, Description_2, image_address, id },
}) {
  const [writer, setWriter] = useContext(WriterContext);

  return (
    <Card fluid className="card">
      <Card.Content>
        <Image floated="right" src={image_address} className="cardImage" />
        <Card.Header>{author}</Card.Header>
        <Card.Meta as={Link} to={`/${author}`}></Card.Meta>
        <br></br>
        <div className="author_card_description">{Description_2}</div>
      </Card.Content>
      <Card.Content extra>
        <Button labelPosition="left" as={Link} to={`/${author}`}>
          <Button
            color="blue"
            basic
            key={author.id}
            value={author}
            onClick={(e) => setWriter(e.currentTarget.value)}
          >
            View
          </Button>
        </Button>
      </Card.Content>
    </Card>
  );
}

export default AuthorCard;
