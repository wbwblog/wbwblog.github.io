---
title: wbwConsoleGUI
date: 2025-09-25 00:00:00
layout: "page"
---

# wbwConsoleGUI - 控制台图形用户界面库

## 简介

**wbwConsoleGUI** 是一个基于 C++ 和 Windows API 的轻量级控制台 GUI 库，支持在 Windows 控制台中实现交互式界面。它提供按钮、标签、复选框、进度条等控件，并支持完整的鼠标事件处理。

- **许可证**: GPLv3.0
- **作者**: wbw121124

## 主要特性

- **跨编译器支持**：兼容 MSVC 和 MinGW
- **鼠标交互**：支持点击、悬停、移动等事件
- **丰富控件**：按钮、标签、复选框、进度条
- **颜色支持**：16 种控制台颜色
- **高效渲染**：实时界面刷新

## 快速入门

### 示例代码

```cpp
#include "wbwConsoleGUI.h"
using namespace wbwConsoleGUI;

Application app;
Button* btn = new Button(Rect(10, 7, 8, 1), "按钮");
ProgressBar* bar = new ProgressBar(Rect(0, 8, 100, 1));

int main() {
	Console::disableQuickEditMode();
	app.showDebug = true;

	Label* title = new Label(Rect(0, 2, 30, 1), "=== 控制台GUI演示 ===");
	title->setColors(Color::BRIGHT_MAGENTA, Color::BLACK);

	btn->setOnClick([]() {
		Console::setCursorPosition(0, 12);
		Color::setColor(Color::BRIGHT_GREEN, Color::BLACK);
		std::cout << "按钮被点击了!";
		Color::reset();
	});

	bar->setValue(50);
	bar->setStyle(ProgressBarStyle::Modern);

	app.addControl(title);
	app.addControl(btn);
	app.addControl(bar);

	app.run();
	return 0;
}
```

## API 概览

### Application 类

- `void run()`：启动主循环
- `void stop()`：停止应用
- `void addControl(Control*)`：添加控件
- `MouseInput& getMouse()`：获取鼠标输入

### Control 基类

- `Rect bounds`：位置和大小
- `std::string text`：文本内容
- `bool visible/enabled`：可见/启用状态
- `virtual void draw()`：绘制控件
- `virtual void handleMouse(const MouseInput&)`：处理鼠标事件
- `virtual void onClick()`：点击回调

### 常用控件

#### Button

```cpp
Button* btn = new Button(Rect(10, 5, 12, 1), "点击我");
btn->setOnClick([]() { /* 点击逻辑 */ });
```

#### Label

```cpp
Label* label = new Label(Rect(5, 3, 20, 1), "标签");
label->setColors(Color::BRIGHT_WHITE, Color::BLUE);
```

#### CheckBox

```cpp
CheckBox* cb = new CheckBox(Rect(0, 8, 15, 1), "启用选项", false);
cb->setOnChange([](bool checked) { /* 状态变化逻辑 */ });
```

#### ProgressBar

```cpp
ProgressBar* pb = new ProgressBar(Rect(0, 10, 30, 1), 0, 100);
pb->setValue(50);
pb->setStyle(ProgressBarStyle::Modern);
```

### 工具类

#### Console

- `clear()`：清屏
- `setCursorPosition(x, y)`：设置光标
- `hideCursor()`：隐藏光标
- `getConsoleSize()`：获取尺寸

#### Color

- 常量：BLACK, BLUE, BRIGHT_GREEN 等
- `setColor(fg, bg)`：设置颜色
- `reset()`：重置颜色

### 数据结构

- `Point(x, y)`：坐标点
- `Size(w, h)`：尺寸
- `Rect(x, y, w, h)`：矩形区域

## 编译说明

- **MSVC**：自动链接库
- **MinGW**：需手动链接
  ```bash
  g++ -o program main.cpp -lgdi32 -luser32
  ```

## 高级用法

### 自定义控件

继承 `Control` 可实现自定义控件：

```cpp
class MyControl : public Control {
public:
	void draw() override {
		Console::setCursorPosition(bounds.position.x, bounds.position.y);
		Color::setColor(foregroundColor, backgroundColor);
		std::cout << "自定义控件: " << text;
		Color::reset();
	}
};
```

### 鼠标事件

通过 `MouseInput` 获取鼠标状态：

```cpp
if (app.getMouse().isLeftClick()) {
	POINT pos = app.getMouse().getPosition();
	// 处理点击
}
```

## 注意事项

- 建议使用等宽字体
- 控制台快速编辑模式会自动禁用
- 控件多时建议优化绘制逻辑
- 当前版本非线程安全

## 示例程序

演示程序包含：

- 多按钮点击
- 复选框状态监听
- 多样式进度条
- 实时鼠标位置显示

## 版本信息

- 开发者: wbw121124
- 许可证: GPLv3.0
- 文档日期: 2025-09-25

## 技术支持

如有问题或建议，请联系开发者或提交 issue。

## wbwConsoleGUI.h

```cpp
// wbwConsoleGUI - 1.0.10
// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
#include <iostream>
#include <string>
#include <vector>
#include <functional>
#include <conio.h>
#include <windows.h>
#include <thread>
#include <iostream>
#include <fstream>
#include <algorithm>
#include <chrono>
#include <memory>
#include <cmath>
#define wbwConsoleGUIVer "1.0.10"
#ifdef _MSC_VER
#pragma comment(lib, "gdi32.lib")
#pragma comment(lib, "user32.lib")
#elif defined(__GNUC__) && false
#warning 使用MinGW编译时, 应在命令行中链接库: `-lgdi32 - luser32`
#endif
namespace wbwConsoleGUI
{
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	// 基础结构体定义
	struct Point {
		int x, y;
		Point(int x = 0, int y = 0) : x(x), y(y) { }
	};

	struct Size {
		int width, height;
		Size(int w = 0, int h = 0) : width(w), height(h) { }
	};

	struct Rect {
		Point position;
		Size size;
		Rect(int x = 0, int y = 0, int w = 0, int h = 0)
			: position(x, y), size(w, h)
		{
		}

		bool contains(int px, int py) const
		{
			return px >= position.x && px < position.x + size.width &&
				py >= position.y && py < position.y + size.height;
		}
	};

	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	// 控制台工具函数
	namespace Console
	{
		// 禁用快速编辑模式，防止文本选中导致暂停
		void disableQuickEditMode()
		{
			HANDLE hInput = GetStdHandle(STD_INPUT_HANDLE);
			DWORD mode;
			GetConsoleMode(hInput, &mode);
			// mode = 0;
			mode &= ~ENABLE_QUICK_EDIT_MODE;  // 禁用快速编辑
			mode &= ~ENABLE_INSERT_MODE;      // 禁用插入模式
			mode &= ~ENABLE_EXTENDED_FLAGS;    // 启用扩展标志
			mode &= ~ENABLE_ECHO_INPUT;
			mode &= ~ENABLE_PROCESSED_INPUT;
			mode &= ~ENABLE_WINDOW_INPUT;
			SetConsoleMode(hInput, mode);
		}

		// 启用快速编辑模式（如果需要）
		void enableQuickEditMode()
		{
			HANDLE hInput = GetStdHandle(STD_INPUT_HANDLE);
			DWORD mode;
			GetConsoleMode(hInput, &mode);
			mode |= ENABLE_QUICK_EDIT_MODE;
			SetConsoleMode(hInput, mode);
		}
		// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
		void clear()
		{
			system("cls");
		}

		void setCursorPosition(int x, int y)
		{
			COORD coord;
			coord.X = x;
			coord.Y = y;
			SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
		}

		void hideCursor()
		{
			HANDLE consoleHandle = GetStdHandle(STD_OUTPUT_HANDLE);
			CONSOLE_CURSOR_INFO info;
			info.dwSize = 100;
			info.bVisible = FALSE;
			SetConsoleCursorInfo(consoleHandle, &info);
		}

		void showCursor()
		{
			HANDLE consoleHandle = GetStdHandle(STD_OUTPUT_HANDLE);
			CONSOLE_CURSOR_INFO info;
			info.dwSize = 100;
			info.bVisible = TRUE;
			SetConsoleCursorInfo(consoleHandle, &info);
		}

		Size getConsoleSize()
		{
			CONSOLE_SCREEN_BUFFER_INFO csbi;
			GetConsoleScreenBufferInfo(GetStdHandle(STD_OUTPUT_HANDLE), &csbi);
			return Size(csbi.srWindow.Right - csbi.srWindow.Left + 1,
				csbi.srWindow.Bottom - csbi.srWindow.Top + 1);
		}
	}
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	// 鼠标事件类型
	enum class MouseEvent {
		LeftClick,
		RightClick,
		DoubleClick,
		MouseMove,
		NoEvent
	};
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	// 鼠标状态结构
	struct MouseState {
		POINT position;
		bool leftButtonDown;
		bool rightButtonDown;
		MouseEvent lastEvent;

		MouseState() : position({ -1, -1 }), leftButtonDown(false),
			rightButtonDown(false), lastEvent(MouseEvent::NoEvent)
		{
		}
	};
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	namespace getPos
	{
		// 获取最前端的窗口
		HWND GetForegroundWindowHandle()
		{
			return GetForegroundWindow();
		}

		// 获取窗口的客户区矩形（相对于屏幕坐标）
		RECT GetWindowClientRect(HWND hwnd)
		{
			RECT rect;
			GetClientRect(hwnd, &rect);

			POINT topLeft = { rect.left, rect.top };
			POINT bottomRight = { rect.right, rect.bottom };

			ClientToScreen(hwnd, &topLeft);
			ClientToScreen(hwnd, &bottomRight);

			rect.left = topLeft.x;
			rect.top = topLeft.y;
			rect.right = bottomRight.x;
			rect.bottom = bottomRight.y;

			return rect;
		}

		CONSOLE_FONT_INFO GetFontInfo()
		{
			CONSOLE_FONT_INFO tm;
			GetCurrentConsoleFont(GetStdHandle(STD_OUTPUT_HANDLE), false, &tm);
			return tm;
		}

		// wbwConsoleGUI - dev by wbw121124 - GPLv3.0

		// 获取鼠标在窗口中的字体坐标（基于字符单元格）
		POINT GetMousePositionInFontCoordinates(HWND hwnd)
		{
			POINT mousePos;
			GetCursorPos(&mousePos);

			RECT clientRect = GetWindowClientRect(hwnd);

			// 检查鼠标是否在窗口客户区内
			if (mousePos.x < clientRect.left || mousePos.x > clientRect.right ||
				mousePos.y < clientRect.top || mousePos.y > clientRect.bottom)
			{
				return { -1, -1 };
			}

			ScreenToClient(hwnd, &mousePos);

			CONSOLE_FONT_INFO tm = GetFontInfo();

			POINT fontPos;
			fontPos.x = mousePos.x / tm.dwFontSize.X;
			fontPos.y = mousePos.y / tm.dwFontSize.Y;

			return fontPos;
		}

		// 获取控制台窗口中的鼠标位置
		POINT getCursorPosInThisWindow()
		{
			HWND foregroundWindow = GetForegroundWindowHandle();
			if (foregroundWindow == GetConsoleWindow())
			{
				return GetMousePositionInFontCoordinates(foregroundWindow);
			}
			return { -1, -1 };
		}

		// 获取鼠标按钮状态
		bool isLeftButtonDown()
		{
			return GetAsyncKeyState(VK_LBUTTON) & 0x8000;
		}

		bool isRightButtonDown()
		{
			return GetAsyncKeyState(VK_RBUTTON) & 0x8000;
		}
	}
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	// 鼠标输入管理器
	class MouseInput {
	private:
		MouseState currentState;
		MouseState previousState;
		bool mouseEnabled;

	public:
		MouseInput() : mouseEnabled(true) { }

		void update()
		{
			previousState = currentState;

			currentState.position = getPos::getCursorPosInThisWindow();
			currentState.leftButtonDown = getPos::isLeftButtonDown();
			currentState.rightButtonDown = getPos::isRightButtonDown();

			// 检测鼠标事件
			currentState.lastEvent = detectMouseEvent();
		}

		MouseEvent detectMouseEvent()
		{
			// 鼠标移动检测
			if (currentState.position.x != previousState.position.x ||
				currentState.position.y != previousState.position.y)
			{
				return MouseEvent::MouseMove;
			}

			// 左键点击检测
			if (!previousState.leftButtonDown && currentState.leftButtonDown)
			{
				return MouseEvent::LeftClick;
			}

			// 右键点击检测
			if (!previousState.rightButtonDown && currentState.rightButtonDown)
			{
				return MouseEvent::RightClick;
			}

			return MouseEvent::NoEvent;
		}
		// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
		POINT getPosition() const { return currentState.position; }
		bool isLeftClick() const { return currentState.lastEvent == MouseEvent::LeftClick; }
		bool isRightClick() const { return currentState.lastEvent == MouseEvent::RightClick; }
		bool isMouseMove() const { return currentState.lastEvent == MouseEvent::MouseMove; }
		bool isInWindow() const { return currentState.position.x >= 0 && currentState.position.y >= 0; }

		void enable() { mouseEnabled = true; }
		void disable() { mouseEnabled = false; }
		bool isEnabled() const { return mouseEnabled; }
	};

	// 颜色控制
	namespace Color
	{
		enum Code {
			BLACK = 0, BLUE = 1, GREEN = 2, CYAN = 3, RED = 4, MAGENTA = 5,
			YELLOW = 6, WHITE = 7, GRAY = 8, BRIGHT_BLUE = 9, BRIGHT_GREEN = 10,
			BRIGHT_CYAN = 11, BRIGHT_RED = 12, BRIGHT_MAGENTA = 13,
			BRIGHT_YELLOW = 14, BRIGHT_WHITE = 15
		};

		void setColor(int foreground, int background = BLACK)
		{
			HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
			SetConsoleTextAttribute(hConsole, foreground + (background << 4));
		}

		void reset()
		{
			setColor(WHITE, BLACK);
		}
	}
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	// 基础控件类
	class Control {
	protected:
		Rect bounds;
		std::string text;
		bool visible;
		bool enabled;
		int foregroundColor;
		int backgroundColor;
		bool hovered;
		bool pressed;
		bool pressedR;
		std::function<void()> clickHandler, clickRHandler, hoverHandler, leaveHandler;

	public:
		Control(const Rect& rect = Rect(), const std::string& text = "")
			: bounds(rect), text(text), visible(true), enabled(true),
			foregroundColor(Color::WHITE), backgroundColor(Color::BLACK),
			hovered(false), pressed(false)
		{
		}

		virtual ~Control() = default;

		virtual void draw() = 0;
		virtual void handleMouse(const MouseInput& mouse)
		{
			if (!visible || !enabled) return;

			POINT mousePos = mouse.getPosition();
			hovered = isPointInRect(mousePos, bounds);

			if (hovered && mouse.isLeftClick())
			{
				pressed = true;
				onClick();
			}
			else if (pressed && !mouse.isLeftClick())
			{
				pressed = false;
			}

			if (hovered && mouse.isRightClick())
			{
				pressedR = true;
				onRClick();
			}
			else if (pressed && !mouse.isRightClick())
			{
				pressedR = false;
			}
		}

		virtual void onClick()
		{
			if (enabled && clickHandler)
			{
				clickHandler();
			}
		}
		virtual void onRClick()
		{
			if (enabled && clickRHandler)
			{
				clickRHandler();
			}
		}
		virtual void onHover()
		{
			if (enabled && hoverHandler)
			{
				hoverHandler();
			}
		}
		virtual void onLeave()
		{
			if (enabled && leaveHandler)
			{
				leaveHandler();
			}
		}

		bool isPointInRect(const POINT& point, const Rect& rect) const
		{
			return point.x >= rect.position.x &&
				point.x < rect.position.x + rect.size.width &&
				point.y >= rect.position.y &&
				point.y < rect.position.y + rect.size.height;
		}
		// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
		// 设置和获取方法
		void setPosition(int x, int y) { bounds.position = Point(x, y); }
		void setSize(int w, int h) { bounds.size = Size(w, h); }
		void setText(const std::string& newText) { text = newText; }
		void setVisible(bool isVisible) { visible = isVisible; }
		void setEnabled(bool isEnabled) { enabled = isEnabled; }
		void setColors(int fg, int bg)
		{
			foregroundColor = fg;
			backgroundColor = bg;
		}

		Point getPosition() const { return bounds.position; }
		Size getSize() const { return bounds.size; }
		std::string getText() const { return text; }
		bool isVisible() const { return visible; }
		bool isEnabled() const { return enabled; }
		bool isHovered() const { return hovered; }
		bool isPressed() const { return pressed; }

		void setOnClick(const std::function<void()>& handler)
		{
			clickHandler = handler;
		}
		void setOnRClick(const std::function<void()>& handler)
		{
			clickRHandler = handler;
		}
		void setOnHover(const std::function<void()>& handler)
		{
			hoverHandler = handler;
		}
		void setOnLeave(const std::function<void()>& handler)
		{
			leaveHandler = handler;
		}
	};
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
// 文本框控件
	class TextBox : public Control {
	private:
		std::string content;
		size_t cursorPosition;
		size_t scrollOffset;
		bool hasFocus1;
		bool showCursor;
		int cursorBlinkRate;
		std::chrono::steady_clock::time_point lastBlinkTime;
		bool cursorVisible;
		size_t selectionStart;
		bool hasSelection;
		int maxLength;

	public:
		TextBox(const Rect& rect = Rect(), const std::string& text = "")
			: Control(rect, text), content(""), cursorPosition(0), scrollOffset(0),
			hasFocus1(false), showCursor(true), cursorBlinkRate(500),
			cursorVisible(true), selectionStart(0), hasSelection(false),
			maxLength(0)  // 0表示无限制
		{
			lastBlinkTime = std::chrono::steady_clock::now();
		}

		void draw() override
		{
			if (!visible) return;

			// 更新光标闪烁
			updateCursorBlink();

			Console::setCursorPosition(bounds.position.x, bounds.position.y);

			// 根据状态设置颜色
			if (!enabled)
			{
				Color::setColor(Color::GRAY, Color::BLACK);
			}
			else if (hasFocus1)
			{
				Color::setColor(Color::BLACK, Color::BRIGHT_WHITE);
			}
			else if (hovered)
			{
				Color::setColor(Color::BRIGHT_WHITE, Color::GRAY);
			}
			else
			{
				Color::setColor(foregroundColor, backgroundColor);
			}

			// 绘制边框
			std::cout << "+";
			for (int i = 0; i < bounds.size.width - 2; i++)
			{
				std::cout << "-";
			}
			std::cout << "+";

			// 绘制文本内容
			Console::setCursorPosition(bounds.position.x, bounds.position.y + 1);
			std::cout << "|";

			std::string displayText = getDisplayText();
			int textWidth = bounds.size.width - 2; // 减去边框

			// 确保显示文本不超过可用宽度
			if (displayText.length() > static_cast<size_t>(textWidth))
			{
				displayText = displayText.substr(0, textWidth);
			}

			std::cout << displayText;

			// 填充剩余空间
			for (int i = displayText.length(); i < textWidth; i++)
			{
				std::cout << " ";
			}

			std::cout << "|";

			// 绘制底部边框
			Console::setCursorPosition(bounds.position.x, bounds.position.y + 2);
			std::cout << "+";
			for (int i = 0; i < bounds.size.width - 2; i++)
			{
				std::cout << "-";
			}
			std::cout << "+";

			// 如果有焦点且启用光标，绘制光标
			if (hasFocus1 && enabled && showCursor && cursorVisible)
			{
				drawCursor();
			}

			Color::reset();
		}

		void handleMouse(const MouseInput& mouse) override
		{
			if (!visible || !enabled) return;

			POINT mousePos = mouse.getPosition();
			bool wasHovered = hovered;
			hovered = isPointInRect(mousePos, bounds);

			// 处理悬停状态变化
			if (hovered && !wasHovered)
			{
				onHover();
			}
			else if (!hovered && wasHovered)
			{
				onLeave();
			}

			// 处理点击事件
			if (hovered && mouse.isLeftClick())
			{
				setFocus(true);
				// 计算点击位置对应的光标位置
				int clickX = mousePos.x - bounds.position.x - 1; // 减去左边框
				if (clickX < 0) clickX = 0;

				cursorPosition = scrollOffset + clickX;
				if (cursorPosition > content.length())
				{
					cursorPosition = content.length();
				}

				selectionStart = cursorPosition;
				hasSelection = false;
				pressed = true;
				onClick();
			}
			else if (pressed && !mouse.isLeftClick())
			{
				pressed = false;
			}
		}

		void handleKeyInput(char key)
		{
			if (!hasFocus1 || !enabled) return;

			switch (key)
			{
			case 8: // Backspace
				if (hasSelection && deleteSelection())
					;
				else if (cursorPosition > 0)
				{
					content.erase(cursorPosition - 1, 1);
					cursorPosition--;
				}
				break;

			case 13: // Enter
				// 触发回车事件
				if (clickHandler)
				{
					clickHandler();
				}
				break;

			case 1: // Ctrl+A (全选)
				selectAll();
				break;

			default:
				// 处理普通字符输入
				if (key >= 32 && key <= 126) // 可打印字符
				{
					if (hasSelection)
					{
						deleteSelection();
					}

					if (maxLength == 0 || content.length() < static_cast<size_t>(maxLength))
					{
						content.insert(cursorPosition, 1, key);
						cursorPosition++;
					}
				}
				break;
			}

			// 更新滚动偏移量
			updateScrollOffset();
			resetCursorBlink();
		}

		void handleSpecialKey(int keyCode)
		{
			if (!hasFocus1 || !enabled) return;

			if (GetAsyncKeyState(VK_LEFT) && cursorPosition > 0)
				cursorPosition--;
			if (GetAsyncKeyState(VK_RIGHT) && cursorPosition < content.length())
				cursorPosition++;
			if (GetAsyncKeyState(VK_HOME))
				cursorPosition = 0;
			if (GetAsyncKeyState(VK_END))
				cursorPosition = content.length();
			if (keyCode == 83)
				if (hasSelection)
				{
					if (!deleteSelection() &&
						cursorPosition < content.length())
					{
						content.erase(cursorPosition, 1);
					}
				}
				else if (cursorPosition < content.length())
				{
					content.erase(cursorPosition, 1);
				}

			// 处理选择（按住Shift） // ps:好了
			if (GetAsyncKeyState(VK_SHIFT) & 0x8000)
			{
				if (!hasSelection)
				{
					selectionStart = cursorPosition;
					hasSelection = true;
				}
			}
			else
			{
				hasSelection = false;
			}

			updateScrollOffset();
			resetCursorBlink();
		}

		// 设置和获取方法
		void setText(const std::string& newText)
		{
			content = newText;
			cursorPosition = content.length();
			scrollOffset = 0;
			hasSelection = false;
		}

		std::string getText() const { return content; }

		void setFocus(bool focus)
		{
			hasFocus1 = focus;
			if (hasFocus1)
			{
				resetCursorBlink();
			}
		}

		bool hasFocus() const { return hasFocus1; }

		void setMaxLength(int length) { maxLength = length; }
		int getMaxLength() const { return maxLength; }

		void setShowCursor(bool show) { showCursor = show; }

	private:
		std::string getDisplayText() const
		{
			if (scrollOffset >= content.length())
			{
				return "";
			}
			return content.substr(scrollOffset);
		}

		void drawCursor()
		{
			int cursorX = bounds.position.x + 1 + (cursorPosition - scrollOffset);
			int cursorY = bounds.position.y + 1;

			if (cursorX >= bounds.position.x + 1 &&
				cursorX < bounds.position.x + bounds.size.width - 1)
			{
				Console::setCursorPosition(cursorX, cursorY);
				Color::setColor(Color::BLACK, Color::BRIGHT_YELLOW);

				if (cursorPosition < content.length())
				{
					std::cout << content[cursorPosition];
				}
				else
				{
					std::cout << " ";
				}

				Color::reset();
			}
		}

		void updateCursorBlink()
		{
			auto currentTime = std::chrono::steady_clock::now();
			auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(
				currentTime - lastBlinkTime).count();

			if (elapsed >= cursorBlinkRate)
			{
				cursorVisible = !cursorVisible;
				lastBlinkTime = currentTime;
			}
		}

		void resetCursorBlink()
		{
			cursorVisible = true;
			lastBlinkTime = std::chrono::steady_clock::now();
		}

		void updateScrollOffset()
		{
			int textWidth = bounds.size.width - 2; // 减去边框

			if (cursorPosition < scrollOffset)
			{
				scrollOffset = cursorPosition;
			}
			else if (cursorPosition >= textWidth - 1)
			{
				scrollOffset = cursorPosition - textWidth + 1;
			}
		}

		bool deleteSelection()
		{
			if (!hasSelection) return true;

			size_t start = std::min(selectionStart, cursorPosition);
			size_t end = std::max(selectionStart, cursorPosition);
			if (selectionStart + 1 == cursorPosition)
			{
				hasSelection = false;
				cursorPosition = start + 1;
				return false;
			}
			if (selectionStart - 1 == cursorPosition)
			{
				hasSelection = false;
				cursorPosition = start;
				return false;
			}

			content.erase(start, end - start + 1);
			cursorPosition = start;
			hasSelection = false;
			return true;
		}

		void selectAll()
		{
			selectionStart = 0;
			cursorPosition = content.length();
			hasSelection = true;
		}
	};
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	// 增强的按钮控件（支持鼠标悬停和点击效果）
	class Button : public Control {
	public:
		Button(const Rect& rect = Rect(), const std::string& text = "")
			: Control(rect, text)
		{
		}

		void draw() override
		{
			if (!visible) return;

			Console::setCursorPosition(bounds.position.x, bounds.position.y);

			// 根据状态改变颜色
			if (!enabled)
			{
				Color::setColor(Color::GRAY, backgroundColor);
			}
			else if (pressed)
			{
				Color::setColor(backgroundColor, foregroundColor); // 反转颜色
			}
			else if (hovered)
			{
				Color::setColor(Color::BRIGHT_YELLOW, backgroundColor);
			}
			else
			{
				Color::setColor(foregroundColor, backgroundColor);
			}

			std::cout << "[" << text << "]";
			Color::reset();
		}
	};
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	// 增强的标签控件（支持鼠标悬停）
	class Label : public Control {
	public:
		Label(const Rect& rect = Rect(), const std::string& text = "")
			: Control(rect, text)
		{
		}

		void draw() override
		{
			if (!visible) return;

			Console::setCursorPosition(bounds.position.x, bounds.position.y);

			if (hovered && enabled)
			{
				Color::setColor(Color::BRIGHT_CYAN, backgroundColor);
			}
			else
			{
				Color::setColor(foregroundColor, backgroundColor);
			}

			std::cout << text;
			Color::reset();
		}
	};
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	// 复选框控件
	class CheckBox : public Control {
	private:
		bool checked;
		std::function<void(bool)> changeHandler;

	public:
		CheckBox(const Rect& rect = Rect(), const std::string& text = "", bool checked = false)
			: Control(rect, text), checked(checked)
		{
		}
		// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
		void draw() override
		{
			if (!visible) return;

			Console::setCursorPosition(bounds.position.x, bounds.position.y);

			if (hovered && enabled)
			{
				Color::setColor(Color::BRIGHT_GREEN, backgroundColor);
			}
			else
			{
				Color::setColor(foregroundColor, backgroundColor);
			}

			std::cout << "[" << (checked ? "X" : " ") << "] " << text;
			Color::reset();
		}

		void onClick() override
		{
			if (enabled)
			{
				checked = !checked;
				if (changeHandler)
				{
					changeHandler(checked);
				}
				if (clickHandler)
					clickHandler();
			}
		}

		bool isChecked() const { return checked; }
		void setChecked(bool isChecked) { checked = isChecked; }

		void setOnChange(const std::function<void(bool)>& handler)
		{
			changeHandler = handler;
		}
	};
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	// 进度条样式枚举
	enum class ProgressBarStyle {
		Classic,    // 经典样式
		Modern,     // 现代样式
		Gradient,   // 渐变样式
		Block       // 块状样式
	};
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	// 进度条控件
	class ProgressBar : public Control {
	private:
		int minValue;
		int maxValue;
		int currentValue;
		ProgressBarStyle style;
		bool showPercentage;
		bool showValue;
		bool animated;
		int animationOffset;

		// Windows颜色主题
		struct ProgressColors {
			int background;
			int progress;
			int border;
			int text;
		};

		ProgressColors colors;

	public:
		ProgressBar(const Rect& rect = Rect(), int min = 0, int max = 100)
			: Control(rect, ""), minValue(min), maxValue(max), currentValue(min),
			style(ProgressBarStyle::Modern), showPercentage(true), showValue(true),
			animated(true), animationOffset(0)
		{
			setModernColors();
		}

		void draw() override
		{
			if (!visible) return;

			switch (style)
			{
			case ProgressBarStyle::Classic:
				drawClassicProgressBar();
				break;
			case ProgressBarStyle::Modern:
				drawModernProgressBar();
				break;
			case ProgressBarStyle::Gradient:
				drawGradientProgressBar();
				break;
			case ProgressBarStyle::Block:
				drawBlockProgressBar();
				break;
			}

			if (animated)
			{
				animationOffset = (animationOffset + 1) % 4;
			}
		}

		// 设置值
		void setValue(int value)
		{
			currentValue = std::max(minValue, std::min(maxValue, value));
		}

		void setRange(int min, int max)
		{
			minValue = min;
			maxValue = max;
			currentValue = std::max(minValue, std::min(maxValue, currentValue));
		}
		// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
		int getValue() const { return currentValue; }
		int getMin() const { return minValue; }
		int getMax() const { return maxValue; }

		// 设置样式
		void setStyle(ProgressBarStyle newStyle)
		{
			style = newStyle;
			switch (style)
			{
			case ProgressBarStyle::Classic:
				setClassicColors();
				break;
			case ProgressBarStyle::Modern:
				setModernColors();
				break;
			case ProgressBarStyle::Gradient:
				setGradientColors();
				break;
			case ProgressBarStyle::Block:
				setBlockColors();
				break;
			}
		}

		void setShowPercentage(bool show) { showPercentage = show; }
		void setShowValue(bool show) { showValue = show; }
		void setAnimated(bool animate) { animated = animate; }

		// 进度计算
		long double getPercentage() const
		{
			if (maxValue == minValue) return 0.0f;
			return static_cast<long double>(currentValue - minValue) /
				static_cast<long double>(maxValue - minValue);
		}
		// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
		int getProgressWidth() const
		{
			long double percentage = getPercentage();
			return static_cast<int>(percentage * (bounds.size.width)); // 减去边框
		}

	private:
		void drawClassicProgressBar()
		{
			int progressWidth = getProgressWidth();
			int barWidth = bounds.size.width;
			int blockCount = barWidth;  // 每个块占1个字符宽度

			Console::setCursorPosition(bounds.position.x, bounds.position.y);

			int completedBlocks = progressWidth;

			for (int i = 0; i < blockCount; i++)
			{
				if (i < completedBlocks)
				{
					Color::setColor(colors.progress, colors.background);
					std::cout << "=";  // 实心方块
				}
				else
				{
					Color::setColor(colors.background, colors.background);
					std::cout << "_";  // 空心方块
				}
			}

			// 绘制文本
			drawProgressText(bounds.position.y);
		}
		void drawModernProgressBar()
		{
			int progressWidth = getProgressWidth();
			int barWidth = bounds.size.width;
			int blockCount = barWidth;  // 每个块占1个字符宽度

			Console::setCursorPosition(bounds.position.x, bounds.position.y);

			int completedBlocks = progressWidth;

			for (int i = 0; i < blockCount; i++)
			{
				if (i < completedBlocks)
				{
					Color::setColor(colors.progress, colors.text);
					std::cout << ">";  // 实心方块
				}
				else
				{
					Color::setColor(colors.progress, colors.background);
					std::cout << "<";  // 空心方块
				}
			}

			// 绘制文本
			drawProgressText(bounds.position.y);
		}
		void drawGradientProgressBar()
		{
			int progressWidth = getProgressWidth();
			int barWidth = bounds.size.width;
			int blockCount = barWidth;  // 每个块占1个字符宽度

			Console::setCursorPosition(bounds.position.x, bounds.position.y);

			int completedBlocks = progressWidth;

			for (int i = 0; i < blockCount; i++)
			{
				if (i < completedBlocks)
				{
					Color::setColor(colors.progress, colors.background);
					std::cout << "=";  // 实心方块
				}
				else
				{
					Color::setColor(colors.progress, colors.background);
					std::cout << "+";  // 空心方块
				}
			}

			// 绘制文本
			drawProgressText(bounds.position.y);
		}
		// 块状样式
		void drawBlockProgressBar()
		{
			int progressWidth = getProgressWidth();
			int barWidth = bounds.size.width;
			int blockCount = barWidth;  // 每个块占1个字符宽度

			Console::setCursorPosition(bounds.position.x, bounds.position.y);

			int completedBlocks = progressWidth;

			for (int i = 0; i < blockCount; i++)
			{
				if (i < completedBlocks)
				{
					Color::setColor(colors.progress, colors.progress);
					std::cout << "[";  // 实心方块
				}
				else
				{
					Color::setColor(colors.background, colors.background);
					std::cout << "]";  // 空心方块
				}
			}

			// 绘制文本
			drawProgressText(bounds.position.y);
		}
		// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
		// 绘制进度文本
		void drawProgressText(int yPos)
		{
			if (!showPercentage && !showValue) return;

			std::string text;
			if (showValue && showPercentage)
			{
				int percentage = static_cast<int>(getPercentage() * 100);
				text = std::to_string(currentValue) + " (" + std::to_string(percentage) + "%)";
			}
			else if (showPercentage)
			{
				int percentage = static_cast<int>(getPercentage() * 100);
				text = std::to_string(percentage) + "%";
			}
			else
			{
				text = std::to_string(currentValue) + "/" + std::to_string(maxValue);
			}

			// 居中显示文本
			int textX = bounds.position.x + (bounds.size.width - text.length()) / 2;
			if (textX < bounds.position.x) textX = bounds.position.x;

			Console::setCursorPosition(textX, yPos);
			Color::setColor(colors.text, Color::BLACK);
			std::cout << text;
			Color::reset();
		}

		// 颜色主题设置
		void setClassicColors()
		{
			colors.background = Color::BLUE;
			colors.progress = Color::BRIGHT_CYAN;
			colors.border = Color::WHITE;
			colors.text = Color::BRIGHT_WHITE;
		}

		void setModernColors()
		{
			colors.background = Color::GRAY;
			colors.progress = Color::BRIGHT_BLUE;
			colors.border = Color::WHITE;
			colors.text = Color::BRIGHT_WHITE;
		}
		// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
		void setGradientColors()
		{
			colors.background = Color::BLACK;
			colors.progress = Color::GREEN;
			colors.border = Color::WHITE;
			colors.text = Color::BRIGHT_WHITE;
		}

		void setBlockColors()
		{
			colors.background = Color::BLACK;
			colors.progress = Color::BRIGHT_GREEN;
			colors.border = Color::WHITE;
			colors.text = Color::BRIGHT_WHITE;
		}
	};
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	// 应用主类
	class Application {
	private:
		std::vector<Control*> controls;
		MouseInput mouse;
		bool running;

	public:
		bool showDebug = false;

		Application() : running(false) { }

		~Application()
		{
			for (auto control : controls)
			{
				delete control;
			}
		}

		void addControl(Control* control)
		{
			controls.push_back(control);
		}

		void run()
		{
			running = true;
			Console::hideCursor();
			Console::clear();

			Console::setCursorPosition(0, 0);
			Color::setColor(Color::BRIGHT_YELLOW, Color::BLACK);
			std::cout << "请关闭控制台的 Ctrl 键快捷方式和扩展的文本选择键选项";
			Sleep(1000);

			Console::clear();

			while (running)
			{
				// 更新鼠标状态
				mouse.update();

				// 处理键盘输入
				if (_kbhit())
				{
					int ch = _getch();

					// 处理特殊键（方向键等）
					if (ch == 0 || ch == 224)
					{
						int specialKey = _getch();
						for (auto control : controls)
						{
							TextBox* textBox = dynamic_cast<TextBox*>(control);
							if (textBox)
							{
								textBox->handleSpecialKey(specialKey);
							}
						}
					}
					else
					{
						// 处理普通键
						for (auto control : controls)
						{
							TextBox* textBox = dynamic_cast<TextBox*>(control);
							if (textBox)
							{
								textBox->handleKeyInput(ch);
							}
						}
					}
				}

				if (mouse.isLeftClick())
					for (auto control : controls)
					{
						TextBox* textBox = dynamic_cast<TextBox*>(control);
						if (textBox)
						{
							textBox->setFocus(false);
						}
					}

				// 处理所有控件的鼠标事件
				for (auto control : controls)
				{
					control->handleMouse(mouse);
				}

				// 绘制所有控件
				for (auto control : controls)
				{
					control->draw();
				}

				// 显示鼠标位置（调试信息）
				if (mouse.isInWindow() && showDebug)
				{
					POINT pos = mouse.getPosition();
					Console::setCursorPosition(0, 0);
					Color::setColor(Color::BRIGHT_WHITE, Color::BLUE);
					std::cout << "鼠标: (" << pos.x << ", " << pos.y << ")      ";
					Color::reset();
				}

				Sleep(50);
			}

			Console::showCursor();
		}

		void stop()
		{
			running = false;
		}

		MouseInput& getMouse() { return mouse; }
	};
}
// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
```
