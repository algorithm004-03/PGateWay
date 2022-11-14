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
	modalVisible: false,
	modalType: 'create',
	selectedRow: {},
	searchProps: {},
	pagination: { current: 1, pageSize: 10, total: 0, },
	statusCode: 200,
};


function RenderBase() {

	const [state, dispatch] = useReducer(reducer, initialState);
	const { data, dataLoading, modalVisible, modalType, selectedRow, pagination } = state;

	useEffect(() => {

		if (dataLoading) {
			dispatch({ type: 'forcedUpdate', payload: { dataLoading: false } })
			let dataFetchPropsRender = { offset: (pagination.current - 1) * pagination.pageSize, limit: pagination.pageSize };
			Post({ url: `/gateway/findAll`, values: dataFetchPropsRender }).then((res) => {
				let { status, body } = res
				console.log("findAll", body)
				if (status == 200 && body.code == 10000) {
					dispatch({ type: 'forcedUpdate', payload: { data: body.data,  pagination: { ...pagination, total: body.total ? body.total : 0 } } })
				} else {
					let messageDisplay = body.msg ? body.msg : errMessage[status]
					dispatch({ type: 'forcedUpdate', payload: { statusCode: status } })
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
					dispatch({ type: 'addOneRowData', payload: {data:body.data } })
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
					dispatch({ type: 'deleteDataById', payload: { id: values.id} })
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
			render: (record) => <div style={{ "color": "#108ee9" }}>
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


	return (<div>
		<div style={{ "marginBottom": "10px" }}>
			<Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => dispatch({ type: "forcedUpdate", payload: { modalVisible: true,modalType:"create" } })}>
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

		{modalVisible && <ModalRender {...modalRenderProps} />}
	</div>);
};



export default RenderBase