import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UploadOutlined,
	ClusterOutlined,
	VideoCameraOutlined,
	LineChartOutlined
} from '@ant-design/icons';





const menuItems = [
    {
      key: 'server',
      icon: <ClusterOutlined/>,
      label: '微服务',
      url:"/"
    },
    {
      key: 'census',
      icon: <LineChartOutlined/>,
      label: '流量统计',
      url:"/census"
    },
]

const getUrl=(key)=> {
    let url =   "/404"
    menuItems.forEach(d => {
        if (d.key == key) {
            url = d.url
            return 
        } 
    })
    return url
}
  

export {menuItems,getUrl}