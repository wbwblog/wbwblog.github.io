---
title: wbwConsoleGUI
date: 2025-09-25 00:00:00
layout: "page"
---

{% note warning %}
#### 版本更新了，但是文档没有更新！！！
{% endnote %}

# wbwConsoleGUI - 控制台图形用户界面库

## 概述

wbwConsoleGUI 是一个基于 C++ 开发的轻量级控制台图形用户界面库，使用 Windows API 实现。该库提供了在 Windows 控制台环境中创建交互式 GUI 应用程序的能力，支持按钮、标签、复选框、进度条等常见控件，并包含完整的鼠标事件处理。

## 许可证

GPLv3.0 - 由 wbw121124 开发

## 功能特性

### 核心功能
- **跨编译器支持**: 兼容 MSVC 和 MinGW 编译器
- **鼠标交互**: 完整的鼠标事件处理（点击、悬停、移动）
- **多种控件**: 按钮、标签、复选框、进度条
- **颜色支持**: 16 种控制台颜色配置
- **实时渲染**: 高效的界面更新机制

### 控件特性
- **按钮**: 支持点击事件，悬停和按下状态可视化
- **标签**: 支持文本显示和悬停效果
- **复选框**: 支持选中状态切换和事件回调
- **进度条**: 多种样式（经典、现代、渐变、块状），支持动画和百分比显示

## 快速开始

### 基本使用示例

```cpp
#include "wbwConsoleGUI.h"

// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
// 使用示例
int main()
{
	using namespace wbwConsoleGUI;
	Console::disableQuickEditMode();

	Application app;

	app.showDebug = true;

	// 创建控件
	Label* title = new Label(Rect(0, 2, 30, 1), "=== 控制台GUI演示 ===");
	title->setColors(Color::BRIGHT_MAGENTA, Color::BLACK);

	Button* button1 = new Button(Rect(0, 5, 8, 1), "按钮1");
	button1->setOnClick([]()
		{
			Console::setCursorPosition(0, 12);
			Color::setColor(Color::BRIGHT_GREEN, Color::BLACK);
			std::cout << "按钮1被点击了!                    ";
			Color::reset();
		});

	ProgressBar* progressbar = new ProgressBar(Rect(0, 8, 100, 1));
	progressbar->setShowValue(false);
	progressbar->setStyle(ProgressBarStyle(0));
	int cnt = 0, tot = 0;

	Button* button2 = new Button(Rect(5, 6, 8, 1), "按钮2");
	button2->setOnClick([&]()
		{
			progressbar->setStyle(ProgressBarStyle(++tot % 4));
			Console::setCursorPosition(0, 12);
			Color::setColor(Color::BRIGHT_RED, Color::BLACK);
			std::cout << "按钮2被点击了!                    ";
			Color::reset();
		});

	Button* button3 = new Button(Rect(10, 7, 8, 1), "按钮3");
	button3->setOnClick([&]()
		{
			progressbar->setValue(++cnt %= 101);
			Console::setCursorPosition(0, 12);
			Color::setColor(Color::BRIGHT_BLUE, Color::BLACK);
			std::cout << "按钮3被点击了!                    ";
			Color::reset();
		});


	CheckBox* checkbox = new CheckBox(Rect(0, 9, 12, 1), "启用特性", false);
	checkbox->setOnChange([](bool checked)
		{
			Console::setCursorPosition(0, 13);
			Color::setColor(Color::BRIGHT_CYAN, Color::BLACK);
			std::cout << "复选框状态: " << (checked ? "已选中" : "未选中") << "        ";
			Color::reset();
		});
	// 创建文本框
	TextBox* textBox = new TextBox(Rect(0, 25, 20, 3), "输入框:");
	textBox->setOnClick([]()
		{
			Console::setCursorPosition(0, 15);
			Color::setColor(Color::BRIGHT_GREEN, Color::BLACK);
			std::cout << "文本框获得焦点!                    ";
			Color::reset();
		});

	// 添加清除按钮
	Button* clearButton = new Button(Rect(22, 25, 8, 1), "清除");
	clearButton->setOnClick([textBox]()
		{
			textBox->setText("");
			Console::setCursorPosition(0, 15);
			Color::setColor(Color::BRIGHT_RED, Color::BLACK);
			std::cout << "文本框已清除!                      ";
			Color::reset();
		});

	// 添加显示文本按钮
	Button* showButton = new Button(Rect(22, 27, 8, 1), "显示内容");
	showButton->setOnClick([textBox]()
		{
			Console::setCursorPosition(0, 16);
			Color::setColor(Color::BRIGHT_CYAN, Color::BLACK);
			std::cout << "文本框内容: \"" << textBox->getText() << "\"";
			Color::reset();
		});
	// 添加控件到应用
	app.addControl(title);
	app.addControl(button1);
	app.addControl(button2);
	app.addControl(button3);
	app.addControl(progressbar);
	app.addControl(checkbox);
	app.addControl(textBox);
	app.addControl(clearButton);
	app.addControl(showButton);

	// 运行应用
	app.run();

	return 0;
}
// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
```

## API 文档

### 核心类

#### Application 类
主应用程序类，管理控件和事件循环。

**主要方法:**
- `void run()`: 启动应用程序主循环
- `void stop()`: 停止应用程序
- `void addControl(Control*)`: 添加控件到应用
- `MouseInput& getMouse()`: 获取鼠标输入对象

#### Control 类（基类）
所有控件的基类，提供基本属性和方法。

**主要属性:**
- `bounds`: 控件位置和大小（Rect 对象）
- `text`: 控件文本
- `visible`: 可见性
- `enabled`: 启用状态

**主要方法:**
- `virtual void draw()`: 绘制控件（需子类实现）
- `virtual void handleMouse(const MouseInput&)`: 处理鼠标事件
- `virtual void onClick()`: 点击事件回调

### 控件类

#### Button 类
按钮控件，支持点击事件。

```cpp
Button* btn = new Button(Rect(10, 5, 12, 1), "点击我");
btn->setOnClick([]() {
    // 点击处理逻辑
});
```

#### Label 类
文本标签控件。

```cpp
Label* label = new Label(Rect(5, 3, 20, 1), "这是一个标签");
label->setColors(Color::BRIGHT_WHITE, Color::BLUE);
```

#### CheckBox 类
复选框控件。

```cpp
CheckBox* checkbox = new CheckBox(Rect(0, 8, 15, 1), "启用选项", false);
checkbox->setOnChange([](bool checked) {
    // 状态改变处理
});
```

#### ProgressBar 类
进度条控件，支持多种样式。

```cpp
ProgressBar* progress = new ProgressBar(Rect(0, 10, 30, 1), 0, 100);
progress->setValue(50);
progress->setStyle(ProgressBarStyle::Modern);
```

### 工具类

#### Console 命名空间
控制台操作工具函数。

**主要函数:**
- `void clear()`: 清空控制台
- `void setCursorPosition(int x, int y)`: 设置光标位置
- `void hideCursor()`: 隐藏光标
- `Size getConsoleSize()`: 获取控制台尺寸

#### Color 命名空间
颜色控制功能。

**颜色常量:**
- 基本色: BLACK, BLUE, GREEN, RED 等
- 高亮色: BRIGHT_BLUE, BRIGHT_GREEN, BRIGHT_RED 等

**主要函数:**
- `void setColor(int foreground, int background)`: 设置颜色
- `void reset()`: 重置颜色

### 数据结构

#### Point 结构
表示二维坐标点。
```cpp
Point p(10, 20);  // x=10, y=20
```

#### Size 结构
表示尺寸。
```cpp
Size s(100, 50);  // width=100, height=50
```

#### Rect 结构
表示矩形区域。
```cpp
Rect r(5, 5, 30, 10);  // x=5, y=5, width=30, height=10
```

## 编译说明

### MSVC 编译器
自动链接所需库，无需额外配置。

### MinGW 编译器
需要在编译命令中手动链接库：
```bash
g++ -o program main.cpp -lgdi32 -luser32
```

## 高级用法

### 自定义控件
可以通过继承 `Control` 类创建自定义控件：

```cpp
class CustomControl : public Control {
public:
    CustomControl(const Rect& rect, const std::string& text) 
        : Control(rect, text) {}
    
    void draw() override {
        if (!visible) return;
        
        Console::setCursorPosition(bounds.position.x, bounds.position.y);
        Color::setColor(foregroundColor, backgroundColor);
        std::cout << "自定义: " << text;
        Color::reset();
    }
    
    void onClick() override {
        // 自定义点击处理
    }
};
```

### 鼠标事件处理
可以通过 `MouseInput` 类获取详细的鼠标状态：

```cpp
Application app;
// 在主循环中访问鼠标状态
if (app.getMouse().isLeftClick()) {
    POINT pos = app.getMouse().getPosition();
    // 处理左键点击
}
```

## 注意事项

1. **控制台字体**: 建议使用等宽字体以获得最佳显示效果
2. **快速编辑模式**: 库会自动禁用控制台的快速编辑模式以防止程序暂停
3. **性能考虑**: 在控件较多时注意优化绘制逻辑
4. **线程安全**: 当前版本非线程安全，需在单线程环境下使用

## 示例程序

库中包含完整的演示程序，展示所有控件的使用方法：
- 创建多个按钮并处理点击事件
- 使用复选框并监听状态变化
- 显示不同样式的进度条
- 实时显示鼠标位置信息

## 版本信息

- **开发者**: wbw121124
- **许可证**: GPLv3.0
- **最后更新**: 文档创建日期

## 技术支持

如有问题或建议，请联系开发者或提交问题报告。

## wbwConsoleGUI.h

```cpp
// wbwConsoleGUI - 1.0.0
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
#define wbwConsoleGUIVer "1.0.0"
#ifdef _MSC_VER
#pragma comment(lib, "gdi32.lib")
#pragma comment(lib, "user32.lib")
#elif defined(__GNUC__) && false
#warning 使用MinGW编译时, 应在命令行中链接库: `-lgdi32 -luser32`
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
			mode &= ~ENABLE_QUICK_EDIT_MODE;  // 禁用快速编辑
			mode &= ~ENABLE_INSERT_MODE;      // 禁用插入模式
			mode |= ENABLE_EXTENDED_FLAGS;    // 启用扩展标志
			mode &= ~ENABLE_ECHO_INPUT;
			mode &= ~ENABLE_PROCESSED_INPUT;
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
				if (hasSelection)
					deleteSelection();
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
					deleteSelection();
				}
				else if (cursorPosition < content.length())
				{
					content.erase(cursorPosition, 1);
				}

			// // 处理选择（按住Shift） // ps:废了
			// if (GetAsyncKeyState(VK_SHIFT) & 0x8000)
			// {
			// 	if (!hasSelection)
			// 	{
			// 		selectionStart = cursorPosition;
			// 		hasSelection = true;
			// 	}
			// }
			// else
			// {
			// 	hasSelection = false;
			// }

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

		void deleteSelection()
		{
			if (!hasSelection) return;

			size_t start = std::min(selectionStart, cursorPosition);
			size_t end = std::max(selectionStart, cursorPosition);

			content.erase(start, end - start);
			cursorPosition = start;
			hasSelection = false;
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
					std::cout << "鼠标: (" << pos.x << ", " << pos.y << ")    ";
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
