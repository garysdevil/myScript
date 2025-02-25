
import time
# from tool import *
# from browser import *
from selenium.webdriver.common.by import By

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service  # 引入 Service
import bit_api

driverPath = '/Users/gary/Library/Application Support/BitBrowser/chromedriver/126-arm/chromedriver'
debuggerAddress = '127.0.0.1:58969'

print(f"chromedriver 路径: {driverPath}")
print(f"调试地址: {debuggerAddress}")

chrome_options = Options()
chrome_options.add_experimental_option("debuggerAddress", debuggerAddress)

# 使用 Service 指定 chromedriver 路径
service = Service(executable_path=driverPath)
driver = webdriver.Chrome(service=service, options=chrome_options)  # 修改此处

# 检查窗口句柄
try:
    window_handles = driver.window_handles
    print(f"当前窗口句柄数量: {len(window_handles)}")
    if len(window_handles) > 0:
        print(f"可用窗口句柄: {window_handles}")
        driver.switch_to.window(window_handles[0])  # 切换到第一个窗口（最右边的窗口）
    else:
        print("警告: 没有找到任何窗口句柄，可能未连接到有效浏览器实例")
except Exception as e:
    print(f"获取窗口句柄失败: {e}")

# 测试控制能力
# 遍历所有窗口
valid_window = None
for handle in window_handles:
    try:
        driver.switch_to.window(handle)
        current_url = driver.current_url
        current_title = driver.title
        print(f"窗口 {handle} - URL: {current_url}, 标题: {current_title}")
        valid_window = handle
        break  # 找到有效窗口后退出
    except Exception as e:
        print(f"窗口 {handle} 无有效上下文: {e}")

if valid_window:
    driver.switch_to.window(valid_window)
    try:
        driver.get('https://www.baidu.com/')
        print(f"加载后标题: {driver.title}")
        time.sleep(5)
    except Exception as e:
        print(f"加载网页失败: {e}")
else:
    print("未找到任何有效窗口")

if __name__ == "__main__":
    print("hello")
