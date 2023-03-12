import { useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import { ProjectContext  } from "../../Project/ProjectContext"

const Home = () => {
    let history = useHistory()
    const [user] = useContext(ProjectContext)

    useEffect(() => {
        if(user === null) {
            history.push('/login')
        } else {
            history.push('/dashboard')
        }
    }, [history, user])

    return (
        null
    )
}

export default Home