
import requests
import time
import random
import fileinput
import myjs.bitbrower.gutils as gutils
import json
from configs import local_config

# https://doc.bitbrowser.cn/api-jie-kou-wen-dang/liu-lan-qi-jie-kou

session = requests.session()
url = local_config.bitbrower.get("url") or "http://127.0.0.1:54345"

def bit_list():
    headers = {'page': 0,
               "pageSize":25}
    temp = session.post(f"{url}/browser/list", json=headers).json()
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
    gutils.write_file(r"local/seq_id.txt",list_seq_id,'w+')