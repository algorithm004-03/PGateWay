import React from 'react';
import { useState, useEffect, useReducer, useContext } from 'react';
import { Table, message, Button, Form, Input } from 'antd';
import { reducer, Post, errMessage } from '../../utils';
import ModalRender from './ModalRender';
import './index.scss'
import {
	PlusOutlined
} from '@ant-design/icons';



var initialState = {
	data: [],
	dataLoading: true,
	dataLoadingFinished: false,
	modalVisible: false,
	modalType: 'create',
	selectedRow: {},
	searchProps: {},
	pagination: { current: 1, pageSize: 10, total: 0, },
	statusCode: 200,
};


function RenderBase() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { data, dataLoading, modalVisible, modalType, selectedRow, pagination, dataLoadingFinished } = state;

	useEffect(() => {

		if (dataLoading) {
			dispatch({ type: 'forcedUpdate', payload: { dataLoading: false } })
			let dataFetchPropsRender = { offset: (pagination.current - 1) * pagination.pageSize, limit: pagination.pageSize };
			Post({ url: `/gateway/findAll`, values: dataFetchPropsRender }).then((res) => {
				let { status, body } = res
				console.log("findAll", body)
				if (status == 200 && body.code == 10000) {
					dispatch({ type: 'forcedUpdate', payload: { data: body.data, dataLoadingFinished: true, pagination: { ...pagination, total: body.total ? body.total : 0 } } })
				} else {
					let messageDisplay = body.msg ? body.msg : errMessage[status]
					dispatch({ type: 'forcedUpdate', payload: { statusCode: status, dataLoadingFinished: true } })
					message.error(messageDisplay);
				}
			}).catch((err) => {
				message.error(JSON.stringify(err));
				dispatch({ type: 'forcedUpdate', payload: { dataLoadingFinished: true, statusCode: 500 } })
			})
		}

		if (state.needCreate && state.needCreate.values) {
			let values = { ...state.needCreate.values }
			dispatch({ type: 'forcedUpdate', payload: { needCreate: false } })
			Post({ url: `/gateway/create`, values }).then((res) => {
				let { status, body } = res
				console.log("create", body)
				if (status == 200 && body.code == 10000) {
					dispatch({ type: 'addOneRowData', payload: { data: body.data } })
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

		if (state.needUpdate && state.needUpdate.values) {
			let values = { ...state.needUpdate.values }
			dispatch({ type: 'forcedUpdate', payload: { needUpdate: false } })
			Post({ url: `/gateway/update`, values }).then((res) => {
				let { status, body } = res
				console.log("update", body)
				if (status == 200 && body.code == 10000) {
					message.success(body.msg);
					dispatch({ type: 'updateDataById', payload: { id: selectedRow.id, data: body.data } })
				} else {
					let messageDisplay = body.msg ? body.msg : errMessage[status]
					message.error(messageDisplay);
				}
			}).catch((err) => {
				message.error(JSON.stringify(err));
			})
		}

		if (state.needDelete && state.needDelete.values) {
			let values = { ...state.needDelete.values }
			dispatch({ type: 'forcedUpdate', payload: { needDelete: false } })
			Post({ url: `/gateway/delete`, values }).then((res) => {
				let { status, body } = res
				if (status == 200 && body.code == 10000) {
					message.success(body.msg);
					dispatch({ type: 'deleteDataById', payload: { id: values.id } })
				} else {
					message.error(body.msg);
				}
			}).catch((err) => {
				message.error(JSON.stringify(err));
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
			sorter: (a, b) => { let x = a.service_name||"";  let y = b.service_name||"";  if(x<y){return -1}else{return 1}}, 
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
			sorter: (a, b) => { let x = a.create_time||"";  let y = b.create_time||"";  if(x<y){return -1}else{return 1}}, 
			key: 'create_time',
		},
		{
			title: '黑名单',
			dataIndex: 'black_list',
			key: 'black_list',
		},
		{
			title: '限流(次/秒)',
			dataIndex: 'number',
			key: 'number',
		},
		{
			title: '更新时间',
			dataIndex: 'update_time',
			sorter: (a, b) => { let x = a.update_time||"";  let y = b.update_time||"";  if(x<y){return -1}else{return 1}}, 
			key: 'update_time',
		},
		{
			title: '操作',
			key: 'operation',
			fixed: 'right',
			width: 120,
			render: (record) => <div style={{ "color": "#1890FF" }}>
				<span style={{ "cursor": "pointer" }} onClick={() => { dispatch({ type: 'forcedUpdate', payload: { modalVisible: true, modalType: "update", selectedRow: { ...record } } }) }}>修改</span>
				<span style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={() => { dispatch({ type: 'forcedUpdate', payload: { needDelete: { values: { id: record.id } } } }) }}>删除</span></div>,
		}
	];

	const modalRenderProps = {
		item: modalType === 'create' ? (state.copyRow ? state.copyRow : {}) : selectedRow,
		type: modalType,
		open: modalVisible,
		onOk(data) {
			if (modalType === 'create') {
				dispatch({ type: 'forcedUpdate', payload: { modalVisible: false, needCreate: { values: data } } })
			}
			if (modalType === 'update') {
				dispatch({ type: 'forcedUpdate', payload: { modalVisible: false, needUpdate: { values: { ...data, updated_at: selectedRow.update_time } } } })
			}
		},
		onCancel() {
			dispatch({ type: 'forcedUpdate', payload: { modalVisible: false, selectedRow: {} } })
		},
	}

	const tabelDefinition = {
		rowKey: 'id',
		loading: !dataLoadingFinished,
		size: 'small',
		columns: columns,
		dataSource: data,
		scroll: { x: 1300 },
		// rowSelection: rowSelection,
		onChange: (pagination, filters, sorter, extra) => {
			dispatch({ type: 'forcedUpdate', payload: { sorterPage: sorter, pagination: pagination, dataLoading: true } })
		},
		pagination: { ...pagination, showSizeChanger: true, showTotal: total => `总行数: ${total}` },
		// rowClassName: (record)=>{	if(record.check_result){ return "errorItem"	}	},
	}


	return (<div>
		<div style={{ "marginBottom": "10px" }}>
			<Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => dispatch({ type: "forcedUpdate", payload: { modalVisible: true, modalType: "create" } })}>
				添加
			</Button>
		</div>

		<Table {...tabelDefinition} />

		{modalVisible && <ModalRender {...modalRenderProps} />}
	</div>);
};



export default RenderBase