# -*- ecoding: utf-8 -*-
# @ModuleName: tserServer
# @Mail: 15717163552@163.com
# @Author: mozhouqiu
# @Time: 2022/11/10 11:22
from flask import Flask


app=Flask(__name__)


@app.route('/index')
def index():
    return "我是test服务"


    # app.run(host="0.0.0.0",port=6666)