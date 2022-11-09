# -*- ecoding: utf-8 -*-
# @ModuleName: streamInput
# @Mail: 15717163552@163.com
# @Author: mozhouqiu
# @Time: 2022/11/6 9:37
import socket

def transTo(host,port):
    # 1.创建套接字
    tcp_client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # 2.建立连接
    tcp_client_socket.connect((host, port))

    # 3.拼接请求协议
    # 3.1 请求行
    request_line = "GET / HTTP/1.1\r\n"

    # 3.2 请求头
    request_header = "Host:www.icoderi.com\r\n"

    # 3.3 请求空行
    request_blank = "\r\n"

    # 整体拼接
    request_data = request_line + request_header + request_blank

    # 4.发送请求协议
    tcp_client_socket.send(request_data.encode())

    # 5.接收服务器响应
    recv_data = tcp_client_socket.recv(4096)
    recv_text = recv_data.decode()

    # 找到响应数据中的html内容
    loc = recv_text.find("<html>")
    html_data = recv_text[loc:]
    print(html_data)

    # 关闭连接
    tcp_client_socket.close()