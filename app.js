//Const setup
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeDescriptionContent = "Lacking the motivation to get back into the gym? Back in the gym already but feel stagnated? Or maybe you’re just looking for new inspiration for the new year. Whatever your situation, reading words of wisdom from people can be super-inspiring. Reading about your progress can be even more inspiring as it will give you a way to reflect on your progress thus far.";

const app = express();

//DB Connection
mongoose.connect("mongodb://localhost:27017/fitnessJournalDB", {
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
  title: "Welcome to your journal!",
  body: "<p>Staying on track with your workouts and nutrition can be challenging for a variety of reasons- and if you’re having trouble seeing the results you want, a change may be in order! Everyone knows when you start a new fitness regimen, week one starts and you’re stoked to plan your workouts, meal prep, and write down every move you make towards the change you want to see. But come week two, three, four, you start telling yourself the gym was too crowded, you’re too tired to cook, or you’ll get back on track tomorrow.</p><p>Before the excuses start piling up, keep yourself accountable and track your progress with a fitness journal! Whether you’re training for a marathon, on a weight loss journey, or simply trying to keep track of your workouts, there are plenty of benefits of keeping a fitness journal. But what does tracking your fitness journey entail? What are the best ways to keep a fitness journal? Are there any alternatives? Find out here!</p>"
});

const post2 = new Post({
  title: "Keep it up! Can't stop before you start!",
  body: "<h3>Accountability</h3><p>Writing down your activity and your nutrition is a great way to keep yourself accountable to your goals. It helps you stay honest with yourself about whether you’re sticking to a fitness or diet plan, and allows you to keep track of what works for you and what doesn’t.</p><p>For example, if you try a workout class early in the morning or a recipe that you didn’t enjoy, making a note of it will remind you that there are better options for you to try. This will help you refine your lifestyle and be able to make healthy and productive choices.</p><h3>Keeps You Focused and Motivated</h3><p>One of the reasons you may have had trouble seeing desired results in the past is due to a lack of tracking your progress. It can be easy to give up too soon when you don’t see the fruits of your labor right away- but a journal can keep you focused on your goal. It helps keep you motivated and in tune with what you need to move forward.</p>"
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