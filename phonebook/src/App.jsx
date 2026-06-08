import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonsList from './components/PersonsList'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas',
      number: '12345-00123'
    }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNumber] = useState('')
  const [query, setQuery] = useState('')

  const addNameAndNumber = (event) => {
    event.preventDefault()

    const isExists = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    )

    if(isExists){
      alert(`${newName} is already added to phonebook`)
      return
    }
    const person = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(person))
    setNewName('')
    setNumber('')
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

  const personsToShow = persons.filter(
    person => person.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
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
      <PersonsList persons={personsToShow} />
    </div>
  )
}

export default App