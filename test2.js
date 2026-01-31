const groupByParity = (array) => {
    let result = {};

    for (let item of array){
        let keyValue;
        if (item %2 === 0){
            keyValue = "even";
            } else {keyValue = "odd"}

        if (!result[keyValue]) {
            result[keyValue] = [];
            }
        
        result[keyValue].push(item)
    }

    return result; 
}

  console.log(groupByParity([1, 2, 3, 4, 5, 6]))


  const groupByFirstLetter = (array) => {
    let result = {}

    for (let item of array){
        let groupValue = item[0];

        if (!result[groupValue]){
            result[groupValue] = [];
        }

        result[groupValue].push(item)
    } return result;
  }
 console.log(groupByFirstLetter(["apple", "banana", "apricot", "blueberry", "cherry"]));