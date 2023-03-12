import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { useHistory, useParams } from "react-router-dom"
import { ProjectContext } from "../../Project/ProjectContext"
import { Table, Button, Space, Input, Modal, message, Descriptions, PageHeader, Card, Form, Select } from "antd"
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined, PlusOutlined, CheckCircleOutlined, CloseCircleOutlined, SaveOutlined, CheckOutlined } from "@ant-design/icons"
import Highlighter from "react-highlight-words"
import moment from "moment"

const TaskShow = () => {
    let history = useHistory()
    let { id } = useParams()
    let number = 1
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [searchedColumn, setSearchedColumn] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [user, , , , , , , , , , , , item, setItem] = useContext(ProjectContext)
    const { Option } = Select
    const [form] = Form.useForm()
    const [idTask, setIdTask] = useState(0)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [idItem, setIdItem] = useState(0)
    const [done, setDone] = useState(0)
    const [doneDate, setDoneDate] = useState("")
    const [approved, setApproved] = useState(0)
    const [approvedDate, setApprovedDate] = useState("")
    const [itemNotYet, setItemNotYet] = useState(0)
    const [itemDone, setItemDone] = useState(0)
    const [fields, setFields] = useState([])
    const [type, setType] = useState("")
    const [no, setNo] = useState(0)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

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
            setStartDate(data.start_date)
            setEndDate(data.end_date)
            setDone(data.done)
            setDoneDate(data.done_date)
            setApproved(data.approved)
            setApprovedDate(data.approved_date)
        }

        const fetchItem = async () => {
            const result = await axios.get(`http://localhost:8000/api/items/${id}`, {headers: {"Authorization": "Bearer " + user.token}})

            setItem(result.data.data.map(x => {return {key: x.id, number: number++, title: x.title, priority: x.priority, done: x.done, doneDate: moment(x.updated_at).format("YYYY-MM-DD hh:mm:ss")}}))
            setItemNotYet(result.data.other.item_not_yet)
            setItemDone(result.data.other.item_done)
        }

        fetchTask()
        fetchItem()
    }, [id, user, history, number, setItem])

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{padding: 8}}>
                <Input placeholder={`Search ${dataIndex}`} value={selectedKeys[0]} onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])} onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)} style={{marginBottom: 8, display: 'block'}}/>
                <Space>
                    <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{width: 90}}>Search</Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters, confirm)} size="small" style={{width: 90}}>Reset</Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
        onFilter: (value, record) => record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        render: text => searchedColumn === dataIndex ? (
            <Highlighter highlightStyle={{backgroundColor: '#ffc069', padding: 0}} searchWords={[searchText]} autoEscape textToHighlight={text ? text.toString() : ''}/>
        ) : (
            text
        )
    })

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm()
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    const handleReset = (clearFilters, confirm) => {
        clearFilters()
        setSearchText('')
        confirm()
    }

    const showModalDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure want to delete the item?',
            icon: <ExclamationCircleOutlined />,
            content: 'Click OK if you\'re sure want to delete',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        axios.delete(`http://localhost:8000/api/items/${id}`, {headers: {"Authorization": "Bearer " + user.token}})
                            .then(() => {
                                let newItem = item.filter(el => {return el.key !== parseInt(id)})
                                resolve(setItem(newItem))
                                message.success('The item has been deleted')
                            }).catch(error => {
                                reject(message.error(error))
                            })
                    })
                }).catch(() => message.error('Oops something error!'))
            },
            onCancel() {}
        })
    }

    const columns = [
        {title: 'No', dataIndex: 'number', sorter: (a, b) => a.number - b.number},
        {title: 'Title', dataIndex: 'title', sorter: (a, b) => a.title.length - b.title.length, ...getColumnSearchProps('title')},
        {title: 'Priority', dataIndex: 'priority', render: (text) => (
            <>
                {
                    // eslint-disable-next-line
                    text == 1 &&

                    <>
                        Very High
                    </>
                }
                {
                    // eslint-disable-next-line
                    text == 2 &&

                    <>
                        High
                    </>
                }
                {
                    // eslint-disable-next-line
                    text == 3 &&

                    <>
                        Medium
                    </>
                }
                {
                    // eslint-disable-next-line
                    text == 4 &&

                    <>
                        Low
                    </>
                }
                {
                    // eslint-disable-next-line
                    text == 5 &&

                    <>
                        Very Low
                    </>
                }
            </>
        ), sorter: (a, b) => a.priority - b.priority},
        {title: 'Done', dataIndex: 'done', render: (text) => (
            <>
                {
                    text === 0 &&

                    <>
                        <Button type="primary" danger shape="round" icon={<CloseCircleOutlined />}>
                            Not Yet
                        </Button>
                    </>
                }
                {
                    text === 1 &&

                    <>
                        <Button type="primary" shape="round" icon={<CheckCircleOutlined />}>
                            Done
                        </Button>
                    </>
                }
            </>
        ), sorter: (a, b) => a.done - b.done, filters: [{text: 'Done', value: 1},{text: 'Not Yet', value: 0}], onFilter: (value, record) => String(record.done).indexOf(value) === 0},
        {title: 'Action', render: (record) => (
            <Space>
                <>
                    {
                        record.done === 0 &&

                        <>
                            <Button type="primary" className="btn-warning" shape="round" icon={<EditOutlined />} onClick={() => modalEdit(record)}>
                                Edit
                            </Button>
                            <Button type="primary" danger shape="round" icon={<DeleteOutlined />} onClick={() => showModalDelete(record.key)}>
                                Delete
                            </Button>
                        </>
                    }
                    {
                        record.done === 1 &&

                        <>
                            <Button type="primary" shape="round" icon={<EditOutlined />} disabled>
                                Edit
                            </Button>
                            <Button type="primary" danger shape="round" icon={<DeleteOutlined />} disabled>
                                Delete
                            </Button>
                        </>
                    }
                </>
            </Space>
        )}
    ]

    const columns2 = [
        {title: 'No', dataIndex: 'number', sorter: (a, b) => a.number - b.number},
        {title: 'Title', dataIndex: 'title', sorter: (a, b) => a.title.length - b.title.length, ...getColumnSearchProps('title')},
        {title: 'Priority', dataIndex: 'priority', render: (text) => (
            <>
                {
                    // eslint-disable-next-line
                    text == 1 &&

                    <>
                        Very High
                    </>
                }
                {
                    // eslint-disable-next-line
                    text == 2 &&

                    <>
                        High
                    </>
                }
                {
                    // eslint-disable-next-line
                    text == 3 &&

                    <>
                        Medium
                    </>
                }
                {
                    // eslint-disable-next-line
                    text == 4 &&

                    <>
                        Low
                    </>
                }
                {
                    // eslint-disable-next-line
                    text == 5 &&

                    <>
                        Very Low
                    </>
                }
            </>
        ), sorter: (a, b) => a.priority - b.priority},
        {title: 'Done', dataIndex: 'done', render: (text) => (
            <>
                {
                    text === 0 &&

                    <>
                        <Button type="primary" danger shape="round" icon={<CloseCircleOutlined />}>
                            Not Yet
                        </Button>
                    </>
                }
                {
                    text === 1 &&

                    <>
                        <Button type="primary" shape="round" icon={<CheckCircleOutlined />}>
                            Done
                        </Button>
                    </>
                }
            </>
        ), sorter: (a, b) => a.done - b.done, filters: [{text: 'Done', value: 1},{text: 'Not Yet', value: 0}], onFilter: (value, record) => String(record.done).indexOf(value) === 0},
        {title: 'Done Date', dataIndex: 'doneDate', sorter: (a, b) => a.doneDate - b.doneDate, ...getColumnSearchProps('doneDate')},
        {title: 'Action', render: (record) => (
            <Space>
                <>
                    {
                        record.done === 0 &&

                        <>
                            <Button type="primary" className="btn-warning" shape="round" icon={<EditOutlined />} onClick={() => modalEdit(record)}>
                                Edit
                            </Button>
                            <Button type="primary" danger shape="round" icon={<DeleteOutlined />} onClick={() => showModalDelete(record.key)}>
                                Delete
                            </Button>
                        </>
                    }
                    {
                        record.done === 1 &&

                        <>
                            <Button type="primary" shape="round" icon={<EditOutlined />} disabled>
                                Edit
                            </Button>
                            <Button type="primary" danger shape="round" icon={<DeleteOutlined />} disabled>
                                Delete
                            </Button>
                        </>
                    }
                </>
            </Space>
        )}
    ]

    const modalEdit = (record) => {
        setFields(
            [{
                name: ['title'], value: record.title
            },
            {
                name: ['priority'], value: record.priority.toString()
            }]
        )

        setType("edit")
        setIsModalOpen(true)
        setIdItem(record.key)
        setNo(record.number)
    }

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys)
    }

    const rowSelection = {
        onChange: onSelectChange,
        getCheckboxProps: (record) => ({
            disabled: record.done === 1,
            name: record.key,
            value: record.key
        })
    }

    const onSave = () => {
        if(selectedRowKeys.length === 0) {
            Modal.error({
                title: 'There are no selected rows!',
                content: 'You have to select more than or equal to 1 checkbox from the table'
            })
        } else {
            setLoading(true)

            const values = {
                // eslint-disable-next-line
                'keys': JSON.stringify(selectedRowKeys).replace(/[\[\]']+/g,''),
                'task_id': id
            }

            console.log(values)

            axios.patch(`http://localhost:8000/api/items/done`, values, {headers: {"Authorization": "Bearer " + user.token}})
            .then(() => {
                setLoading(false)

                message.success('Item Updated Successfully!')
                setTimeout(function() {window.location.reload()}, 500)
            }).catch(err => {
                if(err.response.data.message) {
                    message.error(err.response.data.message)
                } else {
                    message.error(err.message)
                }

                setLoading(false)
            })
        }
    }

    const onFinish = async () => {
        setLoading(true)

        try {
            const values = await form.validateFields()
            values.task_id = id

            if(type === "add") {

                axios.post('http://localhost:8000/api/items', values, {headers: {"Authorization": "Bearer " + user.token}})
                    .then(() => {
                        form.resetFields()
                        setLoading(false)
                        message.success('Item Added Successfully!')
                        setIsModalOpen(false)

                        setTimeout(function() {window.location.reload()}, 500)
                    }).catch(err => {
                        form.resetFields()
                        if(err.response.data.message) {
                            message.error(err.response.data.message)
                        } else {
                            message.error(err.message)
                        }
        
                        setLoading(false)
                    })
            } else if(type === "edit") {
                values.id = idItem
                values.no = no

                axios.patch(`http://localhost:8000/api/items/${idItem}`, values, {headers: {"Authorization": "Bearer " + user.token}})
                    .then((response) => {
                        form.resetFields()
                        setItem(item.map(x => x.key !== idItem ? x : response.data.data))

                        setLoading(false)
                        message.success('Item Updated Successfully!')
                        setIsModalOpen(false)
                    }).catch(err => {
                        form.resetFields()
                        if(err.response.data.message) {
                            message.error(err.response.data.message)
                        } else {
                            message.error(err.message)
                        }

                        setLoading(false)
                    })
            }
        } catch(err) {
            setLoading(false)
        }
    }

    const onFinishFailed = (errorInfo) => {
        let length = errorInfo.errorFields.length

        for(let i=0; i < length; i++) {
            message.error(errorInfo.errorFields[i].errors[0])
        }
    }

    const onOpen = () => {
        setType("add")
        setIsModalOpen(true)
    }

    const onClose = () => {
        form.resetFields()
        setIsModalOpen(false)
    }

    const onDone = () => {
        const values = {
            'id': id
        }

        Modal.confirm({
            title: 'Are you sure want to done the task?',
            icon: <ExclamationCircleOutlined />,
            content: 'Please note that Admin will have to approve your task',
            async onOk() {
                try {
                    return await new Promise((resolve, reject) => {
                        setTimeout(() => {
                            axios.patch(`http://localhost:8000/api/tasks/done`, values, { headers: { "Authorization": "Bearer " + user.token } })
                                .then((response) => {
                                    resolve(
                                        setDone(1),
                                        setDoneDate(response.data.data.done_date)
                                    )
                                    message.success('The task has been done')
                                }).catch(error => {
                                    reject(message.error(error))
                                })
                        })
                    })
                } catch {
                    return await message.error('Oops something error!')
                }
            },
            onCancel() {}
        })
    }

    const onApprove = () => {
        const values = {
            'id': id
        }

        Modal.confirm({
            title: 'Are you sure want to approve the task?',
            icon: <ExclamationCircleOutlined />,
            content: 'Click OK to continue',
            async onOk() {
                try {
                    return await new Promise((resolve, reject) => {
                        setTimeout(() => {
                            axios.patch(`http://localhost:8000/api/tasks/done`, values, { headers: { "Authorization": "Bearer " + user.token } })
                                .then((response) => {
                                    resolve(
                                        setApproved(1),
                                        setApprovedDate(response.data.data.approved_date)
                                    )
                                    message.success('The task has been approved')
                                }).catch(error => {
                                    reject(message.error(error))
                                })
                        })
                    })
                } catch {
                    return await message.error('Oops something error!')
                }
            },
            onCancel() {}
        })
    }

    return(
        <>
            <PageHeader className="site-page-header" title="Detail Task" onBack={() => history.goBack()}/>
            <hr style={{marginTop: 0}}/>

            <Card style={{marginTop: 30}}>
                <Descriptions title="Task Info">
                    <Descriptions.Item label="Title">{title}</Descriptions.Item>
                    <Descriptions.Item label="Description">{description}</Descriptions.Item>
                    <Descriptions.Item label="Start Date">{startDate}</Descriptions.Item>
                    <Descriptions.Item label="End Date">{endDate}</Descriptions.Item>
                    <Descriptions.Item label="Done">
                        {
                            done === 0 &&

                            'Not Yet'
                        }
                        {
                            done === 1 &&

                            'Yes'
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Done Date">{doneDate === null ? '-' : doneDate}</Descriptions.Item>
                    <Descriptions.Item label="Approved">
                        {
                            approved === 0 &&

                            'Not Yet'
                        }
                        {
                            approved === 1 &&

                            'Yes'
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Approved Date">{approvedDate === null ? '-' : approvedDate}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Space size="middle" style={{marginTop: 50}}>
                {
                    user.role === 'user' &&

                    <>
                        {
                            done === 0 &&

                            <Button shape="round" icon={<PlusOutlined />} onClick={onOpen}>
                                Add New Item
                            </Button>
                        }
                        {
                            done === 1 &&

                            <Button shape="round" icon={<PlusOutlined />} disabled>
                                Add New Item
                            </Button>
                        }
                        
                        {
                            item.length > 0 &&

                            <>
                                {
                                    itemDone !== item.length &&

                                    <>
                                        <Button type="primary" shape="round" icon={<SaveOutlined />} onClick={onSave} loading={loading}>Save</Button>
                                        <Button type="primary" shape="round" icon={<CheckOutlined />} disabled>Done</Button>
                                    </>
                                }
                                {
                                    itemDone === item.length &&

                                    <>
                                        <Button type="primary" shape="round" icon={<SaveOutlined />} htmlType="submit" disabled>Save</Button>

                                        <>
                                            {
                                                done === 0 &&

                                                <>
                                                    <Button type="primary" shape="round" className="btn-success" icon={<CheckOutlined />} onClick={onDone}>Done</Button>
                                                </>
                                            }
                                            {
                                                done === 1 &&

                                                <>
                                                    <Button type="primary" shape="round" icon={<CheckOutlined />} disabled>Done</Button>
                                                </>
                                            }
                                        </>
                                    </>
                                }
                            </>
                        }
                        {
                            item.length === 0 &&

                            <>
                                <Button type="primary" shape="round" icon={<SaveOutlined />} htmlType="submit" disabled>Save</Button>
                                <Button type="primary" shape="round" icon={<CheckOutlined />} disabled>Done</Button>
                            </>
                        }
                    </>
                }
                {
                    user.role === 'admin' &&

                    <>
                        {
                            approved === 0 &&

                            <Button type="primary" shape="round" className="btn-success" icon={<CheckOutlined />} onClick={onApprove}>Approve</Button>
                        }
                        {
                            approved === 1 &&

                            <Button type="primary" shape="round" icon={<CheckOutlined />} disabled>Approved</Button>
                        }
                    </>
                }
            </Space>

            {
                user.role === 'user' &&

                <Table rowSelection={{type: 'checkbox', ...rowSelection}} columns={columns} dataSource={item} style={{marginTop: 20}}/>
            }
            {
                user.role === 'admin' &&

                <Table rowSelection={{type: 'checkbox', ...rowSelection}} columns={columns2} dataSource={item} style={{marginTop: 20}}/>
            }

            <Modal open={isModalOpen} title="Create a new item" okText="Submit" cancelText="Cancel" onCancel={onClose} onOk={onClose}
                footer={[
                    <Button key="back" shape="round" onClick={onClose}>Cancel</Button>,
                    <Button type="primary" shape="round" icon={<SaveOutlined />} htmlType="submit" onClick={onFinish} loading={loading}>Submit</Button>
                ]}
            >
                <Form form={form} name="form_in_modal" layout="vertical" fields={fields} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item label="Title" name="title" rules={[{required: true, message: 'Please input title!'},{type: 'string', message: 'Title must be a string!'}]} hasFeedback>
                        <Input placeholder="Title"/>
                    </Form.Item>
                    <Form.Item label="Priority" name="priority" rules={[{required: true, message: 'Please select priority!'}]} hasFeedback>
                        <Select placeholder="Please select priority">
                            <Option value="1">Very High</Option>
                            <Option value="2">High</Option>
                            <Option value="3">Medium</Option>
                            <Option value="4">Low</Option>
                            <Option value="5">Very Low</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default TaskShow