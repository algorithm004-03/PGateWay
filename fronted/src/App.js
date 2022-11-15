import logo from './logo.svg';
import './App.css';
import RouterMap from './router/index'
import React from 'react';
import { useState, useEffect, useReducer, useContext } from 'react';
import { Layout, Menu } from 'antd';
import Router from "../src/router"

import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UploadOutlined,
	ClusterOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons';
const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{height:"100%"}}>
		<Sider trigger={null} collapsible collapsed={collapsed}>
		  <div className="logo" />
		  <Menu
			theme="dark"
			mode="inline"
			defaultSelectedKeys={['1']}
			items={[
			  {
				key: '1',
				icon: <ClusterOutlined/>,
				label: '微服务',
			  },
			]}
		  />
		</Sider>
		<Layout className="site-layout">
		  <Header
			className="site-layout-background"
			style={{
			  padding: 0,
			}}
		  >
			{React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
			  className: 'trigger',
			  onClick: () => setCollapsed(!collapsed),
			})}
        </Header>
        <div style={{"paddingTop":"10px","paddingLeft":"10px"}}> <Router/></div>
       
		  {/* <Content
			className="site-layout-background"
			style={{
			  margin: '24px 16px',
			  padding: 24,
			  minHeight: 280,
			}}
		  >
			Content
		  </Content> */}
		</Layout>
	  </Layout>
  );
}

export default App;
