import React from 'react';
import { useState, useEffect, useReducer, useContext } from 'react';
// import { Divider, Spin, message, Row, Col, Table, Input, Button, Dropdown, Menu, Popconfirm, Checkbox, Tooltip } from 'antd';
import {  reducer} from '../../utils/reducerCommon';
import ModalRender from './ModalRender';

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
	  pagination: {current: 1, pageSize: 10, total: 0, },
	  statusCode: 200,
	  waitingServerResponse: false, // 在处理增删改的过程中，等待服务器返回结果，控制用户不重复点击（严格处理，通常情况下影响很小）
};
	

function RenderBase({ match, externalProps={} }){
	
	// const [state, dispatch] = useReducer(reducer, initialState);
	
	// const {data, dataLoading, dataLoadingFinished, dataFetchProps, sorterPage, modalVisible, modalType, selectedRow, selectedRows, selectedRowKeys, filters, searchProps, pagination, statusCode, waitingServerResponse } = state;

	// const ds = useContext(APPContext);
    // const { enumGlobal, tablesDefGlobal } = ds.story //全局公用变量

	// const currentColumnDesc = tablesDefGlobal[tableNameGetDef] ? tablesDefGlobal[tableNameGetDef] : false

	useEffect(() => { 
	// 	/* 如果外部参数引入需要 reloading; externalPropsRefId 统一使用，contract_id 根据对象不同而不同
	// 	if(externalProps.contract_id && externalProps.contract_id!=state.externalPropsRefId && !state.dataLoading){
	// 		dispatch({type: 'forcedUpdate', payload:{externalPropsRefId: externalProps.contract_id, dataLoading: true,}})
	// 	}
	// 	*/
	// 	if(state.dataLoading&&currentColumnDesc&&!waitingServerResponse){
	// 		dispatch({type: 'forcedUpdate', payload:{dataLoading: false, dataLoadingFinished: false,}})
	// 		let dataFetchPropsRender = {...dataFetchProps, offset: (pagination.current-1)*pagination.pageSize, limit: pagination.pageSize, attributes: ["id", ...currentColumnDesc.map(d=>d.column_name)]};
	// 		if(sorterPage.order){
	// 			dataFetchPropsRender.order = [[sorterPage.columnKey, sorterPage.order=="descend"?"DESC":"ASC"]];
	// 		}
	// 		// if(match.params.id){ dataFetchPropsRender.id = match.params.id }
	// 		/*
	// 		if(filters.sales_item_type){
	// 			dataFetchPropsRender.sales_item_type = filters.sales_item_type;
	// 		}
	// 		if(Object.getOwnPropertyNames(externalProps).length>0){
	// 			dataFetchPropsRender = {...dataFetchPropsRender, ...externalProps}
	// 		}
	// 		*/
	// 		Post({url: `/server/${modelSchema}/${modelNameForURLAndLog}/findAll`, values: dataFetchPropsRender}).then((res)=>{
	// 			let { status, body } = res
	// 			if(status == 200 && body.code == 10000){
	// 				dispatch({type: 'forcedUpdate', payload:{data: body.data, dataLoadingFinished: true, pagination: {...pagination, total: body.total?body.total:0}}})
	// 			}else{
	// 				let messageDisplay = body.msg ? body.msg : errMessage[status]
	// 				dispatch({type: 'forcedUpdate', payload:{dataLoadingFinished: true, statusCode: status}})
	// 				message.error(messageDisplay);
	// 			}
	// 		}).catch((err)=>{
	// 			message.error(JSON.stringify(err));
	// 			dispatch({type: 'forcedUpdate', payload:{dataLoadingFinished: true, statusCode: 500}})
	// 		})
	// 	}
		
	// 	if(state.needCreate&&state.needCreate.values){
	// 		let {values} = state.needCreate;  // value 要先取出来
	// 		dispatch({type: 'forcedUpdate', payload:{needCreate: false, waitingServerResponse: true}})
	// 		/* externalProps 如果处于激活状态
	// 		if(Object.getOwnPropertyNames(externalProps).length>0){
	// 			values = {...values, ...externalProps}
	// 		}
	// 		 */
	// 		Post({url: `/server/${modelSchema}/${modelNameForURLAndLog}/create`, values}).then((res)=>{
	// 			let { status, body } = res	
	// 			if(status == 200 && body.code == 10000){
	// 				dispatch({type:'addOneRowData', payload: {data: body.data}});
	// 				message.success("新增成功");
	// 			}else{
	// 				let messageDisplay = body.msg ? body.msg : errMessage[status]
	// 				message.error(messageDisplay);
	// 			}
	// 			dispatch({type: 'forcedUpdate', payload:{waitingServerResponse: false}})
	// 		}).catch((err)=>{
	// 			message.error(JSON.stringify(err));
	// 			dispatch({type: 'forcedUpdate', payload:{waitingServerResponse: false}})
	// 		});	
	// 	}
		
	// 	if(state.needUpdate&&state.needUpdate.values){
	// 		let {values} = state.needUpdate;  
	// 		dispatch({type: 'forcedUpdate', payload:{needUpdate: false, waitingServerResponse: true}})
	// 		Post({url: `/server/${modelSchema}/${modelNameForURLAndLog}/update`,values}).then((res)=>{	
	// 			let { status, body } = res
	// 			if(status == 200 && body.code == 10000){
	// 				dispatch({type:'updateDataById', payload: {id: values.id, data: body.data,}});
	// 				message.success("更新成功");
	// 			}else{
	// 				let messageDisplay = body.msg ? body.msg : errMessage[status]
	// 				message.error(messageDisplay);
	// 			}
	// 			dispatch({type: 'forcedUpdate', payload:{waitingServerResponse: false}})
	// 		}).catch((err)=>{
	// 			message.error(JSON.stringify(err));
	// 			dispatch({type: 'forcedUpdate', payload:{waitingServerResponse: false}})
	// 		});	
	// 	}
		
	// 	if(state.needDelete&&state.needDelete.values){
	// 		let {values} = state.needDelete;
	// 		dispatch({type: 'forcedUpdate', payload:{needDelete: false, waitingServerResponse: true, selectedRow:{}, selectedRowIndex: -1}})
	// 		Post({url: `/server/${modelSchema}/${modelNameForURLAndLog}/destroy`,values}).then((res)=>{	
	// 			let { status, body } = res
	// 			if(status == 200 && body.code == 10000){
	// 				dispatch({type:'deleteDataById', payload: {id: values.id, }});
	// 				message.success("删除成功");
	// 			}else{
	// 				let messageDisplay = body.msg ? body.msg : errMessage[status]
	// 				message.error(messageDisplay);
	// 			}
	// 			dispatch({type: 'forcedUpdate', payload:{waitingServerResponse: false}})
	// 		}).catch((err)=>{
	// 			message.error(JSON.stringify(err));
	// 			dispatch({type: 'forcedUpdate', payload:{waitingServerResponse: false}})
	// 		});
	// 	}
		
	});
	
	// const dataLength = data.length;
	
	// 处理正在 loading 的状态，及可能返回空数据集的处理 currentColumnDesc
	// if(!currentColumnDesc){
	// 	return (<div style={{marginTop: 50, textAlign: "center"}}>当前页面没有获取对应的配置性数据</div>)
	// }
	// if(!dataLoadingFinished){
	// 	return (<div style={{marginTop: 50, textAlign: "center"}}><Spin size="large" /></div>)
	// }
	// if(statusCode!=200){
	// 	return (<div style={{marginTop: 50, textAlign: "center"}}><Exception type={statusCode} retry={()=>dispatch({type: 'forcedUpdate', payload:{statusCode: 200, loading: true}})}/></div>)
	// }

	// const OpsMenu = ({record}) =>{
	// 	/**
	// 	let disabledOpsMenu = {
	// 		menu1: waitingServerResponse,
	// 		menu2: ["fixed", "varied"].indexOf(record.sales_item_type)==-1 || waitingServerResponse || !record.master,
	// 	}

	// 	onClick={()=>!disabledOpsMenu.menu2&&dispatch({type: 'forcedUpdate', payload:{modalVisible: true, modalType: 'create', selectedRow: record}})}
	// 	 */
	// 	return (
	// 	<div>
	// 		<a style={{marginRight: 8, fontSize: 12}} disabled={waitingServerResponse} onClick={()=>dispatch({type: 'forcedUpdate', payload:{modalVisible:true, modalType: 'update', selectedRow: record}})}>编辑</a>
	// 		<Dropdown overlay={
	// 				<Menu>
	// 					<Menu.Item disabled={waitingServerResponse}>
	// 					  <Popconfirm title="确定删除？" okText="Yes" cancelText="No" 
	// 						onConfirm ={()=>dispatch({type: 'forcedUpdate', payload: {needDelete:{values: {id: record.id, updated_at: record.updated_at}}}})}>
	// 						<a>删除</a>
	// 					  </Popconfirm>
	// 					</Menu.Item>
	// 					<Menu.Item disabled={waitingServerResponse}>
	// 					  <a style={{marginRight: 8, fontSize: 12}} onClick ={()=>dispatch({type: 'forcedUpdate', payload: {modalVisible:true, modalType: 'create', copyRow: {...record, id: null}}})}>复制</a>
	// 					</Menu.Item>
	// 					<Menu.Item>
	// 					  <a style={{marginRight: 8, fontSize: 12}} onClick={()=>dispatch({type: 'forcedUpdate', payload:{modalLogChangeVisible: true, modelLogChange: modelNameForURLAndLog, selectedRow: record}})}>日志</a>
	// 					</Menu.Item>
	// 				</Menu>
	// 			}>
	// 			<a>{getIcon("EllipsisOutlined")}</a>
	// 		</Dropdown>
	// 	</div>
	// 	)
	// }
/*  OpsMenu 中 历史 / 复制 看情况带入

		const columnsSpecail = [{
		  title: 'id',
		  dataIndex: 'id',
		  key: 'id',
		  className: 'align_center',
		  width: 60,
		  sorter: (a, b) => { let x = a.id||0;  let y = b.id||0;  if(x<y){return -1}else{return 1}}, 
		  sortOrder: sorterPage.columnKey ===  "id"  && sorterPage.order,
		},{
		  title: 'charSep',
		  dataIndex: 'char2',
		  key: 'char2',
		  width: 120,
		  sorter: (a, b) => { let x = a.char2||"";  let y = b.char2||"";  if(x<y){return -1}else{return 1}}, 
		  sortOrder: sorterPage.columnKey ===  "char2"  && sorterPage.order,
		}, {
			title: '更新时间',
			dataIndex: 'updated_at',
			key: 'updated_at',
			ellipsis: true,
			render:text=>text?moment(text).format('YYYY-MM-DD HH:mm'):null,  
			width: 100,	
			sorter: (a, b) => { let x = a.updated_at||"";  let y = b.updated_at||"";  if(x<y){return -1}else{return 1}}, 
			sortOrder: sorterPage.columnKey ===  "updated_at"  && sorterPage.order,	
		} ];

		*/
		// columnsSpecail 为特殊的字段定义；通常id不删除
		// columnsAdditional 为补充字段

		// const columnsSpecail = [{
		//   title: 'id',
		//   dataIndex: 'id',
		//   key: 'id',
		//   className: 'align_center',
		//   width: 60,
		//   sorter: (a, b) => { let x = a.id||0;  let y = b.id||0;  if(x<y){return -1}else{return 1}}, 
		//   sortOrder: sorterPage.columnKey ===  "id"  && sorterPage.order,
		// } ];

		// const columnsAdditional = [{
		// 	title: '操作',
		// 	className: 'align_left',
		// 	key: 'opsItems',
		// 	width: 100,
		// 	render: (text, record) => <OpsMenu record={record}/>,
		// 	fixed: 'right',
		//   } ];	
		
		// // 初始值为 columnsSpecail 之和 + columnsAdditional 之和
		// var xScroll = 100  

		// const columnsRender = currentColumnDesc.map(item=>{

		// 	let { column_name, column_name_show, width, required, enum_code, data_type } = item
		// 	// 查找在特殊定义字段中是否存在，如果存在按特殊定义执行
		// 	let i = _.findIndex(columnsSpecail, {key: column_name}); 
		// 	if(i>=0){
		// 		let speWidth = columnsSpecail[i]["width"] ? columnsSpecail[i]["width"] : 120
		// 		xScroll = xScroll + speWidth
		// 		return {...columnsSpecail[i], data_type, required};
		// 	}else{
		// 		xScroll = xScroll + (width?width:120)
		// 		let isNumber = ["integer", "bigint", "numeric"].indexOf(data_type)!=-1
		// 		let standardObj = {
		// 			title: column_name_show, 
		// 			dataIndex: column_name, 
		// 			key: column_name, 
		// 			width: width?width:120,
		// 			data_type,
		// 			required,
		// 			enumData: enum_code&&enumGlobal[enum_code] ? enumGlobal[enum_code]["set"] : [],
		// 			sorter: (a, b) => { let x = a[column_name]||"";  let y = b[column_name]||"";  if(x<y){return -1}else{return 1}}, 
		// 			sortOrder: sorterPage.columnKey ===  column_name  && sorterPage.order,
		// 		}
		// 		if(isNumber){
		// 			standardObj.sorter = (a, b) => { let x = parseFloat(a[column_name])||0;  let y = parseFloat(b[column_name])||0;  if(x<y){return -1}else{return 1}}
		// 		}
		// 		if(data_type.indexOf("timestamp")>=0){
		// 			standardObj.render = text=>text?moment(text).format('YYYY-MM-DD HH:mm'):null
		// 		}
		// 		if(data_type=="boolean"){
		// 			delete standardObj.sortOrder
		// 			delete standardObj.sorter
		// 			standardObj.className = 'align_center'
		// 			standardObj.render = (text, record)=><Checkbox onChange={checkedValue=>{ 
		// 				let values = {id: record.id, updated_at: record.updated_at}
		// 				values[column_name] = checkedValue.target.checked
		// 				dispatch({type: 'forcedUpdate', payload:{needUpdate: {values} }})
		// 			}} checked={text}/>
		// 		}
		// 		if(data_type.indexOf("date")>=0){
		// 			standardObj.render = text=>text?moment(text).format('YYYY-MM-DD'):null
		// 		}
		// 		if(data_type=="json"||data_type=="jsonb"){
		// 			standardObj.render = text=>text?(typeof(text)!="string"?JSON.stringify(text, null, 2):text):null
		// 		}
		// 		if(ellipsisDisabledList.indexOf(column_name)==-1){
		// 			standardObj.ellipsis = true
		// 		}
		// 		if(enum_code){
		// 			standardObj.render = text=>{
		// 				let searchArray = standardObj.enumData
		// 				let i = _.findIndex(searchArray, {value: text}); 
		// 				let returnText = (i!=-1? searchArray[i]["text"] : text) 
		// 				if(openMasterDetails.indexOf(enum_code)==-1){
		// 					return returnText
		// 				}else{
		// 					let {titleForTab, urlForTab} = mdInfoGene(enum_code)
		// 					return <a onClick={()=>ds.dispatch({type: 'addTabWithQuery', payload: { url: urlForTab, query: {id: text}, title: titleForTab + returnText } })}>
		// 					{returnText}
		// 					</a>
		// 				}
		// 			}
		// 		}
		// 		if(enum_code&&data_type.indexOf("ARRAY")==0){
		// 			standardObj.render = text=>{
		// 				let searchArray = standardObj.enumData
		// 				return searchArray.filter(d=>text&&text.indexOf(d.value)!=-1).map(d=>d.text).join(", ")
		// 			}
		// 		}
		// 		return standardObj
		// 	}
		// })

		// const columns = [...columnsRender, ...columnsAdditional]
		/* 单选如下，多选改type，只调用onChange
		const rowSelection = {
			selectedRowKeys,
			selectedRows,
			type: "radio",
			onSelect: (record, selected, selectedRows, nativeEvent)=>{
				if(selected){
						dispatch({type: 'forcedUpdate', payload:{selectedRowKeys: [record.id], selectedRow: record, selectedRows: [record]}})
					} else {
						dispatch({type: 'forcedUpdate', payload:{selectedRowKeys: [], selectedRow: {}, selectedRows: []}})
					}
				},
		};
		*/
		//	type: "checkbox",
		//	onChange: (selectedRowKeys, selectedRows) => dispatch({type: 'forcedUpdate', payload:{selectedRowKeys: selectedRowKeys, selectedRows: selectedRows }})

	// 	const tabelDefinition = {
	// 		rowKey: 'id',
	// 		loading: !dataLoadingFinished,
	// 		size: 'small',
	// 		columns: columns,
	// 		dataSource: data,
	// 		scroll: { x: xScroll },
	// 		// rowSelection: rowSelection,
	// 		onChange: (pagination, filters, sorter, extra) => {
	// 				dispatch({type: 'forcedUpdate', payload:{sorterPage: sorter, filters: filters, pagination: pagination, dataLoading: true}})
	// 			},
	// 		pagination: {...pagination, showSizeChanger: true, showTotal: total=>`总行数: ${total}`},
	// 		// rowClassName: (record)=>{	if(record.check_result){ return "errorItem"	}	},
	// 	}


	//   const modalRenderProps = {
	// 	item: modalType === 'create' ? (state.copyRow?state.copyRow:{}) : selectedRow,
	// 	type: modalType,
	// 	visible: modalVisible,
	// 	modelItems: columnsRender.filter(d=>modelRemoveColumn.indexOf(d.key)==-1),
	// 	enumGlobal,
	// 	onOk (data) {
	// 	  if (modalType === 'create') {
	// 		  dispatch({type: 'forcedUpdate', payload:{modalVisible:false, copyRow: false, needCreate:{values: data}}})
	// 	  } 
	// 	  if (modalType === 'update') {
	// 		  dispatch({type: 'forcedUpdate', payload:{modalVisible:false, needUpdate:{values: {...data, updated_at: selectedRow.updated_at} }}})
	// 	  }
	// 	},    
	// 	onCancel () {
	// 	  dispatch({type: 'forcedUpdate', payload:{modalVisible: false, copyRow: false}})
	// 	},
	//   }
	 
	//   const ModalRenderGene = () => <ModalRender {...modalRenderProps}/>; 

	//   const logChangeRenderProps = {
	// 	item: selectedRow,
	// 	model: state.modelLogChange,
	// 	columns: columns,
	// 	visible: state.modalLogChangeVisible,
	// 	onClose () {
	// 	  dispatch({type: 'forcedUpdate', payload:{modalLogChangeVisible: false}})
	// 	},
	//   }
	 
	//   const LogChangeModalGene = () => <LogChangeModal {...logChangeRenderProps}/>; 

	//   const searchFormRenderProps  =  {
	// 		searchItems: searchFormItems.map(d=>{
	// 			let i = _.findIndex(columns, {key: d});
	// 			return i>=0 ? columns[i] : {key: d, title: d};
	// 		}),
	// 		item: dataFetchProps,
	// 		waitingServerResponse,
	// 		onOk (data) {
	// 			dispatch({type: 'forcedUpdate', payload:{dataFetchProps: data, dataLoading: true, pagination: {current: 1, pageSize: 10, }}})
	// 		},
	// 		onReset(){
	// 			dispatch({type: 'forcedUpdate', payload:{dataFetchProps: {}, filters: {}, dataLoading: true, pagination: {current: 1, pageSize: 10, }}})
	// 		},
	// 	}

    return (
	<div >
                home

	</div>
    );
}

export default RenderBase