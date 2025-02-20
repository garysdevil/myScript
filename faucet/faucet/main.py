# main.py

from config import API_URL, PARAMS_LIST
from proxy_loader import load_proxies
from request_handler import make_request

def main():
    proxy_file_path = "local.proxies.txt"  # 代理IP文件路径
    proxies = load_proxies(proxy_file_path)

    for params in PARAMS_LIST:
        if not proxies:
            print("代理列表为空。")
            break
        result = make_request(API_URL, params, proxies)
        print(result)

if __name__ == "__main__":
    main()
