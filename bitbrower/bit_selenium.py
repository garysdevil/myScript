from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service  # 引入 Service
import bit_api

# /browser/open 接口会返回 selenium 使用的 http 地址，以及 webdriver 的 path，直接使用即可
res = bit_api.openBrowser('d6515786c8054ec69fcbab56a758a440')
driverPath = res['data']['driver']
debuggerAddress = res['data']['http']

print(driverPath)
print(debuggerAddress)

chrome_options = Options()
chrome_options.add_experimental_option("debuggerAddress", debuggerAddress)

# 使用 Service 指定 chromedriver 路径
service = Service(executable_path=driverPath)
driver = webdriver.Chrome(service=service, options=chrome_options)  # 修改此处
driver.get('https://www.baidu.com/')