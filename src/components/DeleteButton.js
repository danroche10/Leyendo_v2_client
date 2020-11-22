import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import MyPopup from "../util/MyPopup";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_ESSAYS_QUERY } from "../util/graphql";

function DeleteButton({ essayId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_ESSAY_MUTATION;

  const [deleteEssayOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_ESSAYS_QUERY
        });
        data.getEssays = data.getEssays.filter(e => e.id !== essayId);
        proxy.writeQuery({ query: FETCH_ESSAYS_QUERY, data });
      }
      if (callback) callback();
    },
    variables: {
      essayId,
      commentId
    }
  });
  return (
    <>
      <MyPopup content={commentId ? "Delete comment" : "Delete post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteEssayOrMutation}
      />
    </>
  );
}

const DELETE_ESSAY_MUTATION = gql`
  mutation deleteEssay($essayId: ID!) {
    deletePost(essayId: $essayId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($essayId: ID!, $commentId: ID!) {
    deleteComment(essayId: $essayId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
