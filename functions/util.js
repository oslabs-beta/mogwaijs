const util = {};
util.addPropsFromObj = (propsObj) => {
  let qString = '';

  Object.keys(propsObj).forEach((key) => {
    if (key !== 'label') {
      qString += `.property('${key}', ${key})`;
    }
  });

  return qString;
}

util.hasPropsFromObj = (propsObj) => {
  let qString = '';
  Object.keys(propsObj).forEach((key) => {
    if (key !== 'label') {
      qString += `.has('${key}', ${key})`;
    }
    return qString;
  })
}

module.exports = util;