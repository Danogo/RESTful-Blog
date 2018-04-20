//LOADING MODULES
const express        = require('express'),
      app            = express(),
      methodOverride = require('method-override'),
      mongoose       = require('mongoose');

//APP CONFIG
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));
mongoose.connect('mongodb://localhost/restful_blog');

//Schema and Model CONFIG
const blogSchema = new mongoose.Schema({
  title: String,
  imgURL: String,
  date: {
        type: Date,
        // `Date.now()` returns the current unix timestamp as a number
        default: Date.now
      },
  body: String
});

const Blog = mongoose.model('Blog', blogSchema);

//APP ROUTES
//ROOT ROUTE - redirect to index
app.get('/', (req, res) => {
  res.redirect('/blogs');
});
//INDEX ROUTE - show all sites
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, allBlogs) => {
    if (err) {
      console.log(err);
    }  else {
      res.render('index', {blogs: allBlogs});
    }
  })
});
//NEW ROUTE - display form to create blog
app.get('/blogs/new', (req, res) => res.render('new'));
//CREATE ROUTE - create new blog
app.post('/blogs', (req, res) => {
  let blogData = req.body.blog;
  Blog.create(blogData, (err, newBlog) => {
    if (err) {
      console.log(err);
      res.redirect('/blogs/new');
    } else {
      console.log('New blog created, Sir!');
      res.redirect('/blogs');
    }
  });
});
//SHOW ROUTE - display details about specific blog
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      res.render('show', {blog: foundBlog});
    }
  });
});
//EDIT ROUTE - edit details about particular post
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      res.render('edit', {blog: foundBlog});
    }
  });
});
//UPDATE ROUTE - update details about selected Post
app.put('/blogs/:id', (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      res.redirect(`/blogs/${req.params.id}`);
    }
  });
});
//DELETE ROUTE - delete specific post
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, err => {
    if (err) {
      console.log(err);
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.listen(3000, () => console.log('Server is listening on port 3000'));
