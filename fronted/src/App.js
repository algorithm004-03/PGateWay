import logo from './logo.svg';
import './App.css';
import {menuItems,getUrl} from "./pages/tabs"
import RouterMap from './router/index'
import React from 'react';
import { useState, useEffect, useReducer, useContext } from 'react';
import { Layout, Menu,Image } from 'antd';
import Router from "../src/router"
import { useHistory } from 'react-router-dom'

import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UploadOutlined,
	ClusterOutlined,
	VideoCameraOutlined,
	LineChartOutlined
} from '@ant-design/icons';
const { Header, Sider, Content } = Layout;

function App() {
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);

	
	function urlDirect(key) {
	  let url = getUrl(key);
	  history.push(url)
	}
	

	let faultSelectedKeys = [window.location.pathname.split('/')[1]?window.location.pathname.split('/')[1]:"server"]
	function getCurentUrl() {
		console.log(11,window.location.pathname )
	}
	getCurentUrl()

  return (
    <Layout style={{height:"100%"}}>
		<Sider trigger={null} collapsible collapsed={collapsed}>
			  {/* <div className="logo" /> */}
			  <div>{!collapsed && <img height={64} width={200}
				  src={require("./cloud.jpg")}
			  />}</div>
		  <Menu
			theme="dark"
			onClick={(item)=>{urlDirect(item.key)}}
			mode="inline"
			defaultSelectedKeys={faultSelectedKeys}
			items={menuItems}
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
		</Layout>
	  </Layout>
  );
}

export default App;
