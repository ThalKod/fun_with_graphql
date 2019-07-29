import ApolloBoost, { gql } from "apollo-boost";


const client = new ApolloBoost({
  uri:"http://localhost:8000/graphql"
});

const getUsers = gql`
  query {
    users{
      id
      name
    }
  } 
`;

const getPosts = gql`
  query {
    posts {
        id
        title
        author{
          id
          name
        }
    }
  } 
`;

client.query({
  query: getUsers
})
    .then(res =>{
      let html = "";

      res.data.users.forEach((user) => {
        html += `
          <div>
              <h3>${user.name}</h3>
          </div>
        `
      });

      document.getElementById("users").innerHTML = html
    })
    .catch(err => console.log(err));

client.query({
  query: getPosts
})
.then(res => {
  let html = '';
  res.data.posts.forEach(post => {
    html += `
      <div>
        <h3>${post.title} * ${post.author.name}</h3>
      </div>
    `
  })

  document.getElementById("posts").innerHTML = html
})
.catch(err => console.log(err));
