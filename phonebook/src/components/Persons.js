import Person from "./Person"

const Persons = (props) => {

let filteredPersons = props.persons.filter((person) => {return(person.name.toLowerCase().includes(props.filter.toLowerCase()))})

return (
    <ul>
        {filteredPersons.map((person) => {
            return(<Person deleteHandler={props.deleteHandler} person={person} key={person.id} />)
        })}
    </ul>
)
}
export default Persons