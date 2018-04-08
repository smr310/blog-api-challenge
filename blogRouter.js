const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');


//add some blog posts to BlogPosts so there some data to look at
BlogPosts.create("Title1", "Content1", "Author1");

BlogPosts.create("Title2", "Content2", "Author2");


//send back JSON representation of all blog posts on GET requests to root
router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

//when new blog post is added, ensure has required fields. if not 
// log error and return 400 status code with helpful message. 
//if okay, add new blog post, and return it with a status of 201.
router.post('/', jsonParser, (req, res) => {
    //ensure `title`, `content`, and `author` are in request body
    const requiredFields = ['title', 'content', 'author', 'publishdate'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishdate);
    res.status(201).json(item);
});


// Delete blog post (by id)!
router.delete('/:id', (req, res) => {
    console.log('Random text that will hopefully appear');
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.id}\``);
    res.status(204).end();
});

// when PUT request comes in with updated blog post, ensure has
// required fields. also ensure that post id is in url path, and
// pos id in updated post object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `BlogPost.updateItem` with updated post.
router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id `
                `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post \`${req.params.id}\``);
    const updatedPost = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishdate: req.body.publishdate 
    });
    console.log(req.body, updatedPost);
    res.set('Content-Type', 'application/json');
    console.log(res.getHeaders());
    res.status(200).send(updatedPost);
})


module.exports = router;