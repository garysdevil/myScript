
import requests
import time
import random
import fileinput
import gtools
import json

# https://doc.bitbrowser.cn/api-jie-kou-wen-dang/liu-lan-qi-jie-kou


SESSION = requests.session()
URL = gtools.get_bitbrower_url()

def bit_list():
    body = {'page': 0,
               "pageSize":25}
    temp = SESSION.post(f"{URL}/browser/list", json=body).json()
    # formatted_json = json.dumps(temp, indent=4, ensure_ascii=False)
    # print(formatted_json)
    list = temp['data']['list']
    return list


if __name__ == "__main__":
    list_window = bit_list()
    list_seq_id = []
    for window in list_window:
        list_seq_id.append(str(window['seq']) + " " + window['id'] +'\n')
    list_seq_id=list_seq_id[::-1]
    # print(list_seq_id)
    gtools.write_file(r"local/seq_id.txt",list_seq_id,'w+')