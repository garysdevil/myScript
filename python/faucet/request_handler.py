# request_handler.py

import requests
from fake_useragent import UserAgent
from requests.auth import HTTPProxyAuth

def create_user_agent():
    ua = UserAgent()
    return ua.random

def create_proxy_auth(proxy):
    if '@' in proxy:
        proxy_url = proxy.split('@')[0]
        auth = proxy.split('@')[1].split(':')
        return HTTPProxyAuth(auth[0], auth[1]), proxy_url
    return None, proxy

def make_request(url, params, proxies):
    headers = {"User-Agent": create_user_agent()}
    proxy = proxies.pop(0) if proxies else None
    auth, proxy_url = create_proxy_auth(proxy)
    try:
        if params:
            response = requests.post(url, json=params, headers=headers, proxies={"http": proxy_url, "https": proxy_url}, auth=auth)
        else:
            response = requests.get(url, headers=headers, proxies={"http": proxy_url, "https": proxy_url}, auth=auth)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None
