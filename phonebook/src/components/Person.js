const Person = (props) => {
    return (
        <li>{props.person.name} {props.person.number} <button onClick={props.deleteHandler} value={props.person.id}>delete</button></li>
    )
}
export default Person