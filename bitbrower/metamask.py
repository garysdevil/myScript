
import time
from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support import expected_conditions as EC

from configs import local_config
import bit_api

def get_driver(id):
    res = bit_api.openBrowser(id)
    driverPath = res['data']['driver']
    debuggerAddress = res['data']['http']

    print(f"driverPath={driverPath}")
    print(f"id={id}")
    print(f"debuggerAddress={debuggerAddress}")

    chrome_options = Options()
    chrome_options.add_experimental_option("debuggerAddress", debuggerAddress)

    # 使用 Service 指定 chromedriver 路径
    service = Service(executable_path=driverPath)
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def switch_to_metamask_tab(driver: webdriver.Chrome):
    for index, handle in enumerate(driver.window_handles):
        try:
            driver.switch_to.window(handle)
            current_url = driver.current_url
            if current_url == 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#onboarding/welcome':
                break
        except Exception as e:
            print(f"{index} 窗口 {handle} 无有效上下文")


def metamask_setup(driver: webdriver.Chrome, seed_phrase, password):
    try:
        driver.find_element(By.XPATH,'//input[@id="onboarding__terms-checkbox"]').click() # 点击打勾 我同意MetaMask的使用条款
        driver.find_element(By.XPATH,'//button[@data-testid="onboarding-import-wallet"]').click() # 点击按钮 导入现有钱包 # driver.find_element(By.XPATH,'//button[text()="导入现有钱包"]').click()
        time.sleep(1)
        
        driver.find_element(By.XPATH,'//button[@data-testid="metametrics-no-thanks"]').click() # 点击按钮 不，谢谢
        time.sleep(1)

        driver.find_element(By.XPATH,'//*[@id="import-srp__srp-word-0"]').send_keys(seed_phrase) # 导入助记词
        driver.find_element(By.XPATH,'//button[@data-testid="import-srp-confirm"]').click() # 点击按钮 确认私钥助记词
        time.sleep(1)
        
        driver.find_element(By.XPATH,'//input[@data-testid="create-password-new"]').send_keys(password)
        driver.find_element(By.XPATH,'//input[@data-testid="create-password-confirm"]').send_keys(password)
        driver.find_element(By.XPATH,"//input[@data-testid='create-password-terms']").click() # 点击打勾 我明白 MetaMask 无法为我恢复此密码。了解更多
        driver.find_element(By.XPATH,'//button[@data-testid="create-password-import"]').click() # 点击按钮 导入我的钱包
        time.sleep(1)

        driver.find_element(By.XPATH,'//button[@data-testid="onboarding-complete-done"]').click() # 点击按钮 完成
        time.sleep(1)

        driver.find_element(By.XPATH,'//button[@data-testid="pin-extension-next"]').click() # 点击按钮 下一步
        time.sleep(1)

        driver.find_element(By.XPATH,'//button[@data-testid="pin-extension-done"]').click()  # 点击按钮 完成
        time.sleep(1)
        
        print("正在导入，等待5秒")
        time.sleep(5)
    except Exception as e:
        print(f"错误 {e}")


if __name__ == "__main__":
    print("hello")
    seed_phrase = local_config.metamask.get('seed_phrase')
    seed_phrase = seed_phrase.replace(' ', '\t\t')
    password = local_config.metamask.get('password')
    id = local_config.selenium.get('id')
    driver = get_driver(id)
    print("获取driver成功，等待5秒")
    time.sleep(5)
    switch_to_metamask_tab(driver)
    print("切换标签成功")
    metamask_setup(driver, seed_phrase, password)
    print("导入metamask成功")
