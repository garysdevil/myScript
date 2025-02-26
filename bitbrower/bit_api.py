import requests

# 官方文档地址，需要科学上网使用
# http://doc.bitbrowser.cn/api-jie-kou-wen-dang/ben-di-fu-wu-zhi-nan

request = requests.session()
url = "http://127.0.0.1:54345"

# import psutil
# def get_bitbrower_url():
#     """
#     获取比特浏览器的本地监听URL。
#     遍历所有进程，找到名为'比特浏览器'的进程，并获取其监听的端口号，构建URL返回。
#     """
#     url = "http://127.0.0.1:"
#     for proc in psutil.process_iter():
#         if proc.name() == '比特浏览器':  # windows环境 比特浏览器.exe
#             for x in proc.net_connections():
#                 if x.status == psutil.CONN_LISTEN:
#                     url = url + str(x.laddr.port)
#                     return url
#     return None


def createOrUpdateBrowser():  # 创建或者更新窗口
    headers = {
        # 'id': '2c9c29a2801851fe01801d5c64c600b2', # 有值时为修改，无值是添加
        # 'groupId': '2c996b378054663b01805a69f0344410', # 群组ID，绑定群组时传入，如果登录的是子账号，则必须赋值，否则会自动分配到主账户下面去
        'platform': 'https:#www.facebook.com',  # 账号平台
        'platformIcon': 'facebook',  # 取账号平台的 hostname 或者设置为other
        'url': '',  # 打开的url，多个用,分开
        'name': 'google',  # 窗口名称
        'remark': '',  # 备注
        'userName': '',  # 用户账号
        'password': '',  # 用户密码
        'cookie': '',  # Cookie，符合标准的序列化字符串，具体可参考文档
        # IP库，默认ip-api，选项 ip-api | ip123in | luminati，luminati为Luminati专用
        'ipCheckService': 'ip-api',
        'proxyMethod': 2,  # 代理方式 2自定义 3 提取IP
        # 代理类型  ['noproxy', 'http', 'https', 'socks5', '911s5']
        'proxyType': 'noproxy',
        'host': '12.132.234.12',  # 代理主机
        'port': 99999,  # 代理端口
        'proxyUserName': '',  # 代理账号
        'proxyPassword': '',  # 代理密码
        'ip': '',  # ip
        'city': '',  # 城市
        'province': '',  # 州/省
        'country': '',  # 国家地区
        'dynamicIpUrl': '',  # 提取IP url，参考文档
        'dynamicIpChannel': '',  # 提取IP服务商，参考文档
        'isDynamicIpChangeIp': True,  # 提取IP方式，参考文档
        'isGlobalProxyInfo': False,  # 提取IP设置，参考文档
        'isIpv6': False,  # 是否是IP6
        'syncTabs': True,  # 同步标签页
        'syncCookies': True,  # 同步Cookie
        'syncIndexedDb': False,  # 同步IndexedDB
        'syncLocalStorage': False,  # 同步 Local Storage
        'syncBookmarks': True,  # 同步书签
        'credentialsEnableService': False,  # 禁止保存密码弹窗
        'syncHistory': False,  # 保存历史记录
        'clearCacheFilesBeforeLaunch': False,  # 启动前清理缓存文件
        'clearCookiesBeforeLaunch': False,  # 启动前清理cookie
        'clearHistoriesBeforeLaunch': False,  # 启动前清理历史记录
        'randomFingerprint': False,  # 每次启动均随机指纹
        # 浏览器窗口工作台页面，默认 chuhai2345,不展示填 disable 可选 chuhai2345 | localserver | disable
        'workbench': 'chuhai2345',
        'disableGpu': False,  # 关闭GPU硬件加速 False取反 默认 开启
        'enableBackgroundMode': False,  # 关闭浏览器后继续运行应用
        'disableTranslatePopup': False,  # 翻译弹窗
        'syncExtensions': False,  # 同步扩展应用数据
        'syncUserExtensions': False,  # 跨窗口同步扩展应用
        'allowedSignin': False,  # 允许google账号登录浏览器
        'abortImage': False,  # 禁止加载图片
        'abortMedia': False,  # 禁止视频自动播放
        'muteAudio': False,  # 禁止播放声音
        'stopWhileNetError': False,  # 网络不通停止打开
        "browserFingerPrint": {
            'coreVersion': '104',  # 内核版本，默认104，可选92
            'ostype': 'PC',  # 操作系统平台 PC | Android | IOS
            'os': 'Win32',  # 为navigator.platform值 Win32 | Linux i686 | Linux armv7l | MacIntel，当ostype设置为IOS时，设置os为iPhone，ostype为Android时，设置为 Linux i686 | | Linux armv7l
            'version': '',  # 浏览器版本，不填随机
            'userAgent': '',  # ua，不填则自动生成
            'isIpCreateTimeZone': True,  # 基于IP生成对应的时区
            'timeZone': '',  # 时区，isIpCreateTimeZone 为False时，参考附录中的时区列表
            'timeZoneOffset': 0,  # isIpCreateTimeZone 为False时设置，时区偏移量
            'webRTC': '0',  # webrtc 0替换 | 1允许 | 2禁止
            'ignoreHttpsErrors': False,  # 忽略https证书错误，True | False
            'position': '1',  # 地理位置 0询问 | 1允许 | 2禁止
            'isIpCreatePosition': True,  # 是否基于IP生成对应的地理位置
            'lat': '',  # 经度 isIpCreatePosition 为False时设置
            'lng': '',  # 纬度 isIpCreatePosition 为False时设置
            'precisionData': '',  # 精度米 isIpCreatePosition 为False时设置
            'isIpCreateLanguage': True,  # 是否基于IP生成对应国家的浏览器语言
            'languages': '',  # isIpCreateLanguage 为False时设置，值参考附录
            'isIpCreateDisplayLanguage': False,  # 是否基于IP生成对应国家的浏览器界面语言
            'displayLanguages': '',  # isIpCreateDisplayLanguage 为False时设置，默认为空，即跟随系统，值参考附录
            'openWidth': 1280,  # 窗口宽度
            'openHeight': 720,  # 窗口高度
            'resolutionType': '0',  # 分辨率类型 0跟随电脑 | 1自定义
            'resolution': '1920 x 1080',  # 自定义分辨率时，具体值
            'windowSizeLimit': True,  # 分辨率类型为自定义，且ostype为PC时，此项有效，约束窗口最大尺寸不超过分辨率
            'devicePixelRatio': 1,  # 显示缩放比例，默认1，填写时，建议 1｜1.5 | 2 | 2.5 | 3
            'fontType': '2',  # 字体生成类型 0系统默认 | 1自定义 | 2随机匹配
            'font': '',  # 自定义或随机匹配时，设置的字体值，值参考附录字体
            'canvas': '0',  # canvas 0随机｜1关闭
            'canvasValue': None,  # canvas为0随机时设置， 噪音值 10000 - 1000000
            'webGL': '0',  # webGL图像，0随机｜1关闭
            'webGLValue': None,  # webGL为0时，随机噪音值 10000 - 1000000
            'webGLMeta': '0',  # webgl元数据 0自定义｜1关闭
            'webGLManufacturer': '',  # webGLMeta 自定义时，webGL厂商值，参考附录
            'webGLRender': '',  # webGLMeta自定义时，webGL渲染值，参考附录
            'audioContext': '0',  # audioContext值，0随机｜1关闭
            'audioContextValue': None,  # audioContext为随机时，噪音值， 1 - 100 ，关闭时默认10
            'mediaDevice': '0',  # 媒体设备信息，0自定义｜1关闭
            'mediaDeviceValue': None,  # mediaDevice 噪音值，不填则由系统生成，填值时，参考附录
            'speechVoices': '0',  # Speech Voices，0随机｜1关闭
            'speechVoicesValue': None,  # speechVoices为0时，随机时由系统自动生成，自定义时，参考附录
            'hardwareConcurrency': '4',  # 硬件并发数
            'deviceMemory': '8',  # 设备内存
            'doNotTrack': '0',  # doNotTrack 1开启｜0关闭
            # ClientRects True使用相匹配的值代替您真实的ClientRects | False每个浏览器使用当前电脑默认的ClientRects
            'clientRectNoiseEnabled': True,
            'clientRectNoiseValue': 0,  # clientRectNoiseEnabled开启时随机，值 1 - 999999
            'portScanProtect': '0',  # 端口扫描保护 0开启｜1关闭
            'portWhiteList': '',  # 端口扫描保护开启时的白名单，逗号分隔
            'deviceInfoEnabled': True,  # 自定义设备信息，默认开启
            'computerName': '',  # deviceInfoEnabled 为True时，设置
            'macAddr': '',  # deviceInfoEnabled 为True时，设置
            # ssl是否禁用特性，默认不禁用，注意开启后自定义设置时，有可能会导致某些网站无法访问
            'disableSslCipherSuitesFlag': False,
            'disableSslCipherSuites': None,  # ssl 禁用特性，序列化的ssl特性值，参考附录
            'enablePlugins': False,  # 是否启用插件指纹
            'plugins': ''  # enablePlugins为True时，序列化的插件值，插件指纹值参考附录
        }
    }

    res = request.post(f"{url}/browser/update", json=headers).json()
    print("createOrUpdateBrowser() res:",res)
    browserId = res['data']['id']
    print(browserId)
    return browserId


def openBrowser(id):  # 打开窗口
    # headers = {'id': f'{createOrUpdateBrowser()}'}
    headers = {'id': f'{id}', 'args': ["--disable-web-security"]}
    res = request.post(f"{url}/browser/open", json=headers).json()
    print(res)
    # print(res['data']['http'])
    return res


def closeBrowser(id):  # 关闭窗口
    headers = {'id': f'{id}'}
    request.post(f"{url}/browser/close", json=headers).json()

def deleteBrowser(id):  # 删除窗口
    headers = {'id': f'{id}'}
    print(request.post(f"{url}/browser/delete", json=headers).json())



if __name__ == '__main__':
    createOrUpdateBrowser()
