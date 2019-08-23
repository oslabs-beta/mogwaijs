/** 
 * @param {String} label - the vertex 'type'; required;
 * @param {Object} schema - an object containing property names as keys; values are the constructor for the type of data contained at this key
 * 
 * TODO: all of our values will currently get stringified when they are passed into .property(); we need to determine if boolean values are accepted/passed as strings
 * 
 * TODO: validate inputs to Model and create (for example, if a property is passed into create that IS NOT a property on the model, we shouldn't add that property to our object)
 */
function vertexModel(label, schema = {}) {
  this.label = label;
  Object.entries(schema).forEach((keyValuePair) => {
    // console.log(`Line 13, schema is: ${schema}`)
    // console.log(`Line 14, keyValuePair is ${keyValuePair}`)
    this[keyValuePair[0]] = keyValuePair[1];
  });
}
vertexModel.prototype.create = function create(props) {
  
  let gremlinString = `g.addV('${this.label}')`;
  
  const created = Object.assign({}, props);
  
  Object.keys(props).forEach(prop => {
    // console.log(this)
    // console.log(this[prop])
    created[prop] = created[prop][props[prop]];
    gremlinString += `.property('${prop}', '${props[prop]}')`;
  })
// return created, gremlinString;
  // console.log(gremlinString);
  return gremlinString;
}
// const InfinityStone = new Model('Infinity Stone', {color: String, category: String})
const User = new vertexModel('User', {name: String, age: Number});
const Company = new vertexModel('Company', {name: String, city: String, field: String});
// console.log(`Line 32: User is: ${JSON.stringify(User)}`);
// console.log(`Line 33: Company is: ${JSON.stringify(Company)}`);
const sam = User.create(
  {
    name: 'Sam', 
    age: 30,
  });
const tanner = User.create({
  name:'Tanner',
  age: 23,
});
const netflix = Company.create({
  name: 'Netflix',
  city: 'Los Angeles',
  field: 'Entertainment'
})
const hulu = Company.create({
  name: 'Hulu',
  city: 'Santa Monica',
  field: 'Entertainment'
})
// const red = InfinityStone.create({
//   color: 'red',
//   category: 'Reality'
// })
// console.log('The first time, User is: ', User)
console.log('Sam is:', sam);
console.log(User)
// console.log(`Second time, User is:`, User);
console.log(`Tanner is: `, tanner)
console.log(User)
console.log(`netflix is: `, netflix);
console.log(Company)
console.log(`hulu is: `, hulu);
console.log(Company)
// console.log(`red is ${red}`)