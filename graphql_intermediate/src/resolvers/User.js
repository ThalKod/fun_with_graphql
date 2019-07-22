import getUSerId from "../utils/getUserId";

const User = {
  email: {
    fragment: "fragment userId on User { id }",
    resolve: (parent, args, { req }, info) => {
      const userId = getUSerId(req, false);

      if(parent.id === userId){
        return parent.email
      }
      return null;
    }
  },
  posts: {
    fragment: "fragment userId on User { id }",
    resolve: (parent, args, { req, prisma }, info) => {
      return prisma.query.posts({
        where:{
          author: {
            id: parent.id
          },
          published: true
        }
      }, info);
    }
  }
};

export default User;
