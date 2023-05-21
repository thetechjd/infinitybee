
function getLastMonth (){

    const date = new Date


const month = date.getMonth() +1

console.log(month)

const year = date.getFullYear()

console.log(year)

const specificDate = new Date(`${month}/1/${year}`)

// Get the timestamp in seconds
const timestampInMilliseconds = Math.floor(specificDate.getTime());


console.log(timestampInMilliseconds)

return timestampInMilliseconds


}


module.exports = {getLastMonth};


