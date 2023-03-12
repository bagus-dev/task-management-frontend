import React, { useState, createContext } from "react"

export const ProjectContext = createContext()

export const ProjectProvider = props => {
    const currentUser = JSON.parse(localStorage.getItem("user"))
    const initiateUser = currentUser ? currentUser : null
    const [user, setUser] = useState(initiateUser)

    const [menuKey, setMenuKey] = useState("1")
    const [collapsed, setCollapsed] = useState(false)

    const currentSider = localStorage.getItem("siderKey")
    const initiateSider = currentSider ? currentSider : null
    const [siderKey, setSiderKey] = useState(initiateSider)

    const currentSiderOpen = localStorage.getItem("siderOpenKey")
    const initiateSiderOpen = currentSiderOpen ? currentSiderOpen : null
    const [siderOpen, setSiderOpen] = useState(initiateSiderOpen)

    const [task, setTask] = useState([])
    const [item, setItem] = useState([])

    return (
        <ProjectContext.Provider value={[user, setUser, menuKey, setMenuKey, collapsed, setCollapsed, siderKey, setSiderKey, siderOpen, setSiderOpen, task, setTask, item, setItem]}>
            {props.children}
        </ProjectContext.Provider>
    )
}