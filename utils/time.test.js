const timeTest = require('./time').getLastMonth()
const dateTest = require('./time')

const result = timeTest

const dateResult = dateTest.dateHelper(1685292169047)

console.log(`This is the result: ${result}`)

console.log(`This is the date result: ${dateResult}`)