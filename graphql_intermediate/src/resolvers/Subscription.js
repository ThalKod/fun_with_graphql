const Subscription = {
  comment: {
    subscribe: (parents, args, ctx, info) => {
      const { postID } = args;
      const { db, pubsub } = ctx;

      const post = db.posts.find((post) => post.id === postID );
      if(!post) throw new Error("Post not found...");

      return pubsub.asyncIterator(`comment:${postID}`); // channel name for the comments on post of postID
    }
  },
  post: {
    subscribe: (parents, args, ctx, info) => {
      const { pubsub } = ctx;
      return pubsub.asyncIterator("post");
    }
  }
};

export default Subscription;
