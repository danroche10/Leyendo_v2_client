import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { ExternalLink } from "react-external-link";
import moment from "moment";
import {
  Button,
  Card,
  Grid,
  Image,
  Icon,
  Label,
  Form
} from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
//import { EssayIdContext } from "../context/EssayIdContext";

function SingleEssay(props) {
  //const [essayId, setEssayId] = useContext(essayIdContext);

  const essayId = props.match.params.essayId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");

  const { loading, error, data } = useQuery(FETCH_ESSAY_QUERY, {
    variables: {
      essayId
    }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      essayId,
      body: comment
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error.</p>;
  let essayMarkup;
  if (!data.getEssay) {
    essayMarkup = <p>Loading Post...</p>;
  } else {
    const {
      id,
      title,
      year,
      author,
      comments,
      link,
      likes,
      likeCount,
      commentCount
    } = data.getEssay;

    essayMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>
                  {title}
                  <span></span> ({year})
                </Card.Header>

                <Card.Description>{author}</Card.Description>
                <Card.Description>
                  {" "}
                  <ExternalLink href={link}>
                    <button>Read</button>
                    <br></br>
                  </ExternalLink>
                </Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} essay={{ id, likeCount, likes }} />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log("Comment on post")}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={event => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map(comment => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton essayId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return essayMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($essayId: String!, $body: String!) {
    createComment(essayId: $essayId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_ESSAY_QUERY = gql`
  query($essayId: ID!) {
    getEssay(essayId: $essayId) {
      id
      title
      author
      link
      year
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SingleEssay;
