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

function findVertexByProps(props) {
  let findVertexGremlinString = `g.V()`;
  Object.entries(props).forEach(prop => {
  
    findVertexGremlinString += `.has('${prop[0]}', ${prop[1]})`
    console.log(typeof prop[1]);
  })
  return findVertexGremlinString;
}

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