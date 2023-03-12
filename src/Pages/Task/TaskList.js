import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { useHistory } from "react-router-dom"
import { ProjectContext } from "../../Project/ProjectContext"
import { Table, Button, Space, Input, Modal, message, PageHeader, Alert } from "antd"
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons"
import Highlighter from "react-highlight-words"

const TaskList = () => {
    let history = useHistory()
    const[user, , , , , , , setSiderKey, , , task, setTask] = useContext(ProjectContext)
    let number = 1
    const [searchText, setSearchText] = useState("")
    const [searchedColumn, setSearchedColumn] = useState("")
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if(user === null) {
            history.push('/login')
        }

        const fetchTask = async () => {
            const result = await axios.get('http://localhost:8000/api/tasks', {headers: {"Authorization": "Bearer " + user.token}})

            setTask(result.data.data.slice(0).reverse().map(x => {return {id: x.id, number: number++, title: x.title, description: x.description, startDate: x.start_date, endDate: x.end_date, done: x.done, approved: x.approved}}))
        }

        fetchTask()
    }, [history, number, setTask, user])

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{padding: 8}}>
                <Input placeholder={`Search ${dataIndex}`} value={selectedKeys[0]} onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])} onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)} style={{marginBottom: 8, display: 'block'}}/>
                <Space>
                    <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{width: 90}}>Search</Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{width: 90}}>Reset</Button>
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

    const handleReset = (clearFilters) => {
        clearFilters()
        setSearchText('')
        reset()
    }

    const reset = () => {
        setIndex(index + 1)
    }

    const columns = [
        {title: 'No', dataIndex: 'number', key: 'number', sorter: (a, b) => a.number - b.number},
        {title: 'Title', dataIndex: 'title', key: 'title', sorter: (a, b) => a.title.length - b.title.length, ...getColumnSearchProps('title')},
        {title: 'Description', dataIndex: 'description', key: 'description', render: (text) => (
            <>
                {text ? text.length > 90 ? `${text.substr(0,90)}...` : text : null}
            </>
        ), sorter: (a, b) => a.description.length - b.description.length},
        {title: 'Start Date', dataIndex: 'startDate', key: 'startDate', sorter: (a, b) => a.startDate - b.startDate, ...getColumnSearchProps('startDate')},
        {title: 'End Date', dataIndex: 'endDate', key: 'endDate', sorter: (a, b) => a.endDate - b.endDate, ...getColumnSearchProps('endDate')},
        {title: 'Done', dataIndex: 'approved', key: 'approved', render: (text) => (
            <>
                {
                    text === 0 &&

                    'Not Yet'
                }
                {
                    text === 1 &&

                    'Done'
                }
            </>
        ), sorter: (a, b) => a.approved - b.approved, filters: [{text: 'Done', value: 1},{text: 'Not Yet', value: 0}], onFilter: (value, record) => String(record.approved).indexOf(value) === 0},
        {title: 'Action', key: 'action', render: (record) => (
            <Space size="middle">
                <>
                    {
                        user.role === 'user' &&

                        <>
                            {
                                record.done === 0 &&

                                <Button type="primary" shape="round" icon={<EditOutlined />} onClick={() => redirectPage('edit', record.id)}>
                                    Edit
                                </Button>
                            }
                            {
                                record.done === 1 &&

                                <Button type="primary" shape="round" icon={<EditOutlined />} disabled>
                                    Edit
                                </Button>
                            }

                            <Button type="primary" shape="round" className="btn-success" icon={<EyeOutlined />} onClick={() => redirectPage('show', record.id)}>
                                Detail
                            </Button>

                            {
                                record.done === 0 &&

                                <Button type="primary" shape="round" icon={<DeleteOutlined />} danger onClick={() => showModalConfirm(record.id)}>
                                    Delete
                                </Button>
                            }
                            {
                                record.done === 1 &&

                                <Button type="primary" shape="round" icon={<DeleteOutlined />} disabled>
                                    Delete
                                </Button>
                            }
                        </>
                    }
                    {
                        user.role === 'admin' &&

                        <Button type="primary" shape="round" className="btn-success" icon={<EyeOutlined />} onClick={() => redirectPage('approval/show', record.id)}>
                            Detail
                        </Button>
                    }
                </>
                
            </Space>
        )}
    ]

    const redirectPage = (page, id) => {
        if(id !== '') {
            history.push(`/dashboard/tasks/${page}/${id}`)
        } else {
            if(page === 'create') {
                setSiderKey('2')
                localStorage.setItem("siderKey", '2')
            }
            
            window.open(`/dashboard/tasks/${page}`, '_self')
        }
    }

    const showModalConfirm = (id) => {
        Modal.confirm({
            title: 'Are you sure want to delete the task?',
            icon: <ExclamationCircleOutlined />,
            content: 'Click OK if you\'re sure want to delete',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        axios.delete(`http://localhost:8000/api/tasks/${id}`, {headers: {"Authorization": "Bearer " + user.token}})
                            .then(() => {
                                let newTask = task.filter(el => {return el.id !== parseInt(id)})
                                resolve(setTask(newTask))
                                message.success('The task has been deleted')
                            }).catch(error => {
                                reject(message.error(error))
                            })
                    })
                }).catch(() => message.error('Oops something error!'))
            },
            onCancel() {}
        })
    }

    return (
        <>
            <PageHeader className="site-page-header" title="List Task"/>
            <hr style={{marginTop: 0}}/>

            {
                user.role === 'user' &&

                <>
                    <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={() => redirectPage('create', '')} style={{marginTop: 20}}>
                        Add New Task
                    </Button>

                    <Alert
                        message="Informational Notes"
                        description="The done status will be changed after Admin approved your task"
                        type="info"
                        showIcon
                        style={{marginTop: 30}}
                    />
                </>
            }
            {
                user.role === 'admin' &&

                <>
                    <Alert
                        message="Informational Notes"
                        description="The list of tasks that appear only those that have been completed by the user"
                        type="info"
                        showIcon
                        style={{marginTop: 30}}
                    />
                </>
            }

            <Table key={index} columns={columns} dataSource={task} style={{marginTop: 10}}/>
        </>
    )
}

export default TaskList