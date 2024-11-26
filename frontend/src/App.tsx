import { useState } from 'react'
import './App.css'
import { Input, Button, Table } from '@mantine/core'
import { API } from './constants'
import moment from 'moment'
import 'moment/dist/locale/ru'

function App() {
  const [mac, setMac] = useState('')
  const [searchResult, setSearchResult] = useState([])

  const rows = searchResult.map((result) => (
    <Table.Tr key={result.id}>
      <Table.Td>{result.mac}</Table.Td>
      <Table.Td>{result.ip}</Table.Td>
      <Table.Td>{result.port}</Table.Td>
      <Table.Td>{moment(result.lastseen).format('LLL')}</Table.Td>
    </Table.Tr>
  ));

  const getIp = async () => {
    const res = await fetch(`${API}/mac/${mac}`)
    const json = await res.json()
    if (res.ok) {
      setSearchResult(json)
      console.log(json)
    }
  }

  return (
    <div id='page-wrapper'>
      <Input value={mac} onChange={(e) => setMac(e.target.value)} placeholder="Введите MAC-адрес" />
      <div className='buttons-wrapper'>
        <Button onClick={getIp} variant="filled" fullWidth>найти</Button>
        <Button onClick={() => {setSearchResult([]), setMac('')}} variant="outline" fullWidth >очистить</Button>
      </div>
      {searchResult.length > 0 &&
        <>
          <h1 className='main-heading'>{`Найдено MAC-адресов: ${searchResult.length}`}</h1>
          <Table highlightOnHover stickyHeader >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>mac</Table.Th>
                <Table.Th>ip</Table.Th>
                <Table.Th>port</Table.Th>
                <Table.Th>last seen</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </>
      }
    </div>
  )
}

export default App
