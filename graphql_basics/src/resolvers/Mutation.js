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
  updatePost: (parents, args, { db }, info ) => {
    const {  id, data } = args;
    const post = db.posts.find((post) => post.id === id);

    if(!post) throw new Error(" Post not found");

    if(typeof data.title === "string") post.title = data.title;
    if(typeof data.body === "string") post.body = data.body;
    if(typeof data.published === "boolean") post.published = data.published;

    return post;
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
  updateComment: (parents, args, { db }, info) => {
    const { id, data } = args;
    const comment = db.comments.find(( comment ) => comment.id === id);

    if(!comment) throw new Error("Comment not found");

    if(typeof data.text === "string") comment.text = data.text;

    return comment;
  }
};

export default Mutation;
