const Error = (props) => {
    if(props.error === null) {
        return null
    }
    return (
        <div className="error">{props.error}</div>
    )
}
export default Error