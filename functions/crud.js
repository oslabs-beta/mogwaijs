/** 
 * @param {String} label - the vertex 'type'; required;
 * @param {Object} schema - an object containing property names as keys; values are the constructor for the type of data contained at this key
 * 
 * TODO: all of our values will currently get stringified when they are passed into .property(); we need to determine if boolean values are accepted/passed as strings
 * 
 * TODO: validate inputs to Model and create (for example, if a property is passed into create that IS NOT a property on the model, we shouldn't add that property to our object)
 */

function Model(label, schema = {}) {
  this.label = label;
  Object.entries(schema).forEach((keyValuePair) => {
    this[keyValuePair[0]] = keyValuePair[1];
  });
}

Model.prototype.create = function create(props) {
  let gremlinString = `g.addV('${this.label}')`;
  
  Object.keys(props).forEach(prop => {
    this[prop] = this[prop](props[prop]);
    gremlinString += `.property('${prop}', '${props[prop]}')`;
  })
  console.log(gremlinString);
  return gremlinString;
}

const User = new Model('User', {name: String, age: Number});

console.log(JSON.stringify(User));

const sam = User.create(
  {
    name: 'Sam', 
    age: 30,
  });

console.log(sam);

/**
 * 
 * @param {String} label - "the edge type: required;" 
 * @param {Object} schema - "an object containing property names as keys; values are the constructor for the type of data contained at this key"
 */

function EdgeModel(label, schema = {}) {
  this.label = label;


  Object.entries(schema).forEach(keyValuePair => {
    this[keyValuePair[0]] = keyValuePair[1];
  })
}

/**
  * @param {Object} firstNode -"the name of the first node in the relationship which points to the second node"
 * @param {Object} secondNode-"the name of the second node in the relationship; this node is pointed to"
 * @param {Object} props-"an object containing property names as keys; values are the constructor for the type of data contained at this key"
 */
EdgeModel.prototype.createEdge = function createEdge(fromNode, toNode, props) {

  const qString = `g.V(from).addE('${this.label}').to(g.V(to))`;
  
  return client.submit(qString, {from: fromNode, to: toNode})
  };