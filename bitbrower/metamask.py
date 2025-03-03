# metamask_setup.py
import time
from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

import bit_api
from logger import get_logger

# 初始化 logger，默认同时输出到文件和控制台
logger = get_logger('bit_log', to_console=True)

def get_driver(id: str) -> webdriver.Chrome:
    """获取Chrome驱动实例"""

    res = bit_api.openBrowser(id)
    if res.get('success') == False:
        logger.error(f"get_driver: {res}")
        return None
    driver_path = res['data']['driver']
    debugger_address = res['data']['http']
    
    logger.info(f"Initializing driver - ID: {id}, Path: {driver_path}, Address: {debugger_address}")
    
    chrome_options = Options()
    chrome_options.add_experimental_option("debuggerAddress", debugger_address)
    service = Service(executable_path=driver_path)
    return webdriver.Chrome(service=service, options=chrome_options)

def switch_to_metamask_tab(driver: webdriver.Chrome) -> bool:
    """切换到MetaMask标签页"""
    for index, handle in enumerate(driver.window_handles):
        try:  
            driver.switch_to.window(handle)
            current_url = driver.current_url
            if current_url == 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#onboarding/welcome':
                logger.info(f"Successfully switched to MetaMask Import tab at index {index}")
                return True
        except Exception as e:
            # logger.warning(f"Window {index} ({handle}) has no valid context: {str(e)}")
            logger.warning(f"Window {index} ({handle}) has no valid context")
    logger.info("Switched to MetaMask Import tab faile, myabe it is imorted already")
    return False

def metamask_setup(driver: webdriver.Chrome, seed_phrase: str, password: str) -> None:
    """执行MetaMask钱包设置"""

    try:
        # 同意条款
        driver.find_element(By.XPATH, '//input[@id="onboarding__terms-checkbox"]').click() # 点击打勾 我同意MetaMask的使用条款
        driver.find_element(By.XPATH, '//button[@data-testid="onboarding-import-wallet"]').click() # 点击按钮 导入现有钱包 # driver.find_element(By.XPATH, '//button[text()="导入现有钱包"]').click()
        time.sleep(1)
        
        # 拒绝数据收集
        driver.find_element(By.XPATH, '//button[@data-testid="metametrics-no-thanks"]').click() # 点击按钮 不，谢谢
        time.sleep(1)

        # 输入助记词
        driver.find_element(By.XPATH, '//*[@id="import-srp__srp-word-0"]').send_keys(seed_phrase) # 导入助记词
        driver.find_element(By.XPATH, '//button[@data-testid="import-srp-confirm"]').click() # 点击按钮 确认私钥助记词
        time.sleep(1)
        
        # 设置密码
        driver.find_element(By.XPATH, '//input[@data-testid="create-password-new"]').send_keys(password)
        driver.find_element(By.XPATH, '//input[@data-testid="create-password-confirm"]').send_keys(password)
        driver.find_element(By.XPATH, "//input[@data-testid='create-password-terms']").click() # 点击打勾 我明白 MetaMask 无法为我恢复此密码。了解更多
        driver.find_element(By.XPATH, '//button[@data-testid="create-password-import"]').click() # 点击按钮 导入我的钱包
        time.sleep(1)

        # 完成设置
        driver.find_element(By.XPATH, '//button[@data-testid="onboarding-complete-done"]').click() # 点击按钮 完成
        time.sleep(1)
        driver.find_element(By.XPATH, '//button[@data-testid="pin-extension-next"]').click() # 点击按钮 下一步
        time.sleep(1)
        driver.find_element(By.XPATH, '//button[@data-testid="pin-extension-done"]').click()  # 点击按钮 完成
        time.sleep(1)
        
        logger.info("Importing wallet, waiting 5 seconds")
        time.sleep(5)

    except Exception as e:
        logger.error(f"Setup failed: {str(e)}")
        raise

def allinone(id: str, seed_phrase: str, password: str) -> None:
    """执行完整的MetaMask设置流程"""
    try:
        driver = get_driver(id)
        if driver == None:
            logger.error(f"Driver not found")
            return
        logger.info(f"Driver acquired successfully, waiting 5 seconds")
        time.sleep(5)

        if switch_to_metamask_tab(driver):
            logger.info(f"Tab switched successfully, waiting 1 seconds")
            time.sleep(1)
            formatted_seed = seed_phrase.replace(' ', '\t\t')
            metamask_setup(driver, formatted_seed, password)
            logger.info(f"MetaMask imported successfully")

    except Exception as e:
        logger.error(f"Process failed: {str(e)}")
    finally:
        bit_api.closeBrowser(id)
        logger.info(f"Browser closed successfully")

# 测试案例
if __name__ == "__main__":
    from config import gconfig 
    logger.info("Starting MetaMask setup process")
    mnemonic = gconfig.metamask_mnemonic1
    password = gconfig.metamask_password
    id = gconfig.bitbrower_id1
    allinone(id, mnemonic, password)
    logger.info(f"{id} Process completed")