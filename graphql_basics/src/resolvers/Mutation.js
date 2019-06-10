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
  createPost: (parent, args, { db }, info) => {
    const userExsist = db.users.some(user => user.id === args.data.author);
    if(!userExsist) throw new Error(" User not found");

    const post = {
      id: uuidv4(),
      ...args.data
    };
    db.posts.push(post);
    return post;
  },
  deletePost: (parents, args, { db }, info) => {
    const postIndex = db.posts.findIndex((post) => args.id === post.id);
    if(postIndex === -1) throw new Error("Posts not found");

    const deletedPost = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => {
      return comment.post !== args.id;
    });

    return deletedPost[0];
  },
  createComment: (parent, args, { db }, info) => {
    const userExist = db.users.some(user => user.id === args.data.author);
    const postExist = db.posts.some(post => post.id === args.data.post && post.published === true);

    if(!userExist || !postExist) throw new Error("User or post not found");

    const comment = {
      id: uuidv4(),
      ...args.data
    };

    db.comments.push(comment);
    return comment;
  },
  deleteComment: (parent, args, { db }, info) => {
    const commentIndex = db.comments.findIndex(comment => comment.id === args.id);

    if(commentIndex === -1) throw new Error("Comment not found");

    const deletedComments = db.comments.splice(commentIndex, 1);

    db.comments = db.comments.filter((comment) => comment.id !== args.id);

    return deletedComments[0];
  },
};

export default Mutation;
