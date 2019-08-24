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

const User = new Model('User', {name: String, age: Number});


/** 
 * @param {Object\|String} [props] - An object containing properties to match. 
 * If no properties are given, will match all nodes of this Model.
 *
 */
Model.prototype.match = function match(props) {
  let qString = `g.V('${this.label}')`;
  if (props) {
    Object.entries(props).forEach((keyValuePair) => {
      if (typeof keyValuePair[1] !== 'number'){
        qString += `.has('${keyValuePair[0]}', '${keyValuePair[1]}')`;
        // assuming the value is a number, just pass it in
      } else qString += `.has('${keyValuePair[0]}', ${keyValuePair[1]})`;
    })
  }
}