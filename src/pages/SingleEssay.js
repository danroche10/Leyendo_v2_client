import React, { useContext, useState, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { ExternalLink } from "react-external-link";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Grid,
  Image,
  Icon,
  Label,
  Form,
} from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import { WriterContext } from "../context/WriterContext";
//import { EssayIdContext } from "../context/EssayIdContext";

function SingleEssay(props) {
  const [writer, setWriter] = useContext(WriterContext);
  console.log(writer);

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

  const essayId = props.match.params.essayId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");

  const { loading, error, data } = useQuery(FETCH_ESSAY_QUERY, {
    variables: {
      essayId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      essayId,
      body: comment,
    },
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
      commentCount,
    } = data.getEssay;

    essayMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image size="small" src={image_link} />
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
                    <br></br>
                    <button>Read</button>
                    <br></br>
                    <br></br>
                  </ExternalLink>
                  <Button labelPosition="left" as={Link} to={`/${author}`}>
                    Back to {writer}'s Essays
                  </Button>
                </Card.Description>

                {!user && (
                  <Card.Description>
                    Login to comment on this essay!
                  </Card.Description>
                )}
              </Card.Content>

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
                  <p>Hey {user.username}! Why not post a comment?</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
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
            {comments.map((comment) => (
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

const FETCH_AUTHOR_2_QUERY = gql`
  query getAuthor2($author: String!) {
    getAuthor2(author: $author) {
      author

      image_address
    }
  }
`;

export default SingleEssay;
