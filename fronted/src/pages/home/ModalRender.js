import React from 'react';
import { Input,Button, InputNumber, Checkbox, Select, Form, Modal, DatePicker } from 'antd';
import moment from 'moment';



const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
}

const formLargeItemLayout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 19,
    },
}

const ModalRender = ({
    visible,
    type,
    item = {},
    onOk,
    onCancel,
    enumGlobal = {},
    modelItems = [],
}) => {

    const [form] = Form.useForm();

    function handleOk() {

        form.validateFields().then(values => {
            
            if (type == 'update') {
                Object.getOwnPropertyNames(values).forEach(d => {
                    if (typeof (values[d]) == "undefined" || values[d] == "") { values[d] = null }
                    if (values[d] == item[d]) { delete values[d]; }
                })

               
            }
            console.log(111,values)

            if (Object.getOwnPropertyNames(values).length == 0) {
                onCancel()
                return
            }
            if (item.id) { values.id = item.id } //如果是变更，item有内容，把id给到values
            // if(values.set){ values = {...values, set: JSON.parse(values.set)}}  // 如果是JSON字段需要激活


            onOk(values)
        }).catch(errorInfo => {
            return
        })

    }

    const modalOpts = {
        forceRender: true,
        title: `${type === 'create' ? '新建' : '修改'}`,
        open:true,
        onOk: handleOk,
        onCancel,
        wrapClassName: 'vertical-center-modal',
        width: 720,
    }


    return (
        
        <Modal {...modalOpts}>
            <Form layout="horizontal" initialValues={item} form={form}>
                <Form.Item
                    label="服务名称"
                    name="service_name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="服务地址"
                    name="host"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}



export default ModalRender;
