import { Prisma } from "prisma-binding";
import { fragmentReplacements } from "./resolvers";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: "prismasecret239201prismae129",
  fragmentReplacements
});

export default prisma;














/*const createPostForUser = async (authorId, data) => {
  const userExists = await prisma.exists.User({ id: authorId });

  if(!userExists) throw new Error("User not found !");

  const post = await prisma.mutation.createPost({
    data: {
        ...data,
        author: {
          connect: {
            id: authorId
          }
        }
    }
  }, "{ author{ id name email posts{ id title published } } }");

  return post.author;
};*/

/*createPostForUser("cjx23quqp010y0685p2ebjeiq", {
  title: "Reading It...",
  body: "Hello Body",
  published: true
}).then(user => console.log(JSON.stringify(user, undefined, 2)))
    .catch(err => console.log(err.message));*/

/*const updatePost = async (postId, data) => {
  const postExist = await prisma.exists.Post({ id: postId });

  if(!postExist) throw new Error("Post not found");

  const updatedPost = await prisma.mutation.updatePost({
    data,
    where: {
      id: postId
    }
  }, "{ id author{ id name email posts{ id title } } }");

  return updatedPost.author;
};*/

/*updatePost("cjx3qd8qn00ip0885imgnv25m", {
  body: "",
  published: false
}).then(data => console.log(data))
    .catch(err => console.log(err.message));*/
