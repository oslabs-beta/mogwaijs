/** 
 * @param {String} label - the vertex 'type'; required;
 * @param {Object} schema - an object containing property names as keys; values are the constructor for the type of data contained at this key
 * 
 * TODO: all of our values will currently get stringified when they are passed into .property(); we need to determine if boolean values are accepted/passed as strings
 * [ x ] Eric Stallings, 8/23
 * 
 * TODO: validate inputs to Model and create (for example, if a property is passed into create that IS NOT a property on the model, we shouldn't add that property to our object)
 * [ x ] Eric Stallings, 8/23
 */
function VertexModel(label, schema = {}) {
  this.label = label;
  Object.entries(schema).forEach((keyValuePair) => {
    this[keyValuePair[0]] = keyValuePair[1];
  });
}

VertexModel.prototype.create = function create(props) {
  let gremlinString = `g.addV('${this.label}')`;
  const created = Object.assign({}, props);
  Object.keys(props).forEach(prop => {
    created[prop] = created[prop][props[prop]];
    if(typeof prop === 'object'){
      if (typeof props[prop] !== 'string'){
      gremlinString += `.property('${prop}', ${props[prop]})`;
      } else {
      gremlinString += `.property('${prop}', '${props[prop]}')`;
      }
    } 
  })
  return gremlinString;
}

// VertexModel.prototype.delete = function delete(props) {
//   const qString = `g.V().has().drop()`;

//   return client.submit(qString, {})
// }

function findVertexByProps(props) {
  let findVertexGremlinString = `g.V()`;
  Object.entries(props).forEach(prop => {
  
    findVertexGremlinString += `.has('${prop[0]}', ${prop[1]})`
    console.log(typeof prop[1]);
  })
  return findVertexGremlinString;
}

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

 
function addProps(node, props) {
  let str1;
  node = Object.entries(node);
  node = node.reduce((outputNode, currentSubArray) => {
    outputNode[currentSubArray[0]] = currentSubArray[1];
    return outputNode;
  }, {})
  str1 = findVertexByProps(node)
  console.log(`props on 44`, props)
  Object.entries(props).forEach(prop=>{
    console.log(prop[0], 'is a ', (typeof prop[0]));
    console.log(prop[1], 'is a ', (typeof prop[1]));
    str1 += `.property('${prop[0]}', ${prop[1]})`
  })
  return str1;
}
