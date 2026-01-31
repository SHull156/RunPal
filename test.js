const countFrequencies = (array) => {
  let result = {};
  for (let item of array) {
    result[item] = (result[item] || 0) + 1;
  }
  return result;
};

const removeDuplicates = (array) => {
    let seen = [];

    for (let item of array) {
        if (!seen.includes(item)){
            seen.push(item)
        }
    } return seen;
}

console.log(removeDuplicates([1, 2, 2, 3, 1, 4, 3]));

const groupBy = (array, key) => {
  let result = {};

  for (let item of array) {
    const groupValue = item[key];

    if (!result[groupValue]) {
      result[groupValue] = [];
    }

    result[groupValue].push(item);
  }

  return result;
};


