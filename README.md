# Mogwai.js
Cypher to Gremlin for graph databases in JavaScript

## Getting Started
Install MogwaiJS as an npm package
```
npm i mogwaijs
```

## Set up a Gremlin client & import Vertex and Edge models
```
const mogwai, { Vertex, Edge } = require('mogwaijs');
const client = mogwai.remoteConnect(DB_NAME, COLLECTION_NAME, PRIMARY_KEY, DB_ENDPOINT);
```
or
```
const client = mogwai.localConnect(USERNAME, PASSWORD, ENDPOINT);
```

## Create a vertex/edge model
```
const User = new Vertex('User', {
  name: String,
  age: Number,
});
```
```  
const IsFriendsWith = new Edge('isFriendsWith', {
  since: Number,
});
```

## Adding vertices and edges
```
User.addVertex({
  name: 'Sam',
  age: 22,
});

User.addVertex({
  name: 'Cassandra',
  age: 24,
});

isFriendsWith.addEdge(
  {name: 'Cassandra'},
  {name: 'Sam'},
  {since: 2018}
);
```
