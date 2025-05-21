---
title: 区间dp（二）
date: 2025-01-01 00:00:00
tags:
	- [动态规划]
	- [区间dp]
categories:
	- [编程]
	- [算法]
	- [动态规划]
	- [区间dp]
---

# 区间dp（二）

## 洛谷P1220

[P1220 关路灯](https://www.luogu.com.cn/problem/P1220)

> 请你为老张编一程序来安排关灯的顺序，使从老张开始关灯时刻算起所有灯消耗电最少（灯关掉后便不再消耗电了）。

老张关路灯像区间dp，可以发现他关路灯时不会关关过的中间加的，不然不优。

### 状态

$dp_{i,j,0/1}$ 表示区间关 $[i,j]$ 最后达到 $i/j$ 的最少功耗。

### 答案

$$\min(dp_{1,n,0},dp_{1,n,1})$$

<!-- more -->

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 50 + 5;
int n, m, dp[N][N][2], a[N], b[N], sum[N];
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n >> m;
	memset(dp, 0x3f, sizeof dp);
	for (int i = 1; i <= n; i++)
		cin >> a[i] >> b[i], sum[i] = sum[i - 1] + b[i];
	dp[m][m][0] = dp[m][m][1] = 0;
	for (int len = 2; len <= n; len++)
		for (int i = 1; i + len - 1 <= n; i++)
		{
			int j = i + len - 1, tmp = sum[n] - sum[j] + sum[i],
				tmp1 = sum[n] - sum[j - 1] + sum[i - 1];
			dp[i][j][0] = min(dp[i + 1][j][0] + (a[i + 1] - a[i]) * tmp,
				dp[i + 1][j][1] + (a[j] - a[i]) * tmp);
			dp[i][j][1] = min(dp[i][j - 1][0] + (a[j] - a[i]) * tmp1,
				dp[i][j - 1][1] + (a[j] - a[j - 1]) * tmp1);
		}
	cout << min(dp[1][n][0], dp[1][n][1]);
	return 0;
}
```

## 洛谷P8675

[P8675 [蓝桥杯 2018 国 B] 搭积木](https://www.luogu.com.cn/problem/P8675)

### 状态

$dp_{l,i,j}$ 表示搭 $l$ 层的区间 $[i,j]$ 的方案数。

### 答案

$$\displaystyle\left(\sum^l_{1\le l\le n}\sum^i_{1\le i\le m}\sum^j_{i\le j\le m}dp_{l,i,j}\right)\bmod{10^9+7}$$

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 100 + 5;
int n, m, dp[N][N][N], sum[N][N], vis[N][N], ans, mod = 1e9 + 7;
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n >> m;
	for (int i = n; i >= 1; i--)
		for (int j = 1; j <= m; j++)
		{
			char c;
			cin >> c;
			vis[i][j] = vis[i][j - 1] + (c == 'X');
		}
	dp[0][1][m] = 1;
	for (int l = 1; l <= n; l++)
	{
		memset(sum, 0, sizeof sum);
		for (int i = 1; i <= m; i++)
			for (int j = i; j <= m; j++)
				sum[i][j] = (sum[i - 1][j] + sum[i][j - 1] - sum[i - 1][j - 1] +
					dp[l - 1][i][j] + mod) % mod;
		for (int len = 1; len <= m; len++)
			for (int i = 1; i + len - 1 <= m; i++)
			{
				int j = i + len - 1;
				if (!(vis[l][j] - vis[l][i - 1]))
					ans = (ans + (dp[l][i][j] = (sum[i][m] - sum[i][j - 1] +
						mod) % mod)) % mod;
			}
	}
	cout << (ans + 1) % mod;
	return 0;
}
```

## 洛谷P4302

[P4302 [SCOI2003] 字符串折叠](https://www.luogu.com.cn/problem/P4302)

> 给一个字符串，求它的最短折叠。
>
> 例如 `AAAAAAAAAABABABCCD` 的最短折叠为：`9(A)3(AB)CCD`。
>
> `NEERCYESYESYESNEERCYESYESYES` 的是 `2(NEERC3(YES))`

### 状态

$dp_{i,j}$ 表示折叠区间 $[i,j]$ 的最短长度。

### 答案

$$dp_{1,n}$$

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 100 + 5;
int n, dp[N][N];
string s;
bool check(int x, int y, int z)
{
	for (int i = x; i <= y; i++)
		if (s[i] != s[x + ((i - x) % z)])
			return false;
	return true;
}
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> s;
	n = s.size();
	s = '#' + s;
	memset(dp, 0x3f, sizeof dp);
	for (int i = 1; i <= n; i++)
		dp[i][i] = 1;
	for (int len = 2; len <= n; len++)
		for (int i = 1; i + len - 1 <= n; i++)
		{
			int j = i + len - 1;
			dp[i][j] = len;
			for (int k = i; k < j; k++)
			{
				dp[i][j] = min(dp[i][j], dp[i][k] + dp[k + 1][j]);
				if (!(len % (k - i + 1)) && check(i, j, k - i + 1))
					dp[i][j] = min(dp[i][j], dp[i][k] + 2 +
						(int)to_string(len / (k - i + 1)).size());
			}
		}
	cout << dp[1][n];
	return 0;
}
```

## 洛谷P2135

[P2135 方块消除](https://www.luogu.com.cn/problem/P2135)

双倍经验：[UVA10559 方块消除 Blocks](https://www.luogu.com.cn/problem/UVA10559)

> Jimmy 最近迷上了一款叫做方块消除的游戏。游戏规则如下：$n$ 个带颜色方格排成一列，相同颜色的方块连成一个区域（如果两个相邻方块颜色相同，则这两个方块属于同一区域）。为简化题目，将连起来的同一颜色方块的数目用一个数表示。
> 
> 例如，`9 122233331` 表示为
> 
> ```plain
4
1 2 3 1
1 3 4 1
> ```
> 
> 游戏时，你可以任选一个区域消去。设这个区域包含的方块数为 $x$，则将得到 $x^2$ 个分值。方块消去之后，其余的方块就会竖直落到底部或其他方块上。而且当有一列方块被完全消去时，其右边的所有方块就会向左移一格。Jimmy 希望你能找出得最高分的最佳方案，你能帮助他吗？

### 状态

$dp_{i,j,k}$ 表示消去区间 $[i,j]$ 且一起消去了 $i$ 前面和它相同的 $k$ 个的最高可能得分。

### 答案

$$dp_{1,n,0}$$

```cpp
/*此代码状态设计相反*/
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 50 + 5;
int n, m, a[N], b[N], dp[N][N][1005], sum[N];
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n;
	for (int i = 1; i <= n; i++)
		cin >> a[i];
	for (int i = 1; i <= n; i++)
		cin >> b[i];
	for (int i = 1; i <= n; i++)
		for (int j = i + 1; j <= n; j++)
			if (a[i] == a[j])
				sum[i] += b[j];
	for (int i = 1; i <= n; i++)
		for (int j = 0; j <= sum[i]; j++)
			dp[i][i][j] = (b[i] + j) * (b[i] + j);
	for (int len = 2; len <= n; len++)
		for (int i = 1; i + len - 1 <= n; i++)
		{
			int j = i + len - 1;
			for (int k = 0; k <= sum[j]; k++)
				dp[i][j][k] = dp[i][j - 1][0] + (b[j] + k) * (b[j] + k);
			for (int k = i; k <= j - 2; k++)
				if (a[j] == a[k])
					for (int l = 0; l <= sum[j]; l++)
						dp[i][j][l] = max(dp[i][j][l], dp[i][k][b[j] + l] +
							dp[k + 1][j - 1][0]);
		}
	cout << dp[1][n][0];
	return 0;
}
```



```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 50 + 5;
int n, m, a[N], b[N], dp[N][N][1005], sum[N];
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n;
	for (int i = 1; i <= n; i++)
		cin >> a[i];
	for (int i = 1; i <= n; i++)
		cin >> b[i];
	for (int i = 1; i <= n; i++)
		for (int j = 1; j < i; j++)
			if (a[i] == a[j])
				sum[i] += b[j];
	for (int i = 1; i <= n; i++)
		for (int j = 0; j <= sum[i]; j++)
			dp[i][i][j] = (b[i] + j) * (b[i] + j);
	for (int len = 2; len <= n; len++)
		for (int i = 1; i + len - 1 <= n; i++)
		{
			int j = i + len - 1;
			for (int k = 0; k <= sum[i]; k++)
				dp[i][j][k] = dp[i + 1][j][0] + (b[i] + k) * (b[i] + k);
			for (int k = i + 1; k < j; k++)
				if (a[i] == a[k + 1])
					for (int l = 0; l <= sum[i]; l++)
						dp[i][j][l] = max(dp[i][j][l], dp[i + 1][k][0] +
							dp[k + 1][j][b[i] + l]);
		}
	cout << dp[1][n][0];
	return 0;
}
```

