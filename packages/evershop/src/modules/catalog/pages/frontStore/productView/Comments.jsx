import React, { useState } from 'react';
import './Comments.scss';
import PropTypes from 'prop-types';
import Button from '@components/common/form/Button';

export default function Comments({ comments = [] }) {
  const [visibleComments, setVisibleComments] = useState(8);

  const showMoreComments = () => {
    setVisibleComments((prev) => prev + 8);
  };

  const showLessComments = () => {
    setVisibleComments(8);
  };

  return (
    <div id="productComments">
      <h3>Reviews</h3>
      {comments.length === 0 ? (
        <p>No comments available.</p>
      ) : (
        <>
          <ul className="comment-list">
            {comments.slice(0, visibleComments).map((comment) => (
              <li key={comment.commentId}>
                <div className='user-name'>{comment.userName}</div>
                <p className='comment'>{comment.comment}</p>
              </li>
            ))}
          </ul>
          <div className="button-container">
            {visibleComments < comments.length && (
              <Button title='Show More' onAction={showMoreComments} className="show-more"/>
            )}
            {visibleComments > 4 && (
              <Button title='Show Less' onAction={showLessComments} className="show-less"/>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export const layout = {
  areaId: 'productPageBottom',
  sortOrder: 20
};

Comments.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      commentId: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired,
      comment: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired
    }).isRequired
  )
};

Comments.defaultProps = {
  comments: []
};

export const query = `
  query Query {
    comments(productId: getContextValue("productId")) {
      commentId
      userName
      comment
      createdAt
    }
  }
`;