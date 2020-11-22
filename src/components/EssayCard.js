import React, { useContext } from "react";
import { Button, Card, Icon, Label, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
//import moment from "moment";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import MyPopup from "../util/MyPopup";
//import { EssayIdContext } from "../context/EssayIdContext";
//import DeleteButton from "./DeleteButton";

function EssayCard({
  essay: { title, author, id, likeCount, commentCount, likes, topic, year }
}) {
  const { user } = useContext(AuthContext);

  //const [essayId, setEssayId] = useContext(EssayIdContext);

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
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>
          {title}
          <span></span> ({year})
        </Card.Header>
        <Card.Description>{topic}</Card.Description>
        <Card.Meta as={Link} to={`/essays/${id}`}></Card.Meta>
        <Card.Description>{author}</Card.Description>
        <Card.Description>{dan(likeCount)}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} essay={{ id, likes, likeCount }} />
        <MyPopup content="Comment on post">
          <Button labelPosition="right" as={Link} to={`/essays/${id}`}>
            <Button
              color="blue"
              basic
              key={title.id}
              value={id}
              //onClick={e => setEssayId(e.currentTarget.value)}
            >
              <Icon name="comments" />
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
      </Card.Content>
    </Card>
  );
}

export default EssayCard;
