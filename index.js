const express = require('express')

const app = express()
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))
const port = 3000

app.get('/', (req, res) => {
    res.render("login")
})

app.listen(port, () => {
    console.log(`Server is running and listening at ${port}`)
})