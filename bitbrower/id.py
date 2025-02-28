import requests
import json
from configs import local_config

# API 文档: https://doc.bitbrowser.cn/api-jie-kou-wen-dang/liu-lan-qi-jie-kou

# 初始化 session 和 URL
session = requests.Session()
url = local_config.bitbrower.get("url", "http://127.0.0.1:54345")

def bit_list():
    """获取 BitBrowser 窗口列表"""
    payload = {
        "page": 0,
        "pageSize": 25
    }
    response = session.post(f"{url}/browser/list", json=payload)
    response.raise_for_status()  # 检查请求是否成功
    data = response.json()
    return data["data"]["list"]

def format_to_json(window_list):
    """将窗口列表格式化为指定 JSON 结构"""
    result = [{"seq": window["seq"], "bitid": window["id"]} for window in window_list]
    return result

def write_json_to_file(data, filepath):
    """将 JSON 数据写入文件，每对象一行，带逗号分隔，包裹在数组中"""
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("[")  # 写入数组开头
        for i, item in enumerate(data):
            # 将每个对象转为 JSON 字符串，无缩进
            line = json.dumps(item, ensure_ascii=False)
            # 如果不是最后一个对象，添加逗号和换行
            if i < len(data) - 1:
                line += ","
            f.write(line + "\n")
        f.write("]")  # 写入数组结尾

if __name__ == "__main__":
    # 获取窗口列表
    window_list = bit_list()
    window_list = bit_list()[::-1]  # 倒序，让其从小到大

    # 转换为指定 JSON 格式
    json_data = format_to_json(window_list)
    
    # 可选：打印格式化后的 JSON（用于调试）
    print(json.dumps(json_data, indent=4, ensure_ascii=False))
    
    # 使用封装的函数写入文件
    write_json_to_file(json_data, "local/bitid.json")