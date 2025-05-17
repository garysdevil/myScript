#!/usr/bin/env python3
"""
vCard 与 Excel 转换工具
=======================

此脚本提供命令行工具，用于将 vCard (.vcf) 文件与 Excel (.xlsx) 文件相互转换。
支持 vCard 文件的编码检测，处理常见字段如姓名、邮箱、电话、组织、地址、生日和备注。

依赖库：
- pandas：处理 Excel 文件
- openpyxl：写入 Excel 文件
- vobject：解析和生成 vCard 文件
- chardet：检测文件编码

安装：
    pip install pandas openpyxl vobject chardet

使用方法：
    python vcard_xls_converter.py
    按照交互菜单选择转换选项。

支持的字段：
- Full Name（必需）
- Organization
- Email
- Phone
- Address
- Birthday（YYYY-MM-DD 格式）
- Note

作者：Grok 3 (由 xAI 构建)
日期：2025年5月17日
"""

import os
import sys
from typing import List, Dict
import pandas as pd
import vobject
import chardet


def detect_encoding(file_path: str) -> str:
    """检测文件的编码格式。

    Args:
        file_path: 要分析的文件的路径。

    Returns:
        检测到的编码格式（如 'utf-8', 'gbk'）。

    Raises:
        FileNotFoundError: 如果文件不存在。
    """
    try:
        with open(file_path, 'rb') as file:
            raw_data = file.read()
        result = chardet.detect(raw_data)
        return result['encoding'] or 'utf-8'
    except FileNotFoundError:
        raise FileNotFoundError(f"文件未找到：{file_path}")


def vcf_to_xls(vcf_file: str, xls_file: str) -> None:
    """将 vCard (.vcf) 文件转换为 Excel (.xlsx) 文件。

    Args:
        vcf_file: 输入 vCard 文件的路径。
        xls_file: 输出 Excel 文件的路径。

    Raises:
        ValueError: 如果 vCard 文件为空、无效或无法读取。
        FileNotFoundError: 如果输入文件不存在。
    """
    contacts: List[Dict[str, str]] = []

    # 检测文件编码
    encoding = detect_encoding(vcf_file)
    print(f"检测到的文件编码：{encoding}")

    # 尝试使用多种编码读取文件
    vcf_content = None
    for enc in {encoding, 'utf-8', 'latin1', 'iso-8859-1', 'gbk'}:
        try:
            with open(vcf_file, 'r', encoding=enc) as file:
                vcf_content = file.read()
            print(f"成功使用编码 {enc} 读取文件")
            break
        except UnicodeDecodeError as e:
            print(f"使用编码 {enc} 读取失败：{e}")
        except Exception as e:
            print(f"读取文件时发生错误：{e}")

    if vcf_content is None:
        raise ValueError("无法使用任何编码读取 VCF 文件，请检查文件是否损坏。")

    # 解析 vCard 内容
    try:
        vcards = vobject.readComponents(vcf_content)
    except Exception as e:
        raise ValueError(f"解析 vCard 文件失败：{e}")

    # 提取联系人信息
    for vcard in vcards:
        try:
            contact = {
                'Full Name': getattr(vcard, 'fn', None).value if hasattr(vcard, 'fn') else '',
                'Organization': (
                    vcard.org.value[0] if hasattr(vcard, 'org') and vcard.org.value else ''
                ),
                'Email': getattr(vcard, 'email', None).value if hasattr(vcard, 'email') else '',
                'Phone': getattr(vcard, 'tel', None).value if hasattr(vcard, 'tel') else '',
                'Address': getattr(vcard, 'adr', None).value if hasattr(vcard, 'adr') else '',
                'Birthday': getattr(vcard, 'bday', None).value if hasattr(vcard, 'bday') else '',
                'Note': getattr(vcard, 'note', None).value if hasattr(vcard, 'note') else '',
            }
            contacts.append(contact)
        except Exception as e:
            print(f"跳过无效的 vCard：{e}")
            continue

    if not contacts:
        raise ValueError("文件中未找到有效的 vCard 数据。")

    # 创建并保存 DataFrame
    df = pd.DataFrame(contacts)
    df.to_excel(xls_file, index=False, engine='openpyxl')
    print(f"已将 {vcf_file} 转换为 {xls_file}")


def xls_to_vcf(xls_file: str, vcf_file: str) -> None:
    """将 Excel (.xlsx) 文件转换为kenen vCard (.vcf) 文件。

    输出格式：
    - 每个 vCard 的字段（BEGIN, VERSION, FN, N, TEL, END）之间无空行。
    - 不同 vCard 之间添加一个空行。
    - FN: 完整姓名
    - N: ;given_name;;;
    - TEL;TYPE=CELL:phone_number

    Args:
        xls_file: 输入 Excel 文件的路径。
        vcf_file: 输出 vCard 文件的路径。

    Raises:
        ValueError: 如果 Excel 文件缺少必需列或无效。
        FileNotFoundError: 如果输入文件不存在。
    """
    # 读取 Excel 文件
    try:
        df = pd.read_excel(xls_file, engine='openpyxl')
    except FileNotFoundError:
        raise FileNotFoundError(f"Excel 文件未找到：{xls_file}")
    except Exception as e:
        raise ValueError(f"读取 Excel 文件失败：{e}")

    # 检查必需列
    required_columns = ['Full Name']
    if not all(col in df.columns for col in required_columns):
        raise ValueError(f"Excel 文件必须包含列：{', '.join(required_columns)}")

    # 写入 vCard 文件
    with open(vcf_file, 'w', encoding='utf-8') as file:
        for index, row in df.iterrows():
            # 创建 vCard 对象
            vcard = vobject.vCard()

            # 添加必需字段
            if 'Full Name' in row and pd.notna(row['Full Name']):
                full_name = str(row['Full Name'])
                vcard.add('fn').value = full_name
                vcard.add('n').value = vobject.vcard.Name(given=full_name)

            # 添加电话（如果存在）
            if 'Phone' in row and pd.notna(row['Phone']):
                vcard.add('tel').value = str(row['Phone'])
                vcard.tel.type_param = 'CELL'

            # 手动构造 vCard 内容以控制换行
            lines = [
                "BEGIN:VCARD",
                "VERSION:3.0",
            ]
            if hasattr(vcard, 'fn'):
                lines.append(f"FN:{vcard.fn.value}")
            if hasattr(vcard, 'n'):
                lines.append(f"N:;{vcard.n.value.given};;;")
            if hasattr(vcard, 'tel'):
                lines.append(f"TEL;TYPE=CELL:{vcard.tel.value}")
            lines.append("END:VCARD")

            # 写入当前 vCard，字段间无空行
            file.write("\n".join(lines))

            # 在 vCard 之间添加一个空行（除了最后一个）
            if index < len(df) - 1:
                file.write("\n\n")

    print(f"已购销已将 {xls_file} 转换为 {vcf_file}")


def main() -> None:
    """运行交互式命令行界面，用于 vCard 和 Excel 转换。

    提供菜单以选择 vCard 转 Excel、Excel 转 vCard 或退出程序。
    """
    while True:
        print("\nvCard 和 Excel 转换工具")
        print("1. 将 vCard (.vcf) 转换为 Excel (.xlsx)")
        print("2. 将 Excel (.xlsx) 转换为 vCard (.vcf)")
        print("3. 退出")
        choice = input("请选择选项 (1-3)：")

        if choice == '1':
            vcf_file = input("请输入 vCard 文件路径：")
            xls_file = input("请输入输出 Excel 文件路径：")
            if os.path.exists(vcf_file):
                try:
                    vcf_to_xls(vcf_file, xls_file)
                except Exception as e:
                    print(f"转换失败：{e}")
            else:
                print(f"vCard 文件未找到：{vcf_file}")
        elif choice == '2':
            xls_file = input("请输入 Excel 文件路径：")
            vcf_file = input("请输入输出 vCard 文件路径：")
            if os.path.exists(xls_file):
                try:
                    xls_to_vcf(xls_file, vcf_file)
                except Exception as e:
                    print(f"转换失败：{e}")
            else:
                print(f"Excel 文件未找到：{xls_file}")
        elif choice == '3':
            print("退出程序")
            sys.exit(0)
        else:
            print("无效选项，请选择 1、2 或 3。")


if __name__ == "__main__":
    main()