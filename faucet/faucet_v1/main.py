import requests
import random
import json
from fake_useragent import UserAgent
from time import sleep

class APIClient:
    def __init__(self, proxy_file, param_file):
        self.proxy_file = proxy_file
        self.param_file = param_file
        self.user_agent = UserAgent()
        self.proxies = self.load_proxies()
        self.params = self.load_params()

    def load_proxies(self):
        """从文件中加载代理列表"""
        with open(self.proxy_file, 'r') as file:
            proxies = [line.strip() for line in file if line.strip()]
        return proxies

    def load_params(self):
        """从文件中加载请求参数"""
        with open(self.param_file, 'r') as file:
            return json.load(file)

    def get_random_proxy(self):
        """随机选择一个代理"""
        proxy = random.choice(self.proxies)
        if proxy.startswith("https"):
            return {
                "https": proxy
            }
        elif proxy.startswith("socks5"):
            return {
                "http": proxy,
                "https": proxy
            }
        return None

    def get_headers(self):
        """生成带有随机 User-Agent 的请求头"""
        headers = {
            "User-Agent": self.user_agent.random
        }
        return headers

    def make_get_request(self, api_url, params):
        """发送 GET 请求"""
        proxy = self.get_random_proxy()
        headers = self.get_headers()
        try:
            response = requests.get(api_url, headers=headers, proxies=proxy, params=params, timeout=10)
            return response.text
        except requests.exceptions.RequestException as e:
            print(f"GET 请求出错: {e}")
            return None

    def make_post_request(self, api_url, payload):
        """发送 POST 请求"""
        proxy = self.get_random_proxy()
        headers = self.get_headers()
        headers['Content-Type'] = 'application/json'
        try:
            response = requests.post(api_url, headers=headers, proxies=proxy, json=payload, timeout=10)
            return response.text
        except requests.exceptions.RequestException as e:
            print(f"POST 请求出错: {e}")
            return None

    def run(self, num_requests, api_url, request_type="GET", post_payload=None):
        """循环进行多次请求，每次请求传入不同的参数"""
        for i in range(num_requests):
            print(f"正在进行第 {i + 1} 次请求 ({request_type}) ...")
            if request_type == "GET":
                params = self.params.get(f"params_{i+1}", {})
                response = self.make_get_request(api_url, params)
            elif request_type == "POST":
                response = self.make_post_request(api_url, post_payload)
            
            if response:
                print(f"响应: {response[:200]}")  # 打印前200个字符
            sleep(random.uniform(1, 3))  # 随机休眠时间，防止被封锁

if __name__ == "__main__":
    # 代理文件路径
    proxy_file = "proxies.txt"
    
    # 参数文件路径
    param_file = "params.json"
    
    # API URL 和 请求类型
    api_url_get = "https://jsonplaceholder.typicode.com/todos/1"  # 示例GET请求
    api_url_post = "https://jsonplaceholder.typicode.com/posts"   # 示例POST请求
    post_payload = {"title": "foo", "body": "bar", "userId": 1}

    # 创建 APIClient 实例并执行
    client = APIClient(proxy_file, param_file)
    
    # GET 请求
    print("开始GET请求:")
    client.run(num_requests=5, api_url=api_url_get, request_type="GET")
    
    # POST 请求
    print("\n开始POST请求:")
    client.run(num_requests=3, api_url=api_url_post, request_type="POST", post_payload=post_payload)
