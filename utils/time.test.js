const timeTest = require('./time').getLastMonth()
const dateTest = require('./time')
const monthTest = require('./time')

const result = timeTest

const dateResult = dateTest.dateHelper(1685292169047)

const monthResult = monthTest.monthHelper(1685811492000)

console.log(`This is the result: ${result}`)

console.log(`This is the date result: ${dateResult}`)

console.log(`This is the month of the given timestamp: ${monthResult}`)