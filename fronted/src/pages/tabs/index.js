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
      label: '数据统计',
      url:"/census"
    },
]

const getUrl=(key)=> {
    let url =   "/404"
    menuItems.forEach(d => {
        if (d.key == key) {
            console.log(111,d.url )
            url = d.url
            return 
        } 
    })
    console.log(222,url)
    return url
}
  

export {menuItems,getUrl}