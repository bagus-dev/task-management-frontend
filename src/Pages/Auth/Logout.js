import { useEffect, useContext } from "react"
import { ProjectContext  } from "../../Project/ProjectContext"

const Logout = () => {
    const [ , setUser, , setMenuKey] = useContext(ProjectContext)

    useEffect(() => {
        setUser(null)
        setMenuKey('1')

        localStorage.removeItem("siderKey")
        localStorage.removeItem("siderOpen")
        localStorage.removeItem("user")
        localStorage.setItem("menuKey", '1')

        window.open('/login', '_self')
    }, [setMenuKey, setUser])

    return (
        null
    )
}

export default Logout