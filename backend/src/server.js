const express = require('express')
const cors = require('cors')

const markupRoutes = require('./routes/markup')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/MKP', markupRoutes)

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})