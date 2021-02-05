//Const setup
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeDescriptionContent = "Lacking the motivation to get back into the gym? Back in the gym already but feel stagnated? Or maybe you’re just looking for new inspiration for the new year. Whatever your situation, reading words of wisdom from people can be super-inspiring. Reading about your progress can be even more inspiring as it will give you a way to reflect on your progress thus far.";

const app = express();

//DB Connection
mongoose.connect("mongodb://localhost:27017/dearDiaryDB", {
  useNewUrlParser: true
}, {
  useUnifiedTopology: true
});

//Schema creation
const postsSchema = {
  title: String,
  body: String
};

//Mongoose Model for Post
const Post = mongoose.model("Post", postsSchema);


//Default DB enteries
const post1 = new Post({
  title: "Welcome to your journal",
  body: "This is only the start of what you can acomplish if you set your mind to it. Write about how you felt today. It'll give you a great way to look back and realize how far you've come."
});

const post2 = new Post({
  title: "I'm still keeping it up",
  body: "I didn't stop refelcting today. In the famous words of Henry David Thoreau: Success usually comes to those who are too busy to be looking for it.’"
});

const defaultPosts = [post1, post2];

//View engine
app.set('view engine', 'ejs');

//Body-Parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Render home content at root
app.get("/", function (req, res) {

  Post.find({}, function (err, foundPosts) {

    if (foundPosts.length === 0) {
      Post.insertMany(defaultPosts, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfuly saved default items.")
        }
      });
      res.redirect("/");
    } else {
      res.render("home", {
        ejsHomeDescription: homeDescriptionContent,
        ejsLogContent: foundPosts
      });
    }
  });
})

app.get("/compose", function (req, res) {
  res.render("compose", {})
})

app.post("/compose", function (req, res) {

  const newPost = new Post({
    title: req.body.titleEntry,
    body: req.body.bodyEntry
  });


  if ((newPost.title.trim().length !== 0) && (newPost.body.trim().length !== 0)) {
    newPost.save(function(err){
      if (!err) {
        res.redirect("/");
      }
    });
  }
})

//Dynamic Posts URL
app.get('/posts/:postID', function (req, res) {

  const requestID = req.params.postID;

  Post.findOne({_id: requestID}, function(err, post){
      res.render("post", {
        ejsTitle: post.title,
        ejsBody: post.body,
        ejsID: post._id
      })
  });
})

//Dynamic Delete Posts
app.post('/del/:postID', function (req, res) {

  const postID = req.params.postID;

  Post.deleteOne({_id:postID},function(err){
    res.redirect("/");
  })
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});