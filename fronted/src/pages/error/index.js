import React from 'react';
import { useState, useEffect, useReducer, useContext } from 'react';
import { Table, message, Button, Form, Input } from 'antd';
import { reducer, Post, errMessage } from '../../utils';
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


	});

	


	return (<div>
	11111
	</div>);
};



export default RenderBase