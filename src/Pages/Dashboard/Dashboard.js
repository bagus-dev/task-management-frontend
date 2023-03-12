import React, { useContext, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { ProjectContext } from "../../Project/ProjectContext"

const Dashboard = () => {
    let history = useHistory()
    const [user] = useContext(ProjectContext)

    useEffect(() => {
        if(user === null) {
            history.push('/login')
        }
    })

    return (
        <>
            <h1 style={{fontSize: '30pt'}}>Dashboard</h1>
            <hr style={{marginTop: '-20px'}}/>

            <h1 style={{marginTop: '20px', fontSize: '15pt'}}>Welcome to Dashboard!</h1>
            <p style={{marginTop: '20px'}}>
                <b>Your name:</b> {user.name}
                <br/>
                <b>Your email:</b> {user.email}
                <br/>
                <b>Your role:</b> {user.role}
            </p>
        </>
    )
}

export default Dashboard