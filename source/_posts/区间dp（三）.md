---
title: 区间dp（三）
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

# 区间dp（三）

## 洛谷P1880

[P1880 [NOI1995] 石子合并 - 洛谷](https://www.luogu.com.cn/problem/P1880)

石子在圆形操场的四周摆放，直接当没有环形区间dp显然会少答案。那么我们一定要这么做怎么办？少了的话可以加回来，斩环为链，数组多一倍，再区间dp。

$dp_{0/1,i,j}$ 表示区间合并 $[i,j]$ 的最小/最大值。

答案为 $\displaystyle\min_{1\le i\lt n}^idp_{0,i,i+n-1}$ 和 $\displaystyle\max_{1\le i\lt n}^idp_{1,i,i+n-1}$。

$\displaystyle dp_{0,i,j}=\min_{i\le k\lt j}^k\left(dp_{0,i,k}+dp_{0,k+1,j}+\sum_{i\le l\le j}^la_l\right)$，$\displaystyle dp_{1,i,j}=\max_{i\le k\lt j}^k\left(dp_{1,i,k}+dp_{1,k+1,j}+\sum_{i\le l\le j}^la_l\right)$。

<!-- more -->

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 200 + 5;
int n, a[N], dp[2][N][N], sum[N], maxi, mini = LLONG_MAX;
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n;
	memset(dp[0], 0x3f, sizeof dp[0]);
	memset(dp[1], 0xcf, sizeof dp[1]);
	for (int i = 1; i <= n; i++)
	{
		cin >> a[i];
		a[i + n] = a[i];
	}
	for (int i = 1; i <= 2 * n; i++)
		sum[i] = sum[i - 1] + a[i], dp[0][i][i] = dp[1][i][i] = 0;
	for (int len = 2; len <= n; len++)
		for (int i = 1; i + len - 1 <= 2 * n; i++)
		{
			int j = i + len - 1, tmp = sum[j] - sum[i - 1];
			for (int k = i; k < j; k++)
			{
				dp[0][i][j] = min(dp[0][i][j], dp[0][i][k] + dp[0][k + 1][j] + tmp);
				dp[1][i][j] = max(dp[1][i][j], dp[1][i][k] + dp[1][k + 1][j] + tmp);
			}
		}
	for (int i = 1; i < n; i++)
	{
		mini = min(mini, dp[0][i][i + n - 1]);
		maxi = max(maxi, dp[1][i][i + n - 1]);
	}
	cout << mini << '\n' << maxi;
	return 0;
}
```

## 洛谷P1063

[P1063 能量项链](https://www.luogu.com.cn/problem/P1063)

这一题也是斩环为链，但需要注意计算答案时要弄清楚位置。

$dp_{i,j}$ 表示区间 $[i,j]$ 的最大能量值。

$\displaystyle dp_{i,j}=\max_{i\lt k\lt j}^k\left(dp_{i,k}+dp_{k,j}+a_i\cdot a_j\cdot a_k\right)$。

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 200 + 5;
int n, a[N], dp[N][N], maxi;
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n;
	for (int i = 1; i <= n; i++)
	{
		cin >> a[i];
		a[i + n] = a[i];
	}
	for (int len = 2; len <= n + 1; len++)
		for (int i = 1; i + len - 1 <= 2 * n; i++)
		{
			int j = i + len - 1;
			for (int k = i + 1; k < j; k++)
				dp[i][j] = max(dp[i][j], dp[i][k] + dp[k][j] +
					a[i] * a[j] * a[k]);
		}
	for (int i = 1; i <= n; i++)
		maxi = max(maxi, dp[i][i + n]); //这道题不要减1,因为头尾标记共用
	cout << maxi;
	return 0;
}
```

## 洛谷P4342

[P4342 [IOI 1998] Polygon](https://www.luogu.com.cn/problem/P4342)

这道题不仅需要计算最大值，因为有乘法操作，所以需要维护最小值。

$dp_{i,j,0/1}$ 表示计算区间 $[i,j]$ 的最小值/最大值。



```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 100 + 5;
int n, a[N], dp[N][N][2], ans = INT_MIN;
char c[N];
int work(int x, int y, char c)
{
	if (c == 't')
		return x + y;
	return x * y;
}
int help(int x, int y, bool f)
{
	if (!f)
		return min(x, y);
	return max(x, y);
}
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n;
	for (int i = 1; i <= n; i++)
	{
		cin >> c[i] >> a[i];
		c[n + i] = c[i];
		a[n + i] = a[i];
		dp[i][i][0] = dp[i][i][1] = dp[n + i][n + i][0] = dp[n + i][n + i][1] = a[i];
	}
	c[2 * n + 1] = c[1];
	for (int len = 2; len <= n; len++)
		for (int i = 1; i + len - 1 <= 2 * n; i++)
		{
			int j = i + len - 1;
			dp[i][j][0] = INT_MAX; //最小值和最大值初始状态不要赋错
			dp[i][j][1] = INT_MIN;
			for (int k = i; k < j; k++)
				for (int l = 0; l < 8; l++)
					dp[i][j][l & 1] = help(dp[i][j][l & 1],
						work(dp[i][k][(l & 2) >> 1], dp[k + 1][j][(l & 4) >> 2],
							c[k + 1]), l & 1);
		}
	for (int i = 1; i <= n; i++)
		ans = max(ans, dp[i][n + i - 1][1]);
	cout << ans << '\n';
	for (int i = 1; i <= n; i++)
		if (dp[i][n + i - 1][1] == ans)
			cout << i << ' ';
	return 0;
}
```

## 洛谷P6064

[P6064 [USACO05JAN] Naptime G](https://www.luogu.com.cn/problem/P6064)

我们发现第 $1$ 时间端依赖前一天的最后的时间段，所以这道题需要分情况讨论前一天的最后的时间段是否睡觉，且不是区间dp。

$dp_{i,j,0/1}$ 表示枚举到第 $i$ 端时间，睡了 $j$ 小时，第 $i$ 小时是否睡觉的最大效用值。

```cpp
#include<bits/stdc++.h>
typedef int int32;
// #define int long long
using namespace std;
const int N = 3830 + 5;
int n, m, a[N], dp[N][N][2];
int work(bool f)
{
	memset(dp, 0xcf, sizeof dp);
	dp[1][0][0] = 0;
	dp[1][1][1] = f * a[1];
	for (int i = 2; i <= n; i++)
		for (int j = 0; j <= m; j++)
		{
			dp[i][j][0] = max({ dp[i][j][0],dp[i - 1][j][0],dp[i - 1][j][1] });
			if (j)
				dp[i][j][1] = max({ dp[i][j][1],dp[i - 1][j - 1][0],
					dp[i - 1][j - 1][1] + a[i] });
		}
	return dp[n][m][f];
}
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n >> m;
	for (int i = 1; i <= n; i++)
		cin >> a[i];
	cout << max(work(false), work(true));
	return 0;
}
```

