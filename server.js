var express = require('express')
var history = require('connect-history-api-fallback')
var app = express()

// Middleware for serving '/dist' directory
const staticFileMiddleware = express.static('dist')

// 1st call for unredirected requests
app.use(staticFileMiddleware)

// Support history api
app.use(history({
  index: '/dist/index.html',
}))

// 2nd call for redirected requests
app.use(staticFileMiddleware)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
