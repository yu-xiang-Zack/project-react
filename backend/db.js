const sqlite = require('sqlite')

const dbPromise = sqlite.open(__dirname + '/db/react.sqlite3')

module.exports = dbPromise