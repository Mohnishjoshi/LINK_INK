const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 8080;

// In-memory database
let posts = [
  { id: uuidv4(), username: "mohnish", content: "I love drawing" },
  { id: uuidv4(), username: "pulkit", content: "I love gym" },
  { id: uuidv4(), username: "neeraj", content: "I lam coding enthusiast " }
];

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ===================== ROUTES ===================== */

// Homepage (List all posts)
app.get("/posts", (req, res) => {
  res.render("index", { posts });
});

// Form to create a new post
app.get("/posts/new", (req, res) => {
  res.render("new");
});

// Handle creation of a new post
app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  const newPost = { id: uuidv4(), username, content };
  posts.push(newPost);
  res.redirect("/posts");
});

// Show a single post
app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find(p => p.id === id);
  if (!post) return res.status(404).send("Post not found");
  res.render("show", { post });
});

// Form to edit a post
app.get("/posts/:id/edit", (req, res) => {
  const { id } = req.params;
  const post = posts.find(p => p.id === id);
  if (!post) return res.status(404).send("Post not found");
  res.render("edit", { post });
});

// Handle update of a post
app.post("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { username, content } = req.body;
  const post = posts.find(p => p.id === id);
  if (!post) return res.status(404).send("Post not found");

  post.username = username;
  post.content = content;

  res.redirect(`/posts/${id}`);
});

// Delete a post
app.post("/posts/:id/delete", (req, res) => {
  const { id } = req.params;
  posts = posts.filter(p => p.id !== id);
  res.redirect("/posts");
});

/* ===================== SERVER ===================== */

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
