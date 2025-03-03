import configparser


# 读取配置文件
config = configparser.ConfigParser()
config.read('local/config.ini')

# 获取配置项
bitbrower_url = config['bitbrower']['url']
metamask_password =  config['metamask']['password']

bitbrower_id1 = config['bitbrower']['id1']
metamask_mnemonic1 = config['metamask']['mnemonic1']

# bitbrower_kv = config.getint('bitbrower', 'KV为数值的项')  # 转为整数
# bitbrower_kv = config.getboolean('bitbrower', 'KV为True或False的项')  # True (转为布尔值)

print("========================================")
print(f"bitbrower_url: {bitbrower_url}\nmetamas_password: {metamask_password}")
print("========================================")