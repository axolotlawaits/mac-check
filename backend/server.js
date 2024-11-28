import express from 'express'
import cors from 'cors'
import pg from 'pg'
import 'dotenv/config'

const app = express()
const { Pool } = pg

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASS,
  host: process.env.HOST,
  port: 5432, 
  database: 'Inv'
})

app.use(cors())
app.use(express.json())

app.get('/mac-checker/mac/:id', async (req, res) => {
  const mac = req.params.id
  pool.query(
    `
    SELECT device.mac, device.lastseen, device_connect.port, unit.ip,
    count(*) OVER() 
    FROM device 
    JOIN device_connect ON device.id = device_connect.device_id 
    JOIN unit ON unit.uuid = device_connect.switch 
    WHERE cast(mac as varchar) like $1 
    ORDER BY device.lastseen DESC 
    LIMIT 300
    `, 
    [`%${mac}%`], (err, result) => {
    if (err) {
      console.log(err)
      res.status(400).json({error: 'ошибка запроса'})
    } else {
      console.log(result)
      res.status(200).json(result.rows)
    }
  })
})

app.listen(4000, function() { 
  console.log('server running on port 4000')
}) 