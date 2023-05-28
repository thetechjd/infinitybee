
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

function dateHelper(timestamp){

    const date = new Date(timestamp);
const formattedDate = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

console.log(formattedDate);

return formattedDate

}






module.exports = {getLastMonth, dateHelper};


