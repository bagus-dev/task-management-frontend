import React, { useContext, useEffect, useState} from "react"
import axios from "axios"
import { useHistory } from "react-router-dom"
import { ProjectContext } from "../../Project/ProjectContext"
import { Row, Col, Form, Input, Button, message, DatePicker, PageHeader } from "antd"
import { SaveOutlined } from "@ant-design/icons"

const TaskCreate = () => {
    let history = useHistory()
    const [user, , , , , , , setSiderKey] = useContext(ProjectContext)
    const { RangePicker } = DatePicker
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(user === null) {
            history.push('/login')
        }
    })

    const onFinish = (fieldsValue) => {
        setLoading(true)

        const values = {
            'title': fieldsValue['title'],
            'description': fieldsValue['description'],
            'start_date': fieldsValue['range'][0].format("YYYY-MM-DD"),
            'end_date': fieldsValue['range'][1].format("YYYY-MM-DD")
        }

        axios.post("http://localhost:8000/api/tasks", values, {headers: {"Authorization": "Bearer " + user.token}})
            .then(() => {
                setLoading(false)
                setSiderKey('3')
                localStorage.setItem("siderKey", '3')

                message.success('Task Created Successfully!')

                window.open('/dashboard/tasks/list', '_self')
            }).catch(err => {
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
            <PageHeader className="site-page-header" title="Create Task"/>
            <hr style={{marginTop: 0}}/>

            <Form layout="vertical" initialValues={{layout: 'vertical'}} style={{marginTop: 30}} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <Row gutter={16}>
                    <Col className="gutter-row" span={24}>
                        <Form.Item label="Title" name="title" rules={[{required: true, message: 'Please input title!'},{type: 'string', message: 'Title must be a string!'}]} hasFeedback>
                            <Input placeholder="Title"/>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <Form.Item label="Description" name="description" rules={[{required: true, message: 'Please input description!'}, {type: 'string', message: 'Description must be a string!'}]} hasFeedback>
                            <Input.TextArea placeholder="Description" style={{height: 100}}/>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={24}>
                        <Form.Item label="Date Project Range" name="range" rules={[{required: true, message: 'Please input date range!'}]} hasFeedback>
                            <RangePicker style={{width: '100%'}}/>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={24} style={{marginTop: 10}}>
                        <Form.Item>
                            <Button type="primary" shape="round" icon={<SaveOutlined />} htmlType="submit" loading={loading}>Submit</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default TaskCreate