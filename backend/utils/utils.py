# -*- ecoding: utf-8 -*-
# @ModuleName: utils
# @Mail: 15717163552@163.com
# @Author: mozhouqiu
# @Time: 2022/11/16 13:19
from db.db_session import select
import json
async def ip_limit(ip,service_name):
    result =await select("gateway_mapping",["black_list"],{"service_name":service_name})
    if result["code"] == 10000:
        if ip in  json.dumps(result["data"]) :
            return {"code":10005,"msg":"您的访问已被限制"}
    return False