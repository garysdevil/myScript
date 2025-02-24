import os


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