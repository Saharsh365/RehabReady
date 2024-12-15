const express = require('express')
const app = express()
const portNumber = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(portNumber, () => {
    console.log(`Try: http://localhost:${portNumber}`);
})