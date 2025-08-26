const Comment = require('../models/Comment');
const Post = require('../models/Post'); // Import Post model to validate postId

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { id: userId } = res.locals.payload;
    const postId = req.params.postId;
    const { message } = req.body; 
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ status: 'Error', msg: 'Post not found to add comment' });
    }

    // Create a new comment
    const comment = new Comment({
      message, 
      post: postId,
      userId 
    });
    await comment.save();

  
    res.status(201).send({ status: 'Success', msg: 'Comment added successfully', comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send({ status: 'Error', msg: 'Failed to add comment' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    
    const { id: userId } = res.locals.payload;
    const commentId = req.params.id;

    
    const comment = await Comment.findById(commentId);

    
    if (!comment) {
      return res.status(404).send({ status: 'Error', msg: 'Comment not found' });
    }

    
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).send({ status: 'Error', msg: 'Unauthorized to delete this comment' });
    }

    
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    res.status(200).send({ status: 'Success', msg: 'Comment deleted successfully', deletedComment });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).send({ status: 'Error', msg: 'Failed to delete comment' });
  }
};

