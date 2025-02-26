
import time
# from tool import *
# from browser import *
from selenium.webdriver.common.by import By

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service  # 引入 Service
import pyautogui


driverPath = '/Users/gary/Library/Application Support/BitBrowser/chromedriver/126-arm/chromedriver'
debuggerAddress = '127.0.0.1:63907'

print(f"chromedriver 路径: {driverPath}")
print(f"调试地址: {debuggerAddress}")

chrome_options = Options()
chrome_options.add_experimental_option("debuggerAddress", debuggerAddress)
chrome_options.add_argument("--disable-features=LavaMoat") 

# 使用 Service 指定 chromedriver 路径
service = Service(executable_path=driverPath)
driver = webdriver.Chrome(service=service, options=chrome_options)  # 修改此处

# # 测试查看能力 遍历所有窗口，输出窗口句柄、URL 和标题
# print(f"窗口句柄数量: {len(driver.window_handles)}")
# for handle in driver.window_handles:
#     try:
#         driver.switch_to.window(handle)
#         current_url = driver.current_url
#         current_title = driver.title
#         print(f"窗口 {handle} - URL: {current_url}, 标题: {current_title}")
#         # break  # 找到有效窗口后退出
#     except Exception as e:
#         # print(f"窗口 {handle} 无有效上下文: {e}")
#         print(f"窗口 {handle} 无有效上下文")

# # 测试控制能力 打开新标签页
# driver.execute_script("window.open('');")
# driver.switch_to.window(driver.window_handles[-1])  # 切换到最新标签页
# driver.get('https://www.baidu.com/')  # 加载目标页面
# print(f"当前标题: {driver.title}")
# driver.quit()



def metamaskSetup(driver, recovery_phrase):
    
    try:
        driver.execute_script("window.open('');")
        driver.switch_to.window(driver.window_handles[-1])
        driver.get("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#onboarding/welcome")
        P1 = (0, 0) # 我同意MetaMask的使用条款
        pyautogui.click(*P1)
        for i in range(2):
            pyautogui.press("tab")
        pyautogui.press("enter") # 点击 “创建新钱包”
        for i in range(4):
            pyautogui.press("tab")
        pyautogui.press("enter") # 点击 “不，谢谢”

        
        driver.get("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#onboarding/import-with-recovery-phrase")
        # driver.get('https://github.com/LavaMoat/LavaMoat/pull/360')  # 加载目标页面
        # body = driver.find_element(By.TAG_NAME, "body")

       
        P1 = (425, 357)
        P2 = (653, 633)
         # 滚动到底部
        pyautogui.moveTo(300, 300)  # 移到窗口内
        pyautogui.scroll(-1000)  # 向下滚动
        time.sleep(1)  # 等待滚动完成
        pyautogui.click(*P1)
        time.sleep(1)
        words = recovery_phrase.split()
        for word in words:
            pyautogui.typewrite(word)
            print(word)
            pyautogui.press("tab")
            pyautogui.press("tab")
        pyautogui.click(*P2)  # 调整坐标
        pyautogui.typewrite('password')
        pyautogui.press("tab")
        pyautogui.typewrite('password')
        pyautogui.press("tab")
        pyautogui.press("enter") # 勾选 “我明白 MetaMask 无法为我恢复此密码”
        pyautogui.press("tab")
        pyautogui.press("tab")
        pyautogui.press("enter") # 点击 “创建新钱包”


    except Exception as e:
        print(f"错误 {e}")


if __name__ == "__main__":
    print("hello")
    metamaskSetup(driver,'')
