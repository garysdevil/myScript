from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC

driverPath = '/Users/gary/Library/Application Support/BitBrowser/chromedriver/126-arm/chromedriver'
debuggerAddress = '127.0.0.1:53918'

print(f"chromedriver 路径: {driverPath}")
print(f"调试地址: {debuggerAddress}")

chrome_options = Options()
chrome_options.add_experimental_option("debuggerAddress", debuggerAddress)

# 使用 Service 指定 chromedriver 路径
service = Service(executable_path=driverPath)
driver = webdriver.Chrome(service=service, options=chrome_options)  # 修改此处


def test_check():
    # 测试查看能力 遍历所有窗口，输出窗口句柄、URL 和标题
    print(f"窗口句柄数量: {len(driver.window_handles)}")
    for index, handle in enumerate(driver.window_handles):
        try:
            driver.switch_to.window(handle)
            current_url = driver.current_url
            current_title = driver.title
            print(f"{index} 窗口 {handle} - URL: {current_url}, 标题: {current_title}")
            # break  # 找到有效窗口后退出
        except Exception as e:
            print(f"{index} 窗口 {handle} 无有效上下文")
            # print(f"{index} 窗口 {handle} 无有效上下文 {e}")


def test_execute():
    # 测试控制能力 打开新标签页
    driver.switch_to.window(driver.window_handles[0]) # 切换到第一个打开的标签页
    driver.execute_script("window.open('');")
    driver.switch_to.window(driver.window_handles[-1])  # 切换到最新标签页
    driver.get('https://www.baidu.com/')  # 加载目标页面
    print(f"当前标题: {driver.title}")
    driver.quit()


def test_metamask():
    driver.switch_to.window(driver.window_handles[0])  # 切换到第一个打开的标签页
    driver.get('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#onboarding/welcome')  # 加载目标页面
    # 测试 1: 直接 find_element # 成功
    element = driver.find_element(By.XPATH, "//input[@id='onboarding__terms-checkbox']")
    element.click()
    print("直接 click 成功")

    # 测试 2: WebDriverWait # 失败
    try:
        checkbox = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//input[@id='onboarding__terms-checkbox']"))
        )
        print("WebDriverWait 找到元素")
    except Exception as e:
        print(f"WebDriverWait 错误: {e}")

    # 测试 3: ActionChains # 成功
    try:
        checkbox = driver.find_element(By.XPATH, "//input[@id='onboarding__terms-checkbox']")
        ActionChains(driver).move_to_element(checkbox).click().perform()
        print("ActionChains 成功")
    except Exception as e:
        print(f"ActionChains 错误: {e}")



if __name__ == "__main__":
    print("hello")
    test_check()
    # test_execute()
