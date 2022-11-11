import React from 'react';
import { useState, useEffect, useReducer, useContext } from 'react';
import { Table, message, Button,Form,Input } from 'antd';
import { reducer, Post, errMessage } from '../../utils';
import ModalRender from './ModalRender';
import './index.scss'
import {
	PlusOutlined
} from '@ant-design/icons';



var initialState = {
	data: [],
	dataFetchProps: {},
	dataLoading: true,
	dataLoadingFinished: false, // false 时，spin
	modalVisible: false,
	modalType: 'create',
	selectedRow: {},
	selectedRowIndex: -1,
	selectedRows: [],
	selectedRowKeys: [],
	sorterPage: {},
	filters: {},
	searchProps: {},
	pagination: { current: 1, pageSize: 10, total: 0, },
	statusCode: 200,
	waitingServerResponse: false, // 在处理增删改的过程中，等待服务器返回结果，控制用户不重复点击（严格处理，通常情况下影响很小）
};


function RenderBase() {
	const [collapsed, setCollapsed] = useState(false);
	const [state, dispatch] = useReducer(reducer, initialState);

	const { data, dataLoading, dataLoadingFinished, dataFetchProps, sorterPage, modalVisible, modalType, selectedRow, selectedRows, selectedRowKeys, filters, searchProps, pagination, statusCode, waitingServerResponse } = state;

	// const ds = useContext(APPContext);
	// const { enumGlobal, tablesDefGlobal } = ds.story //全局公用变量

	// const currentColumnDesc = tablesDefGlobal[tableNameGetDef] ? tablesDefGlobal[tableNameGetDef] : false




	useEffect(() => {

		if (state.dataLoading) {
			dispatch({ type: 'forcedUpdate', payload: { dataLoading: false, dataLoadingFinished: false, } })
			let dataFetchPropsRender = { offset: (pagination.current - 1) * pagination.pageSize, limit: pagination.pageSize };
			Post({ url: `/gateway/findAll`, values: dataFetchPropsRender }).then((res) => {
				let { status, body } = res
				console.log(333, body)
				if (status == 200 && body.code == 10000) {

					dispatch({ type: 'forcedUpdate', payload: { data: body.data, dataLoadingFinished: true, pagination: { ...pagination, total: body.total ? body.total : 0 } } })
				} else {
					let messageDisplay = body.msg ? body.msg : errMessage[status]
					dispatch({ type: 'forcedUpdate', payload: { dataLoadingFinished: true, statusCode: status } })
					message.error(messageDisplay);
				}
			}).catch((err) => {
				message.error(JSON.stringify(err));
				dispatch({ type: 'forcedUpdate', payload: { dataLoadingFinished: true, statusCode: 500 } })
			})
		}

		if (state.needCreate && state.needCreate.values) {
			let values = {...state.needCreate.values}
			dispatch({ type: 'forcedUpdate', payload: { needCreate: false } })
			Post({ url: `/gateway/create`, values }).then((res) => {
				let { status, body } = res
				console.log(333, body)
				if (status == 200 && body.code == 10000) {

					dispatch({ type: 'forcedUpdate', payload: { data: body.data, dataLoadingFinished: true, pagination: { ...pagination, total: body.total ? body.total : 0 } } })
				} else {
					let messageDisplay = body.msg ? body.msg : errMessage[status]
					dispatch({ type: 'forcedUpdate', payload: { dataLoadingFinished: true, statusCode: status } })
					message.error(messageDisplay);
				}
			}).catch((err) => {
				message.error(JSON.stringify(err));
				dispatch({ type: 'forcedUpdate', payload: { dataLoadingFinished: true, statusCode: 500 } })
			})
		}



	});

	const columns = [
		{
			title: 'ID',
			//   width: 100,
			dataIndex: 'id',
			key: 'id',
			fixed: 'left',
		},
		{
			title: '服务名称',
			//   width: 100,
			dataIndex: 'service_name',
			key: 'service_name',
			fixed: 'left',
		},
		{
			title: '服务地址',
			//   width: 100,
			dataIndex: 'host',
			key: 'host',
			fixed: 'left',
		},
		{
			title: '创建时间',
			dataIndex: 'create_time',
			key: '3',
		},
		{
			title: '更新时间',
			dataIndex: 'update_time',
			key: '4',
		},
		{
			title: '操作',
			key: 'operation',
			fixed: 'right',
			width: 120,
			render: () => <div>
				<a>修改</a>
				<a style={{ "marginLeft": "10px" }}>删除</a></div>,
		}
	];

	const modalRenderProps = {
		item: modalType === 'create' ? (state.copyRow?state.copyRow:{}) : selectedRow,
		type: modalType,
		open: modalVisible,
		onOk (data) {
		  if (modalType === 'create') {
			  dispatch({type: 'forcedUpdate', payload:{modalVisible:false, copyRow: false, needCreate:{values: data}}})
		  } 
		  if (modalType === 'update') {
			  dispatch({type: 'forcedUpdate', payload:{modalVisible:false, needUpdate:{values: {...data, updated_at: selectedRow.updated_at} }}})
		  }
		},    
		onCancel () {
		  dispatch({type: 'forcedUpdate', payload:{modalVisible: false, copyRow: false}})
		},
	  }


	return (
		<>
			<div style={{ "marginBottom": "10px" }}>
				<Button type="primary" icon={<PlusOutlined />} size="small" onClick={()=>dispatch({type:"forcedUpdate",payload:{modalVisible:true}})}>
					添加
				</Button>
			</div>

			<Table
				columns={columns}
				rowKey={"id"}
				dataSource={data}
				scroll={{
					x: 1300,
				}}
			/>

			{modalVisible && <ModalRender {...modalRenderProps}/>}
		</>

	);
};



export default RenderBase