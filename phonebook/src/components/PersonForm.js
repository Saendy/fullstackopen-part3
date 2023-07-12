const PersonForm = (props) => {
    return (
        <form onSubmit={props.submitHandler}>
            <div>name: <input onChange={props.newNameHandler} /></div>
            <div>number: <input onChange={props.newNumberHandler}/></div>
            <div><button type="submit">add</button></div>
        </form>
    )
}
export default PersonForm