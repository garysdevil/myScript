import pyautogui
import time

def get_position(prompt):
    print(prompt)
    print("请在 5 秒内移动鼠标到目标位置...")
    time.sleep(5)
    x, y = pyautogui.position()
    print(f"记录坐标: ({x}, {y})")
    return x, y

# 获取关键位置的坐标
print("开始调试坐标...")
P1 = get_position("移动到 第一个位置")
P2 = get_position("移动到 第二个位置")
# 输出所有坐标
print("\n调试完成，以下是你记录的坐标：")
print(f"P1 = {P1}")
print(f"P2 = {P2}")