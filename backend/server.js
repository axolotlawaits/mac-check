import express from 'express'
import cors from 'cors'
import { spawn } from "child_process" 
import pg from 'pg'


const app = express()
const { Pool } = pg

const pool = new Pool({
  user: 'postgres',
  password: '12345',
  host: '10.0.150.88',
  port: 5432, 
  database: 'Inv'
})

app.use(cors())
app.use(express.json())

app.get('/mac/:id', async (req, res) => {
  const mac  = req.params.id
  const orderby = 'device.lastseen DESC'
  pool.query('SELECT device.mac, device.lastseen, device_connect.port, unit.ip FROM device JOIN device_connect ON device.id = device_connect.device_id JOIN unit ON unit.uuid = device_connect.switch WHERE cast(mac as varchar) like $1 ORDER BY device.lastseen DESC', [`%${mac}%`], (err, result) => {
    if (err) {
      res.status(400).json({error: 'ошибка запроса'})
    } else {
      console.log(result.rows)
      res.status(200).json(result.rows)
    }
  })
})

// const testRead = async () => {
//   const mac = '3c:7c:3f:11:70:f2'
//   const id = '1000054'
//   pool.query('SELECT device.id, device.mac, device.lastseen, device_connect.port, device_connect.switch, unit.ip FROM device JOIN device_connect ON device.id = device_connect.device_id JOIN unit ON unit.uuid = device_connect.switch WHERE cast(mac as varchar) like $1', [`%${mac}%`], (err, result) => {
//     console.log(result.rows)
//   })
// }

// testRead()

app.listen(5000, function() { 
  console.log('server running on port 5000')
}) 