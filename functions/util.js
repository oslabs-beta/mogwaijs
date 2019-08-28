const util = {};
util.addPropsFromObj = (propsObj, checkModel = true) => {
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

util.hasPropsFromObj = (propsObj, checkModel = true) => {
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

module.exports = util;