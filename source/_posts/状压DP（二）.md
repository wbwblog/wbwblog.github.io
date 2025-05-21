---
title: 状压DP（二）
categories:
	- [动态规划]
	- [状态压缩]
	- [算法]
	- [编程]
tags:
	- [动态规划]
	- [状态压缩]
hot: true
new: true
date: 2025-05-03 21:00:00
---

# 状压DP（二）

## 洛谷P3092

[P3092 [USACO13NOV] No Change G](https://www.luogu.com.cn/problem/P3092)

这道题，我们一般定义 $dp_{i,j}$ 为硬币使用了二进制下的 $i$，付到第 $j$ 个人的最多剩下多少钱。

不过 $2^{16}\times 10^5=6,553,600,000$，会超过空间限制。

我们发现“最多剩下多少钱”没有用，因为可以通过使用情况算出。

定义新的状态 $dp_{i}$ 表示硬币使用了二进制下的 $i$ 的最多能付到的人，可以通过前缀和加二分优化计算。

<!-- more -->

答案需要枚举。

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 1e5 + 5;
int n, m, dp[1 << 16], a[N], b[N], sum[N], sum1, ans = -1;
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n >> m;
	for (int i = 0; i < n; i++)
		cin >> a[i], sum1 += a[i];
	for (int i = 1; i <= m; i++)
		cin >> b[i], sum[i] = sum[i - 1] + b[i];
	for (int i = 1; i < (1 << n); i++)
	{
		int sum2 = 0;
		for (int j = 0; j < n; j++)
			if ((i >> j) & 1)
			{
				int& tmp = dp[i ^ (1 << j)];
				int l = tmp - 1, r = m + 1;
				while (l + 1 < r)
				{
					int mid = (l + r) >> 1;
					if (sum[mid] - sum[tmp] <= a[j])
						l = mid;
					else
						r = mid;
				}
				dp[i] = max(dp[i], l);
				sum2 += a[j];
			}
		if (dp[i] == m)
			ans = max(ans, sum1 - sum2);
	}
	cout << ans;
	return 0;
}
```

## 洛谷P5911

[P5911 [POI 2004] PRZ - 洛谷](https://www.luogu.com.cn/problem/P5911)

定义 $dp_i$ 表示已经过桥的队员为二进制下的 $i$ 的最小过桥时间。

状态转移：

```cpp
for (int i = 1; i < (1 << n); i++)
    for (int j = 1; j < (1 << n); j++)
        if ((i & j) == j && sum[j] <= m)
            dp[i] = min(dp[i], dp[i ^ j] + maxi[j]);
```

答案为 $dp_{2^n-1}$。

时间复杂度为 $O(4^n)$。

等一等，$4^{16}=4,294,967,296\gt \text{一秒内可以跑的循环次数}$。

考虑优化，如何不枚举无效状态（也就是只枚举子集）？

```cpp
for (int i = 1; i < (1 << n); i++)
    for (int j = i; j; j = (j - 1) & i)
```

为什么正确？

可以通过模拟验证：

> 设 $i={(114)}_{10}={(01110010)}_2$。
>
> 第二次枚举时， $j=\left({(01110010)}_2-1\right)\operatorname{and}{(01110010)}_2={(01110000)}_2$。
>
> 第三次枚举时， $j=\left({(01110000)}_2-1\right)\operatorname{and}{(01110010)}_2={(01101111)}_2\operatorname{and}{(01110010)}_2={(01100010)}_2$。
>
> $\cdots$
>
> 以此类推。
>
> 我们发现下枚举总是小于这一次的最大的有效状态。

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 16 + 5;
int n, m, dp[1 << 16], a[N], b[N], sum[1 << 16], maxi[1 << 16];
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> m >> n;
	memset(dp, 0x3f, sizeof dp);
	dp[0] = 0;
	for (int i = 0; i < n; i++)
	{
		cin >> a[i] >> b[i];
		for (int j = 1; j < (1 << n); j++)
			if ((j >> i) & 1)
				sum[j] += b[i], maxi[j] = max(maxi[j], a[i]);
	}
	for (int i = 1; i < (1 << n); i++)
		for (int j = i; j; j = (j - 1) & i)
			if (sum[j] <= m)
				dp[i] = min(dp[i], dp[i ^ j] + maxi[j]);
	cout << dp[(1 << n) - 1];
	return 0;
}
```

时间复杂度 $O(3^n)$。

为什么？

证明方法一：

> 每个队员有以下可以枚举的状态：
>
> 1. 没有；
> 2. $i$ 中有；
> 3. $i,j$ 中都有。
>
> 因此是 $O(3^n)$

证明方法二：

> 前置知识：
>
> > [二项式定理](https://oi-wiki.org/math/combinatorics/combination/#%E4%BA%8C%E9%A1%B9%E5%BC%8F%E5%AE%9A%E7%90%86)：
> >
> > $$\displaystyle(x+y)^n=\sum^n_{i=0}\operatorname{C}^i_nx^iy^{n-i}$$
>
> 总枚举次数为 $\displaystyle\sum_{i=0}^{2^n}2^{\operatorname{popcount}i}$，其中 $\operatorname{popcount}i$ 为二进制下的 $i$ 的 $1$ 的个数。
>
> $$\begin{aligned}\sum_{i=0}^{2^n}2^{\operatorname{popcount}i}&=\sum_{i=0}^n\operatorname{C}^i_n 2^n\\&=\sum_{i=0}^n\operatorname{C}^i_n 2^n\times1\\&=(2+1)^n\\&=3^n\end{aligned}$$

## 洛谷P3694

[P3694 邦邦的大合唱站队](https://www.luogu.com.cn/problem/P3694)

考虑状态 $dp_i$ 为已经排好的乐队为二进制下的 $i$ 的出列人数，用前缀和辅助动态规划。

答案为 $dp_{2^m-1}$。

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 1e5 + 5;
int n, m, dp[1 << 20], a[N], sum[N][20], sum1[1 << 20];
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n >> m;
	memset(dp, 0x3f, sizeof dp);
	dp[0] = 0;
	for (int i = 1; i <= n; i++)
	{
		cin >> a[i];
		for (int j = 0; j < m; j++)
			sum[i][j] = sum[i - 1][j];
		sum[i][--a[i]]++;
	}
	for (int i = 1; i < (1 << m); i++)
		for (int j = 0; j < m; j++)
			if ((i >> j) & 1)
			{
				sum1[i] = sum1[i ^ (1 << j)] + sum[n][j];
				int l = sum1[i ^ (1 << j)] + 1, r = l + sum[n][j] - 1;
				dp[i] = min(dp[i], dp[i ^ (1 << j)] + sum[n][j] -
					sum[r][j] + sum[l - 1][j]);
			}
	cout << dp[(1 << m) - 1];
	return 0;
}
```

## 洛谷P10449

[P10449 费解的开关](https://www.luogu.com.cn/problem/P10449)

对于每一组数据，我们暴力还原，时间复杂度 $O(26^6n)=O(n)$，常数十分大。

为什么不预处理呢？

为了方便存储，我们状态压缩数组，使用 dfs/bfs 搜索。

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 1e5 + 5;
int t, dx[] = { 0,0,0,1,-1 }, dy[] = { 0,1,-1,0,0 };
map<int, int>mp;
int work(int z, int x, int y)
{
	for (int i = 0; i < 5; i++)
	{
		int nx = x + dx[i], ny = y + dy[i];
		if (nx < 6 && nx && ny < 6 && ny)
			z ^= 1 << ((nx - 1) * 5 + ny - 1);
	}
	return z;
}
void dfs(int x, int y, int z = (1 << 25) - 1, int sum = 0)
{
	if (sum > 6)
		return;
	mp[z] = sum;
	if (x == 6)
		return;
	dfs(x + !(y % 5), y % 5 + 1, z, sum);
	dfs(x + !(y % 5), y % 5 + 1, work(z, x, y), sum + 1);
	return;
}
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	dfs(1, 1);
	cin >> t;
	while (t--)
	{
		int sum = 0;
		for (int i = 1; i <= 25; i++)
		{
			char c;
			cin >> c;
			sum |= (c - '0') << (25 - i);
		}
		if (!mp.count(sum))
			cout << "-1\n";
		else
			cout << mp[sum] << '\n';
	}
	return 0;
}
```