const Query = {
  users: (parent, args, { db }, info) => {
    if(!args.query) return db.users;
    return db.users.filter((user) => {
      return db.users.name.toLowerCase().includes(args.query.toLowerCase());
    })
  },
  posts: (parents, args, { db }, info) => {
    if(!args.query) return db.posts;

    return db.posts.filter((post) => {
      return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  me: () => ({
    id: "sdknndv",
    name: "Miek",
    email: "thal@mail.com"
  }),
  comments: (parent, args, {db}, info) => {
    return db.comments;
  }
};

export default Query;
