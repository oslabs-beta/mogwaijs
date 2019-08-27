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

// VertexModel.prototype.create = function create(props) {
//   let gremlinString = `g.addV('${this.label}')`;
//   // let variablesArray = [];

//   const created = Object.assign({}, props);

//   Object.keys(props).forEach(prop => {

//     created[prop] = created[prop][props[prop]];
//     if(typeof prop === 'object'){

//       if (typeof props[prop] !== 'string'){
//       gremlinString += `.property('${prop}', ${props[prop]})`;
//       } else {
//       gremlinString += `.property('${prop}', '${props[prop]}')`;
//       }
//     }

//   })
//   return gremlinString;
// }

// REFACTORED create METHOD
VertexModel.prototype.create = function create(schema = {}) {
  
  let gremlinString = `g.addV('${this.label}')`;
  const propsObject = Object.assign(schema, {});
  
  for (key in propsObject){
    gremlinString += `.property('key', key)`
  }


  console.log(gremlinString, propsObject);

  
 return propsObject;
  // return client.submit(gremlinString, variablesObject)
}


/** 
 * @param {Object\|String} [props] - An object containing properties to match. 
 * If no properties are given, will match all nodes of this Model.
 *
 */
// Model.prototype.match = function match(props) {
//   let qString = `g.V('${this.label}')`;
//   if (props) {
//     Object.entries(props).forEach((keyValuePair) => {
//       if (typeof keyValuePair[1] !== 'number'){
//         qString += `.has('${keyValuePair[0]}', '${keyValuePair[1]}')`;
//         // assuming the value is a number, just pass it in
//       } else qString += `.has('${keyValuePair[0]}', ${keyValuePair[1]})`;
//     })
//   }
// }

// function findVertexByProps(props) {
//   let findVertexGremlinString = `g.V()`;
//   Object.entries(props).forEach(prop => {
  
//     findVertexGremlinString += `.has('${prop[0]}', ${prop[1]})`
//     console.log(typeof prop[1]);
//   })
//   return findVertexGremlinString;
// }

//REFACTORED fVBP method
function findVertexByProps(props) {
  let findVertexGremlinString = `g.V()`;
  const propsObj = Object.assign(props, {});

 for (key in propsObj){
   findVertexGremlinString += `.has('key', key)`
 }

  // return client.submit(findVertexGremlinString, propsObj)
  // console.log(findVertexGremlinString)
  return findVertexGremlinString;
}

// function findVertexByNode(node){
//   let 
// }


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



// VertexModel.addprops = function addProps(node, props) {
//   let addPropsToAllVerticesString;

//   let funcObj = {
//     'string' : String,
//     'number' : Number,
//     'object' : Object,
//     'array' : Array,
//     'boolean' : Boolean,
//     'undefined' : undefined,
//   };

//   let propArray = Object.entries(props);
//     for (let i = 0; i < propArray.length; i++){
      
//       if (!this.schema[propArray[i]]){
//         this.schema[propArray[i]] = funcObj[typeof propArray[i]];
//       }
//   }

  
//   let str1;
//   node = Object.entries(node);
//   node = node.reduce((outputNode, currentSubArray) => {
//     outputNode[currentSubArray[0]] = currentSubArray[1];
//     return outputNode;
//   }, {})
//   str1 = findVertexByProps(node)
//   // console.log(`props on 44`, props)
//   Object.entries(props).forEach(prop=>{
//     // console.log(prop[0], 'is a ', (typeof prop[0]));
//     // console.log(prop[1], 'is a ', (typeof prop[1]));
//     str1 += `.property('prop', prop)`
//   })
//   return client.submit(str1, props);
// }


// --> Add Props to Vertex/Vertex Schema method
VertexModel.prototype.findVAndAddProps = function findVAndAddProps(node, props) {

  let gremlinString = findVertexByProps(node);
    //Declare typeof Object to match SCHEMA property values to their type
  const funcObj = {
    'string' : String,
    'number' : Number,
    'boolean' : Boolean,
    'undefined' : undefined,
  };
      //Assigns a new property to this.schema for every prop passed into the Prop Arg. 
  let propArray = Object.entries(props);
    for (let i = 0; i < propArray.length; i++){
      //if the Schema for that node DOES NOT have that property attached to it, then alter the schema to include that property as well. 
      if (!this[propArray[i][0]]){
        this[propArray[i][0]] = funcObj[typeof propArray[i][0]];
      }
  }
  // Adds a new line to the gremlinString for every prop in props object. 
  // The gremlin string will then be filled with the props when returning client.submit? I think? 
   for (key in props){
    gremlinString += `.property('${key}', ${props[key]})`
   }
  
  // return client.submit(gremlinString, props);
console.log(gremlinString);
}

const User = new VertexModel('User', {name: String, age: Number});
const eric = User.create({'eric': 'Eric', 'age' : 30})

console.log(eric);
User.findVAndAddProps(eric, {'city' : 'Chicago', 'occupation' : 'engineer'});
console.log(eric)