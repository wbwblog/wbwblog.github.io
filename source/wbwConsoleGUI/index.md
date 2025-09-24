---
title: about
date: 2025-09-25 00:00:00
layout: "page"
---

```cpp
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
#ifdef _MSC_VER
#pragma comment(lib, "gdi32.lib")
#pragma comment(lib, "user32.lib")
#elif defined(__GNUC__)
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

	int stringSize(std::string s)
	{
		return s.size();
	}
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

	// 颜色控制（保持不变）
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
	// 基础控件类（增强版，支持鼠标事件）
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
		}

		virtual void onClick() { }
		virtual void onHover() { }
		virtual void onLeave() { }

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
	};
	// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
	// 增强的按钮控件（支持鼠标悬停和点击效果）
	class Button : public Control {
	private:
		std::function<void()> clickHandler;

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

		void onClick() override
		{
			if (enabled && clickHandler)
			{
				clickHandler();
			}
		}

		void setOnClick(const std::function<void()>& handler)
		{
			clickHandler = handler;
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
		Classic,    // Windows经典样式
		Modern,     // Windows现代样式
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

			drawBlockProgressBar();

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
		// 块状样式
		void drawBlockProgressBar()
		{
			int progressWidth = getProgressWidth();
			int barWidth = bounds.size.width;
			int blockCount = barWidth / 2;  // 每个块占2个字符宽度

			Console::setCursorPosition(bounds.position.x, bounds.position.y);

			int completedBlocks = progressWidth / 2.00;

			for (int i = 0; i < blockCount; i++)
			{
				if (i < completedBlocks)
				{
					Color::setColor(colors.progress, colors.progress);
					std::cout << "■";  // 实心方块
				}
				else
				{
					Color::setColor(colors.background, colors.background);
					std::cout << "□";  // 空心方块
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
		bool running, showDebug = false;

	public:
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
// 使用示例
int main()
{
	using namespace wbwConsoleGUI;
	Console::disableQuickEditMode();

	Application app;

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

	Button* button2 = new Button(Rect(5, 6, 8, 1), "按钮2");
	button2->setOnClick([]()
		{
			Console::setCursorPosition(0, 12);
			Color::setColor(Color::BRIGHT_RED, Color::BLACK);
			std::cout << "按钮2被点击了!                    ";
			Color::reset();
		});

	Button* button3 = new Button(Rect(10, 7, 8, 1), "按钮3");
	button3->setOnClick([]()
		{
			Console::setCursorPosition(0, 12);
			Color::setColor(Color::BRIGHT_RED, Color::BLACK);
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

	// 添加控件到应用
	app.addControl(title);
	app.addControl(button1);
	app.addControl(button2);
	app.addControl(button3);
	app.addControl(checkbox);

	// 运行应用
	app.run();

	return 0;
}
// wbwConsoleGUI - dev by wbw121124 - GPLv3.0
```
