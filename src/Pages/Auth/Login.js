import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { useHistory } from "react-router-dom"
import { ProjectContext } from "../../Project/ProjectContext"
import { Row, Col, Form, Input, Button, message } from "antd"

const Login = () => {
    let history = useHistory()
    const [user, setUser, , setMenuKey, , , , setSiderKey] = useContext(ProjectContext)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(user !== null) {
            history.push('/dashboard')
        }
    })

    const onFinish = (values) => {
        setLoading(true)

        axios.get('http://localhost:8000/sanctum/csrf-cookie')
            .then(() => {
                axios.post("http://localhost:8000/api/login", values)
                    .then((res) => {
                        let user = res.data.user
                        let token = res.data.token
                        let role = res.data.role
                        let currentUser = {name: user.name, email: user.email, token, role}

                        setUser(currentUser)
                        localStorage.setItem("user", JSON.stringify(currentUser))

                        setMenuKey('2')
                        localStorage.setItem("menuKey", '2')

                        setSiderKey('1')
                        localStorage.setItem("siderKey", '1')

                        localStorage.setItem("siderOpen", '')

                        setLoading(false)

                        window.open('/dashboard', '_self')
                    }).catch((err) => {
                        if(err.response.data.message) {
                            message.error(err.response.data.message)
                        } else {
                            message.error(err.message)
                        }

                        setLoading(false)
                    })
            })
            .catch((err) => {
                if(err.response.data.message) {
                    message.error(err.response.data.message)
                } else {
                    message.error(err.message)
                }

                setLoading(false)
            })
    }

    const onFinishFailed = (errorInfo) => {
        let length = errorInfo.errorFields.length

        for(let i=0; i < length; i++) {
            message.error(errorInfo.errorFields[i].errors[0])
        }
    }

    return (
        <>
            <Row gutter={16} style={{marginTop: '50px'}}>
                <Col span={8} offset={8}>
                    <h1 style={{fontSize: '30pt'}}>Login Form</h1>
                    <hr style={{marginTop: '-10px'}}/>

                    <Form layout="vertical" initialValues={{layout: 'vertical'}} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                        <Form.Item label="Email" name="email" rules={[{required: true, message: 'Please input your email!'}, {type: "email", message: 'Your input is invalid!'}]} hasFeedback>
                            <Input placeholder="Your Email"/>
                        </Form.Item>
                        <Form.Item label="Password" name="password" style={{marginTop: '10px'}} rules={[{required: true, message: 'Please input your password!'}]} hasFeedback>
                            <Input.Password placeholder="Your Password"/>
                        </Form.Item>
                        <Form.Item style={{marginTop: '10px'}}>
                            <Button type="primary" htmlType="submit" shape="round" loading={loading}>Submit</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    )
}

export default Login