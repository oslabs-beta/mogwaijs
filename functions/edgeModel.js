/** Edge Model
 * @param {String} label - "the edge type: required;" 
 * @param {Object} schema - "an object containing property names as keys; values are the constructor for the type of data contained at this key"
 */

function EdgeModel(label, schema = {}) {
  this.label = label;


  Object.entries(schema).forEach(keyValuePair => {
    this[keyValuePair[0]] = keyValuePair[1];
  })
}

/** Create Edge
 * @param {Object} fromNode - the name of the source node in the relationship which points to the target node
 * @param {Object} toNode - the name of the target node in the relationship; this node is pointed to
 * @param {Object} props - an object containing property names as keys; values are the constructor for the type of data contained at this key
 * @return {Object} promise - the object returned from the mogwai.client.submit method. 
 */

EdgeModel.prototype.createEdge = function createEdge(fromNode, toNode, props) {

  const typeObj = {
    'string' : String,
    'number' : Number,
    'boolean' : Boolean,
    'undefined' : undefined,
  };

  const qString = `g.V(from).addE('${this.label}').to(g.V(to))`;
  qString += EdgeModel.prototype.addPropsFromObj(props);

  return mogwai.client.submit(qString, {from: fromNode, to: toNode, ...props})
};

/** Add Props To Edge
 * @param {String} fromNode - the name of the source node in the relationship which points to the target node
 * @param {String} toNode - the name of the target node in the relationship; this node is pointed to
 * @param {Object} props - an object containing property names as keys; values are the constructor for the type of data contained at this key 
 * @return {Object} promise - the object returned from the mogwai.client.submit method. 
 */

EdgeModel.prototype.addPropsToEdge = function addPropsToEdge(fromNode, toNode, props) {
  if (typeof fromNode !== 'string') throw new Error (`Error: fromNode must be a string!`);
  if (typeof toNode !== 'string') throw new Error (`Error: toNode must be a string!`);
  if (typeof props !== 'object') throw new Error (`Error: props must be an object!`);

  let qString = ``;
  const typeObj = {
    'string' : String,
    'number' : Number,
    'boolean' : Boolean,
    'undefined' : undefined,
  };

  if(!(fromNode && toNode)){
    qString = `g.E('${this.label}')` + EdgeModel.prototype.addPropsFromObj(props);

  }
  else {
    qString = `g.V(from).outE('${this.label}').as('a').inV(to).select('a')` + EdgeModel.prototype.addPropsFromObj(props);
  }


  return mogwai.client.submit(qString, {from: fromNode, to: toNode, ...props})
}

EdgeModel.prototype.addPropsFromObj = (propsObj, checkModel = true) => {
  let qString = '';

  Object.keys(propsObj).forEach((key) => {
    if (key !== 'label') {
      qString += `.property('${key}', ${key})`;
    } 
    if (checkModel) {
      if (!this[key]){
          this[key] = typeObj[typeof propsObj[key]];
      }
    }
  });

  return qString;
}

EdgeModel.prototype.hasPropsFromObj = (propsObj, checkModel = true) => {
  let qString = '';
  Object.keys(propsObj).forEach((key) => {
    if (key !== 'label') {
      qString += `.has('${key}', ${key})`;
    } 
    if (checkModel) {
      if (!this[key]){
          this[key] = typeObj[typeof propsObj[key]];
      }
    }
    });
  return qString;
}



module.exports = EdgeModel;

