
import requests
import time
import random
import fileinput
import gtools

# https:#doc.bitbrowser.cn/api-jie-kou-wen-dang/liu-lan-qi-jie-kou

SESSION = requests.session()
URL = "http://127.0.0.1:54345"

def bit_proxy(id, proxy):
    if proxy == "":
        # 不设置代理
        headers = {'ids': [id],
                "ipCheckService":"ip-api",
                "proxyMethod":2,
                "proxyType":"noproxy"
                }
    else:
        proxy_temp = proxy.split(":")
        host = proxy_temp[0]
        port = proxy_temp[1]
        proxyUserName = proxy_temp[2]
        proxyPassword = proxy_temp[3]
        # 设置代理socket5
        headers = {'ids': [id],
                "ipCheckService":"ip-api",
                "proxyMethod":2,
                "proxyType":"socks5",
                "host":host,
                "port":port,
                "proxyUserName":proxyUserName,
                "proxyPassword":proxyPassword,
                }
    result = SESSION.post(f"{URL}/browser/proxy/update", json=headers).json()
    # print(result)
    # print(result['data']['list'])
    return result

if __name__ == "__main__":
    list_seq_id = gtools.read_file(r'local/seq_id.txt')
    list_proxy = gtools.read_file(r'local/proxy.txt')
    for i in range(len(list_seq_id)):
        seq_id = list_seq_id[i].strip().split(" ")
        seq, id = seq_id
        # if len(seq_id) == 2:
        #     seq, id = seq_id
        #     print(f"seq: {seq}, id: {id}")
        # else:
        #     print(f"Invalid format: {list_seq_id[i]}")
        print(id, list_proxy[i])
        msg = bit_proxy(id, list_proxy[i])
        print(msg)