import React, { useContext, useEffect } from "react"
import { Switch, Route, BrowserRouter as Router, Link } from "react-router-dom"
import { ProjectContext, ProjectProvider } from "../Project/ProjectContext"
import { Layout, Menu } from "antd"
import { UserOutlined, DashboardOutlined, ExportOutlined, PlusCircleOutlined, OrderedListOutlined, ScheduleOutlined, CheckCircleOutlined } from "@ant-design/icons"
import Login from "../Pages/Auth/Login"
import Dashboard from "../Pages/Dashboard/Dashboard"
import Logout from "../Pages/Auth/Logout"
import Home from "../Pages/Home/Home"
import TaskCreate from "../Pages/Task/TaskCreate"
import TaskList from "../Pages/Task/TaskList"
import TaskEdit from "../Pages/Task/TaskEdit"
import TaskShow from "../Pages/Task/TaskShow"

const Routes = () => {
    const [user, , menuKey, setMenuKey, collapsed, setCollapsed, siderKey, setSiderKey, siderOpen, setSiderOpen] = useContext(ProjectContext)
    const { Header, Content, Footer, Sider } = Layout
    const { SubMenu } = Menu
    const rootSubmenuKeys = ['sub1']

    useEffect(() => {
        const localKey = localStorage.getItem("menuKey")

        if(localKey !== null) {
            setMenuKey(localKey)
        } else {
            setMenuKey(menuKey)
        }
    })

    const handleMenu = (e) => {
        setMenuKey(e.key)
        localStorage.setItem("menuKey", e.key)

        if(e.key !== '2') {
            if(siderKey !== null) {
                setSiderKey(null)
                localStorage.removeItem("siderKey")
            }
        } else {
            setSiderKey('1')
            localStorage.setItem("siderKey", '1')
        }
    }

    const onCollapse = (collapsed) => {
        setCollapsed(collapsed)
    }

    const handleSider = (e) => {
        setSiderKey(e.key)
        localStorage.setItem("siderKey", e.key)

        if(e.key === '2' || e.key === '3') {
            setSiderOpen('sub1')
            localStorage.setItem("siderOpenKey", 'sub1')
        } else {
            setSiderOpen(null)
            localStorage.setItem("siderOpenKey", '')
        }
    }

    const onOpenChange = keys => {
        const latestOpenKey = siderOpen !== null ? keys.find(key => siderOpen.indexOf(key) === -1) : null

        if(rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setSiderOpen(keys)
            localStorage.setItem("siderOpenKey", keys)
        } else {
            setSiderOpen(latestOpenKey ? latestOpenKey : null)
            localStorage.setItem("siderOpenKey", '')
        }
    }

    return(
        <ProjectProvider>
            <Router>
                <Layout>
                    <Header className="header">
                        {
                            siderKey === null &&

                            <Link to="/">
                                <div className="logo">Frontend App</div>
                            </Link>
                        }
                        {
                            siderKey !== null &&

                            <div className="logo3"></div>
                        }
                        <Menu theme="dark" mode="horizontal" selectedKeys={menuKey} onClick={handleMenu}>
                            {
                                user === null &&

                                <Menu.Item key="1" icon={<UserOutlined />}>
                                    <Link to="/login">Login</Link>
                                </Menu.Item>
                            }
                            {
                                user !== null &&

                                <Menu.Item key="2" icon={<DashboardOutlined />}><Link to="/dashboard">Dashboard</Link></Menu.Item>
                            }
                        </Menu>
                    </Header>

                    {
                        siderKey === null &&

                        <>
                            <Content className="site-layout" style={{padding: '0 50px', marginTop: 30, marginBottom: 100}}>
                                <section style={{borderRadius: '10px', backgroundColor: '#f8f9fa', padding: '20px 30px'}}>
                                    <Switch>
                                        <Route exact path="/">
                                            <Home/>
                                        </Route>
                                        <Route exact path="/login">
                                            <Login/>
                                        </Route>
                                    </Switch>
                                </section>
                            </Content>

                            <Footer style={{position: 'fixed', bottom: 0, left: 0, width: '100%', textAlign: 'center', backgroundColor: '#001529', color: '#fff'}}>Task Management - ©2023 Created by Bagus Puji Rahardjo</Footer>
                        </>
                    }
                    {
                        siderKey !== null && user !== null &&

                        <Layout>
                            <Sider width={200} collapsible collapsed={collapsed} onCollapse={onCollapse} className="site-layout-background" style={{overflow: 'auto', position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 1, overflowY: 'hidden'}}>
                                <br/>
                                <Link to="/dashboard">
                                    <div className="logo2">Frontend App</div>
                                </Link>
                                <br/>

                                <Menu mode="inline" theme="dark" selectedKeys={siderKey} openKeys={siderOpen} onOpenChange={onOpenChange} onClick={handleSider} style={{height: '100%', borderRight: 0}}>
                                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                                        <Link to="/dashboard">Dashboard</Link>
                                    </Menu.Item>
                                    <SubMenu key="sub1" title="Assignments" icon={<ScheduleOutlined />}>
                                        {
                                            user.role === 'user' &&

                                            <>
                                                <Menu.Item key="2" icon={<PlusCircleOutlined />}>
                                                    <Link to="/dashboard/tasks/create">Create Task</Link>
                                                </Menu.Item>
                                                <Menu.Item key="3" icon={<OrderedListOutlined />}>
                                                    <Link to="/dashboard/tasks/list">List Task</Link>
                                                </Menu.Item>
                                            </>
                                        }
                                        {
                                            user.role === 'admin' &&

                                            <Menu.Item key="2" icon={<CheckCircleOutlined />}>
                                                <Link to="/dashboard/tasks/approval">Approval Task</Link>
                                            </Menu.Item>
                                        }
                                    </SubMenu>
                                    <Menu.Item key="4" icon={<ExportOutlined />}>
                                        <Link to='/logout'>Logout</Link>
                                    </Menu.Item>
                                </Menu>
                            </Sider>

                            <Layout className="site-layout" style={{marginLeft: 200}}>
                                <Content className="site-layout-background" style={{margin: '16px 24px 24px', padding: 24, minHeight: 600}}>
                                    <section>
                                        <Switch>
                                            <Route exact path="/">
                                                <Home/>
                                            </Route>
                                            <Route exact path="/dashboard">
                                                <Dashboard/>
                                            </Route>
                                            <Route exact path="/dashboard/tasks/create">
                                                <TaskCreate/>
                                            </Route>
                                            <Route exact path="/dashboard/tasks/list">
                                                <TaskList/>
                                            </Route>
                                            <Route exact path="/dashboard/tasks/approval">
                                                <TaskList/>
                                            </Route>
                                            <Route exact path="/dashboard/tasks/edit/:id">
                                                <TaskEdit/>
                                            </Route>
                                            <Route exact path="/dashboard/tasks/show/:id">
                                                <TaskShow/>
                                            </Route>
                                            <Route exact path="/dashboard/tasks/approval/show/:id">
                                                <TaskShow/>
                                            </Route>
                                            <Route exact path="/logout">
                                                <Logout/>
                                            </Route>
                                        </Switch>
                                    </section>
                                </Content>
                                <Footer style={{marginTop: '50px', textAlign: 'center', backgroundColor: '#001529', color: '#fff', width: '100%', padding: 13}}>Task Management - ©2023 Created by Bagus Puji Rahardjo</Footer>
                            </Layout>
                        </Layout>
                    }
                </Layout>
            </Router>
        </ProjectProvider>
    )
}

export default Routes