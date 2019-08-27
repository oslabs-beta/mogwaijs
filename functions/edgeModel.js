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

module.exports = EdgeModel;
