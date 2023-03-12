import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { useHistory, useParams } from "react-router-dom"
import { ProjectContext } from "../../Project/ProjectContext"
import { Row, Col, Form, Input, Button, message, DatePicker, PageHeader } from "antd"
import moment from "moment"
import { SaveOutlined } from "@ant-design/icons"

const TaskEdit = () => {
    let history = useHistory()
    const { RangePicker } = DatePicker
    let { id } = useParams()
    const [loading, setLoading] = useState(false)
    const[user] = useContext(ProjectContext)
    const [idTask, setIdTask] = useState(0)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [rangeDate, setRangeDate] = useState([])

    useEffect(() => {
        if(user === null) {
            history.push('/login')
        }

        const fetchTask = async () => {
            const result = await axios.get(`http://localhost:8000/api/tasks/${id}`, {headers: {"Authorization": "Bearer " + user.token}})
            const data = result.data.data

            setIdTask(data.id)
            setTitle(data.title)
            setDescription(data.description)
            setRangeDate([moment(data.start_date), moment(data.end_date)])
        }

        fetchTask()
    }, [id, history, user])

    const onFinish = (fieldsValue) => {
        setLoading(true)

        const values = {
            'title': fieldsValue['title'],
            'description': fieldsValue['description'],
            'start_date': fieldsValue['range'][0].format("YYYY-MM-DD"),
            'end_date': fieldsValue['range'][1].format("YYYY-MM-DD")
        }

        axios.patch(`http://localhost:8000/api/tasks/${id}`, values, {headers: {"Authorization": "Bearer " + user.token}})
            .then(() => {
                setLoading(false)

                message.success('Task Updated Successfully!')
                history.push('/dashboard/tasks/list')
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
            <PageHeader className="site-page-header" title="Edit Task" onBack={() => history.goBack()}/>
            <hr style={{marginTop: 0}}/>

            <Form layout="vertical"
                fields={
                    [{
                        name: ['title'], value: title
                    },
                    {
                        name: ['description'], value: description
                    },
                    {
                        name: ['range'], value: rangeDate
                    }]
                } initialValues={{layout: 'vertical'}} style={{marginTop: 30}} onFinish={onFinish} onFinishFailed={onFinishFailed}>
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
                        <Button type="primary" shape="round" icon={<SaveOutlined />} htmlType="submit" loading={loading}>Submit</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default TaskEdit