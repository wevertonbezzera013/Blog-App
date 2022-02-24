if (process.env.NODE_ENV !== 'production') {
    module.exports = { mongoURI: "mongodb+srv://wev_dev:senha123@cluster0.xa90a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" }
} else {
    module.exports = { mongoURI: 'mongodb://localhost/blogapp' }
}