# Mogwai.js
An OGM for the Gremlin traversal language

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
User.createVertex({
  name: 'Sam',
  age: 22,
});

User.createVertex({
  name: 'Cassandra',
  age: 24,
});

isFriendsWith.createEdge(
  {name: 'Cassandra'},
  {name: 'Sam'},
  {since: 2018}
);
```
