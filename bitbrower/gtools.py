# 获取指纹浏览器使用端口
import psutil
import os

def get_bitc_url():
    """
    获取比特浏览器的本地监听URL。
    遍历所有进程，找到名为'比特浏览器'的进程，并获取其监听的端口号，构建URL返回。
    """
    url = "http://127.0.0.1:"
    for proc in psutil.process_iter():
        if proc.name() == '比特浏览器':  # windows环境 比特浏览器.exe
            for x in proc.net_connections():
                if x.status == psutil.CONN_LISTEN:
                    url = url + str(x.laddr.port)
                    return url
    return None

# 写入文件
def write_file(file_name, data_list, mode='a'):
    """
    将数据列表写入文件。
    :param file_name: 文件名
    :param data_list: 要写入的数据列表
    :param mode: 文件打开模式，默认为追加模式
    """
    path = r"%s/%s" % (os.getcwd(), file_name)
    with open(path, mode, newline="") as wf:
        wf.writelines(data_list)

def read_file(file_name):
    """
    读取txt文件并返回每行数据的列表。
    :param file_name: 文件名
    :return: 包含每行数据的列表
    """
    lines = []
    with open(file_name, 'r', encoding="UTF-8") as file_to_read:
        lines = file_to_read.readlines()
    return lines

def clear_file(filename):
    with open(filename, "w") as file:
        file.write("")

if __name__ == "__main__":
    print('gtools.py')
    # a = read_file(r"local/id.txt")
    # print(a)