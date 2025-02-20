## mac环境运行
```bash
# 虚拟一个python环境
python3 -m venv local_env_1
source local_env_1/bin/activate

python3 -m pip install -r requirements.txt
```
```bash
# 退出 虚拟环境
deactivate
```
## prompt
```md
# 通过Python语言实现一个项目，完成以下需求
1. Python 请求指定API
2. 使用python3和pip3
3. 每次请求模拟不同的客户端
4. 每次请求使用不同的代理IP，代理IP可能是https也可能是socks5，并且带有用户和密码。ip端口用户密码放在proxies.txt文件内
5. 使用 fake-useragent 生成 User-Agent
6. 代码尽量模块化
7. 从另一个文件读取代理IP
8. 依赖包使用最新版本
9. 可能是post请求application/json格式的，也可能是get请求
10. 有一批参数，每次请求时，按顺序取出一个参数传进请求函数内。这个需求的代码和上面的代码进行模块化分开。

```