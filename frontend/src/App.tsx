import { useState } from 'react'
import './App.css'
import { Input, Button, Table, Center, Group, UnstyledButton, Text, Notification } from '@mantine/core'
import { API } from './constants'
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

type RawData = {
  mac: string
  ip: string
  port: string
  lastseen: string
  count: string
}

type ThProps = {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort: () => void
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className='th'>
      <UnstyledButton onClick={onSort} className='control'>
        <Group justify="space-between">
          <Text fw={700} fz="sm">
            {children}
          </Text>
          <Center className='icon'>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function App() {
  const [mac, setMac] = useState('')
  const [searchResult, setSearchResult] = useState<RawData[]>([])
  const [sortBy, setSortBy] = useState<keyof RawData | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)
  const [notification, setNotification] = useState('')

  const rows = searchResult.map((result: RawData, id) => (
    <Table.Tr key={id}>
      <Table.Td>{result.mac}</Table.Td>
      <Table.Td>{result.ip}</Table.Td>
      <Table.Td>{result.port}</Table.Td>
      <Table.Td>{format(new Date(result.lastseen), "PPpp", { locale: ru })}</Table.Td>
    </Table.Tr>
  ));

  const getIp = async () => {
    const res = await fetch(`${API}/mac/${mac}`)
    const json = await res.json()
    if (res.ok) {
      if (json.length === 0) {
        notify('ничего не найдено')
      }
      setSearchResult(json)
    } 
  }

  const setSorting = (field: keyof RawData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false
    setReverseSortDirection(reversed);
    setSortBy(field)
    setSearchResult(sortData(searchResult, { sortBy: field, reversed }))
  }

  const notify = (text: string) => {
    setNotification(text)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  return (
    <div id='page-wrapper'>
      <Input value={mac} onChange={(e) => setMac(e.target.value)} placeholder="Введите MAC-адрес" leftSection={<IconSearch size={16} />} />
      <div className='buttons-wrapper'>
        <Button onClick={getIp} variant="filled" fullWidth>найти</Button>
        <Button onClick={() => {setSearchResult([]), setMac('')}} variant="outline" fullWidth >очистить</Button>
      </div>
      {searchResult.length > 0 &&
        <>
          <h1 className='main-heading'>
            <span>Найдено MAC-адресов: {searchResult[0].count}</span>
            <span>{searchResult[0].count === searchResult.length.toString() ? '' : `, показано: ${searchResult.length}`}</span>
          </h1>
          <Table highlightOnHover stickyHeader >
            <Table.Thead>
              <Table.Tr>
                <Th 
                  sorted={sortBy === 'mac'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('mac')}
                >
                  mac
                </Th>
                <Th
                  sorted={sortBy === 'ip'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('ip')}
                >
                  ip
                </Th>
                <Th
                  sorted={sortBy === 'port'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('port')}
                >
                  port
                </Th>
                <Th
                  sorted={sortBy === 'lastseen'}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting('lastseen')}
                >
                  last seen
                </Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </>
      }
      {notification &&
        <Notification 
          style={{position: 'fixed', bottom: '50px', right: '15%'}} 
          withCloseButton={false}
        >
          <h1 className='main-heading'>{notification}</h1>
        </Notification>
      }
    </div>
  )
}

function sortData(
  data: RawData[],
  payload: { sortBy: keyof RawData | null, reversed: boolean }
) {
  const { sortBy } = payload

  if (!sortBy) {
    return data
  }

  return [...data].sort((a, b) => {
    if (payload.reversed) {
      return b[sortBy].localeCompare(a[sortBy])
    }
    return a[sortBy].localeCompare(b[sortBy])
  })
}

export default App
