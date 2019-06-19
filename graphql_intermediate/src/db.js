// ---------------- Graph QL types --------------------------
// Scalar types:  String, Boolean, Int, Float, ID

// Demo User Data
const users = [
  {
    id: "1",
    name: "Thal",
    email: "thal@mail.com",
  },
  {
    id: "3",
    name: "Thaasfwl",
    age: 93,
    email: "thal@mail.com",
  },
  {
    id: "2",
    name: "Jeff",
    email: "thal@mail.com",
  },
];

const posts = [
  {
    id: "1",
    title: "My Title",
    body: "That's the body",
    published: true,
    author: "1"
  },
  {
    id: "2",
    title: "My asdasd",
    body: "That's theasdadfppppdfpgppg body",
    published: false,
    author: "1"
  },
  {
    id: "3",
    title: "My Tiasdasdtle",
    body: "That's theasdsdasd body",
    published: true,
    author: "2"
  }
];

const comments = [
  {
    id: "1",
    text: "my First comment",
    author: "1",
    post: "1"
  },
  {
    id: "2",
    text: "my second comment",
    author: "2",
    post: "1"
  }
];

export default {
  users,
  comments,
  posts
};
