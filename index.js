const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { typeDefs } = require("./schema/type-defs");
const { resolvers } = require("./schema/resolver");
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*'
}));

const server = new ApolloServer({
    typeDefs,
    resolvers
});

app.use(express.static(__dirname + 'public'));
app.use('/static', express.static(__dirname + '/public/static'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname+"/public/index.html"));
});

app.post("/api", (req, res) => {
  res.send("asdasdas");
});

startStandaloneServer(server, {
    listen: { port: 4000 },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});

app.listen(3000, () => {
  console.log("Express started");
})