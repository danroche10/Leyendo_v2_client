import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
//import moment from "moment";
//Icon, Label

function AuthorCard({
  author: { author, Description_1, Description_2, image_address, id }
}) {
  return (
    <Card fluid>
      <Card.Content>
        <Image floated="right" size="mini" src={image_address} />
        <Card.Header>{author}</Card.Header>
        <Card.Meta as={Link} to={`/${author}`}></Card.Meta>
        <Card.Description className="authorDescription">
          {Description_2}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button labelPosition="left" as={Link} to={`/${author}`}>
          <Button color="blue" basic key={author.id} value={author}>
            View
          </Button>
        </Button>
      </Card.Content>
    </Card>
  );
}

export default AuthorCard;
