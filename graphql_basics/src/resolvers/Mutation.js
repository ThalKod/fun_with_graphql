import uuidv4 from "uuid/v4";

const Mutation = {
  createUser: (parent, args, { db }, info) => {
    const emailTaken = db.users.some((user) => {
      return user.email === args.data.email;
    });

    if(emailTaken){
      throw new Error("Email Taken")
    }
    const user = {
      id: uuidv4(),
      ...args.data
    };

    db.users.push(user);
    return user;
  },
  deleteUser(parents, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => {
      return user.id === args.id;
    });

    if(userIndex === -1) throw new Error("User not found");

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if(match){
        db.comments = db.comments.filter((comment) => {
          return comment.post !== post.id;
        })
      }

      return !match;
    });
    db.comments = db.comments.filter((comment) => comment.author !== args.id);
    return deletedUsers[0];
  },
  updateUser: (parents, args, { db }, info) => {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id);

    if(!user) throw new Error("User not found");
    if(typeof data.email === "string"){
      const emailTaken = db.users.some(() => user.email === data.email);
      if(emailTaken) throw new Error("Email Taken");

      user.email = data.email;
    }

    if(typeof data.name === "string"){
      user.name = data.name;
    }

    console.log(data.age);
    if(typeof data.age !== "undefined"){
      user.age = data.age;
    }

    console.log(user);
    return user;
  },
  createPost: (parent, args, { db, pubsub }, info) => {
    const userExsist = db.users.some(user => user.id === args.data.author);
    if(!userExsist) throw new Error(" User not found");

    const post = {
      id: uuidv4(),
      ...args.data
    };
    db.posts.push(post);

    if(args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post
        }
      });
    }

    return post;
  },
  deletePost: (parents, args, { db, pubsub }, info) => {
    const postIndex = db.posts.findIndex((post) => args.id === post.id);
    if(postIndex === -1) throw new Error("Posts not found");

    const deletedPost = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => {
      return comment.post !== args.id;
    });

    if(deletedPost[0].published){
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: deletedPost[0]
        }
      })
    }

    return deletedPost[0];
  },
  updatePost: (parents, args, { db, pubsub }, info ) => {
    const {  id, data } = args;
    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };

    if(!post) throw new Error(" Post not found");

    if(typeof data.title === "string") post.title = data.title;
    if(typeof data.body === "string") post.body = data.body;
    if(typeof data.published === "boolean") {
      post.published = data.published;

      if(originalPost.published && !post.published){
        // deleted event
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost
          }
        })
      }else if(!originalPost.published && post.published){
        // created event
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post
          }
        })
      }
    }else if(post.published){
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post
        }
      })
    }

    return post;
  },
  createComment: (parent, args, { db, pubsub }, info) => {
    const userExist = db.users.some(user => user.id === args.data.author);
    const postExist = db.posts.some(post => post.id === args.data.post && post.published === true);

    if(!userExist || !postExist) throw new Error("User or post not found");

    const comment = {
      id: uuidv4(),
      ...args.data
    };

    db.comments.push(comment);

    // publish to the comment:postID subscripition
    pubsub.publish(`comment:${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });

    return comment;
  },
  deleteComment: (parent, args, { db, pubsub }, info) => {
    const commentIndex = db.comments.findIndex(comment => comment.id === args.id);

    if(commentIndex === -1) throw new Error("Comment not found");

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    db.comments = db.comments.filter((comment) => comment.id !== args.id);

    pubsub.publish(`comment:${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment
      }
    });

    return deletedComment;
  },
  updateComment: (parents, args, { db, pubsub }, info) => {
    const { id, data } = args;
    const comment = db.comments.find(( comment ) => comment.id === id);

    if(!comment) throw new Error("Comment not found");

    if(typeof data.text === "string"){
      comment.text = data.text;
      pubsub.publish(`comment:${comment.post}`, {
        comment: {
          mutation: "UPDATED",
          data: comment
        }
      })
    }

    return comment;
  }
};

export default Mutation;
