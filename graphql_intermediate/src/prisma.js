import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
});

/* prisma.query.users(null, "{ id name posts{ id title } }")
    .then((users) => {
      console.log(JSON.stringify(users, undefined, 4));
    })
    .catch(err => console.log(err)); */

prisma.query.comments(null, "{ id text author{ id name } }")
    .then(data => console.log(JSON.stringify(data, undefined, 4)))
    .catch(err => console.log(err));
