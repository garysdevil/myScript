
import requests
import time
import random
import fileinput
import gtools
import json

# https://doc.bitbrowser.cn/api-jie-kou-wen-dang/liu-lan-qi-jie-kou


SESSION = requests.session()
URL = gtools.get_bitc_url()

def bit_list():
    body = {'page': 0,
               "pageSize":2}
    temp = SESSION.post(f"{URL}/browser/list", json=body).json()
    # formatted_json = json.dumps(temp, indent=4, ensure_ascii=False)
    # print(formatted_json)
    list = temp['data']['list']
    return list


if __name__ == "__main__":
    list_window = bit_list()
    list_id = []
    list_seq = []
    for window in list_window:
        list_id.append(window['id'] +'\n')
        list_seq.append(window['seq'])
    list_id=list_id[::-1]
    list_seq=list_seq[::-1]
    # print(list_id)
    # print(list_seq)
    gtools.write_file(r"local/id.txt",list_id,'w+')