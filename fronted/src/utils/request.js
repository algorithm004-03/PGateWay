import axios from 'axios';
import { host } from '../config';
import { isnull }  from './isnull';


const AxiosServer = function () {
	axios.defaults.baseURL = host;
	axios.defaults.timeout = 1000 * 40;	 //40秒超时

	return axios;
};



async function Post({ url, values = {} }) {
	/**通用方法，都是post方法+json格式。*/
	// 检查url, values; 必须改成 async function 否则这里返回的时候，用.then会报错
	if (isnull.str(url) || typeof (values) != "object") {
		return { status: 999, body: { msg: '参数url和values都不能为空' } } //status 是前端状态，后端统一是code状态
	}
	let postData = values; // 默认是不加密的，直接=values。
	// 5) 调用axios发送请求给后端
	try {
		let Axios = AxiosServer();
		return Axios.post(url, postData).then(r => {
			let d = r.data;  // r表示response,含data,headers等。d是data,里面是服务器返回的body数据;
			if (r.status == 200) {
                return { status: r.status, headers: r.headers, body: d }
			}
		}).catch(err => {
			return { headers: err.response.headers, status: err.response.status, body: err.response.data }
		});
	}
	catch (e) {
		console.log('from url', url, 'error:', e.message)
		return e.message;
	}
};


export { AxiosServer, Post }
