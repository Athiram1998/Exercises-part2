import { useState, useEffect, useRef } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonsList from './components/PersonsList'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNumber] = useState('')
  const [query, setQuery] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')
  const timeoutRef = useRef(null)

  const showNotification = (message, type = 'success') => {
    setNotification(message)
    setNotificationType(type)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setNotification(null)
      timeoutRef.current = null
    }, 5000)
  }

  // useEffect(() => {
  //   axios.get('http://localhost:3001/persons')
  //     .then(response => {
  //       setPersons(response.data)
  //     }, error => {
  //       console.error('Error fetching data:', error)
  //     })
  // }, [])

     useEffect(() => {
      personService.getAll().then(initialPersons => {
        setPersons(initialPersons)
      }, error => {
         console.error('Error fetching data:', error)
      })
     }, [])

  const addNameAndNumber = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      if (existingPerson.number === newNumber) {
        alert(`${newName} is already added to phonebook`)
        return
      }

      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) return

      const updatedPerson = { ...existingPerson, number: newNumber }

      personService.update(existingPerson.id, updatedPerson).then(returnedPerson => {
        setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
        setNewName('')
        setNumber('')
        showNotification(`Updated ${returnedPerson.name}`)
      }).catch(error => {
        console.error('Error updating person:', error)
        showNotification(`Information of ${newName} has already been removed from server`, 'error')
        setPersons(persons.filter(p => p.id !== existingPerson.id))
      })
      return
    }
    const person = {
      name: newName,
      number: newNumber
    }
    personService.create(person).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNumber('')
      showNotification(`Added ${returnedPerson.name}`)
    }, error => {
      console.error('Error adding person:', error)
      showNotification('Failed to add person', 'error')
    })
  }

  const handleNameChange = (event) => {
     setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNumber(event.target.value)
  }

  const handleFilterQuery = (event) => {
    setQuery(event.target.value)
  }

  const handleDeletePerson = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return

    personService.deletePerson(id).then(() => {
      setPersons(persons.filter(p => p.id !== id))
      showNotification(`Deleted ${name}`)
    }).catch(error => {
      console.error('Error deleting person:', error)
      showNotification(`Information of ${name} has already been removed from server`, 'error')
      setPersons(persons.filter(p => p.id !== id))
    })
  }

  const personsToShow = persons.filter(
    person => person.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <Filter value={query} onChange={handleFilterQuery} />

      <h2>Add New</h2>
      <PersonForm
        onSubmit={addNameAndNumber}
        nameValue={newName}
        numberValue={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <PersonsList persons={personsToShow} onDelete={handleDeletePerson} />
    </div>
  )
}

export default App
