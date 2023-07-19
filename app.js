//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "This is a database of my favourite Taylor Swift's lyrics. Press more to read full lyrics. Enjoy!";
const aboutContent = "Taylor Alison Swift (born December 13, 1989) is an American singer-songwriter. Recognized for her songwriting, musical versatility, artistic reinventions, and influence on the music industry, she is a prominent cultural figure of the 21st century. <br /><br /> Swift began songwriting professionally at age 14 and signed with Big Machine Records in 2005 to become a country musician. Under Big Machine, she released six studio albums, four of them to country radio, starting with her self-titled album (2006). Her next record, Fearless (2008), explored country pop, and its singles 'Love Story' and 'You Belong with Me' catapulted her to mainstream fame. Speak Now (2010) incorporated rock influences, and Red (2012) experimented with electronic elements and featured Swift's first Billboard Hot 100 number-one song, 'We Are Never Ever Getting Back Together'. She forwent her country image with 1989 (2014), a synth-pop album supported by chart-topping songs 'Shake It Off', 'Blank Space', and 'Bad Blood'. Media scrutiny inspired her next album, the hip-hop-flavored Reputation (2017), and its number-one single 'Look What You Made Me Do'.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true});

const postsSchema = new mongoose.Schema({
  postName: String,
  postContent: String
});

const Post = mongoose.model('Post', postsSchema);

app.get("/", function(req, res){
  Post.find({})
    .then((foundPosts) => {
      res.render("home", {
        content:homeStartingContent,
        posts: foundPosts
      })
    })
});

app.get("/about", function(req, res){
  res.render("about",{content:aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact",{content:contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose",{});
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Post.findById({ _id: requestedPostId })
  .then((post)=> {
    post.postContent = post.postContent.replace(/\n/g, '<br/>');
    res.render("post", {
    title: post.postName,
    content: post.postContent
    }); 
    console.log("Found this " + post.postName);
    console.log(post.postContent);
  });
});

app.post("/compose", function(req, res){

  const newPost = new Post ({
    postName: req.body.postTitle,
    postContent: req.body.postContent
  })
  newPost
  .save()
  .then((newPost) => console.log(newPost))
  .catch((err) => console.log(err));
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
