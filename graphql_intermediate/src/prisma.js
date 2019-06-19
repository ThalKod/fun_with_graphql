import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
});

/*prisma.query.users(null, "{ id name posts{ id title } }")
    .then((users) => {
      console.log(JSON.stringify(users, undefined, 4));
    })
    .catch(err => console.log(err));*/

/*prisma.query.comments(null, "{ id text author{ id name } }")
    .then(data => console.log(JSON.stringify(data, undefined, 4)))
    .catch(err => console.log(err));*/

/*prisma.mutation.createPost({
  data: {
    title: "101 HEy 2",
    body: "",
    published: false,
    author: {
      connect: {
        id: "cjx23ci8w00sr0685rt7tc7js"
      }
    }
  }
}, "{ id title body published }")
    .then(data => {
      console.log(data);
      return prisma.query.users(null, "{ id name posts{ id title } }");
    })
    .catch(err => console.log(err))
    .then(data => console.log(JSON.stringify(data, undefined, 2))); */

prisma.mutation.updatePost({
  data: {
    body: "New Body",
    published: true
  },
  where: {
    id: "cjx3qd8qn00ip0885imgnv25m"
  }
}, "{ id title body published }")
    .then(data => {
      console.log(data);
      return prisma.query.posts(null, "{ id title body published }");
    })
    .then( data => console.log(data))
    .catch(err => console.log(err));
