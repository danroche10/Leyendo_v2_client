import React from "react";
import { Button, Card } from "semantic-ui-react";
import { Link } from "react-router-dom";
//import moment from "moment";
//import { AuthContext } from "../context/auth";
//import LikeButton from "./LikeButton";
import MyPopup from "../util/MyPopup";

function EssayCard({
  essay: { title, author, id, likeCount, commentCount, likes, topic, year },
}) {
  //const { user } = useContext(AuthContext);

  function dan(likeCount) {
    if (likeCount === 0) {
      return "0 likes";
    } else if (likeCount === 1) {
      return "1 like";
    } else {
      return likeCount + " likes";
    }
  }

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>{title}</Card.Header>
        <Card.Description>{topic}</Card.Description>
        <Card.Description>{year}</Card.Description>
        <Card.Meta as={Link} to={`/essays/${id}`}></Card.Meta>
        <Card.Description>{author}</Card.Description>
        <Card.Description>{dan(likeCount)}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <MyPopup content="Discuss essay">
          <Button labelPosition="right" as={Link} to={`/essays/${id}`}>
            <Button color="blue" basic key={title.id} value={id}>
              View
            </Button>
          </Button>
        </MyPopup>
      </Card.Content>
    </Card>
  );
}

export default EssayCard;
