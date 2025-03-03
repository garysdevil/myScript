import configparser

from logger import get_logger

# 初始化 logger，默认同时输出到文件和控制台
logger = get_logger('bit_log', log_file='metamask.log', to_console=True)

# 读取配置文件
config = configparser.ConfigParser()
config.read('local/config.ini')

# 获取配置项
bitbrower_url = config['bitbrower']['url']
metamask_password =  config['metamask']['password']

operation_seqstart = config.getint('operation','seqstart')
operation_seqend = config.getint('operation','seqend')

bitbrower_id1 = config['bitbrower']['id1']
metamask_mnemonic1 = config['metamask']['mnemonic1']

# bitbrower_kv = config.getint('bitbrower', 'KV为数值的项')  # 转为整数
# bitbrower_kv = config.getboolean('bitbrower', 'KV为True或False的项')  # True (转为布尔值)

logger.info("========================================")
logger.info(f"bitbrower_url: {bitbrower_url})")
logger.info(f"metamask_password: {metamask_password}")
logger.info(f"seqstart: {operation_seqstart}")
logger.info(f"seqend: {operation_seqend}")
logger.info("========================================")