const express = require('express')
const app = express()
const port = process.env.port || 3000


app.post('/signup', async () => {

})

app.post('login', async () => {

})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
