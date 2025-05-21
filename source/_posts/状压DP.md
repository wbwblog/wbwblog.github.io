---
title: 状压DP
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
date: 2025-05-02 20:11:28
---

# 状压DP

> 状压 DP 是动态规划的一种，通过将状态压缩为整数来达到优化转移的目的。
>
> ——[OI-WIKI](https://oi.wiki/dp/state/)

<!--more-->

我们看 [P10447 最短 Hamilton 路径](https://www.luogu.com.cn/problem/P10447)：

> 给定一张 $n$ 个点的带权无向图，点从 $0 \sim n-1$ 标号，求起点 $0$ 到终点 $n-1$ 的最短 Hamilton 路径。 
>
> Hamilton 路径的定义是从 $0$ 到 $n-1$ 不重不漏地经过每个点恰好一次。

我们发现状态转移需要获取点有没有转移过，所以定义 $dp _ {0/1,0/1,\cdots,0/1,i}$ 表示最后到点 $i$，其他点有没有转移的最短 Hamilton 路径长度。

写 $n+1$ 个循环的代码十分长，能不能让转移更简洁？

这个状态前面特别像二进制整数，我们可以用数表示。

$dp _ {i,j}$ 表示点有没有转移是二进制下 $i$，最后达到 $j$ 的最短 Hamilton 路径的长度。

答案为 $dp _ {2^n-1,n-1}$。

优化：枚举 $i$ 时 $i=i+2$ 而不是 $i=i+1$。

时间复杂度 $O(\frac{2^nn^2}{2})=O(2^{n-1}n^2)$。

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 20 + 5;
int n, dp[1 << 20][N], dis[N][N];
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	memset(dp, 0x3f, sizeof dp);
	cin >> n;
	for (int i = 0; i < n; i++)
		for (int j = 0; j < n; j++)
			cin >> dis[i][j];
	dp[1][0] = 0;
	for (int i = 3; i < (1ll << n); i += 2)
		for (int j = 0; j < n; j++)
			if ((i >> j) & 1)
				for (int k = 0; k < n; k++)
					if (((i >> k) & 1) && j != k)
						dp[i][j] = min(dp[i][j], dp[i ^ (1ll << j)][k] + dis[k][j]);
	cout << dp[(1 << n) - 1][n - 1];
	return 0;
}
```

## 例题

### 洛谷P1171

[P1171 售货员的难题](https://www.luogu.com.cn/problem/P1171)

和上一题差不多，只是需要回到 $1$ 节点。

可以枚举回去前最后一次到达的点。

```cpp
for (int i = 1; i < n; i++)
	ans = min(ans, dp[(1 << n) - 1][i] + dis[i][0]);
```

剩下的一样。

### 洛谷P2704

[P2704 [NOI2001] 炮兵阵地](https://www.luogu.com.cn/problem/P2704)

定义 $dp_{i,j,k}$ 表示第 $i$ 行摆放二进制下的 $j$，第 $i-1$ 行摆放二进制下的 $k$ 时最多能摆放的炮兵部队的数量。

答案为 $\max dp_{i,j,k}$。

但是 $100\times4^{10}=104,867,600$ 次状态转移，会 TLE。

优化：实际上有用的 $j,k$ 只有最多 $60$ 个，因此可以预处理有用的 $j,k$。

时间复杂度 $O(nk^2+2^{10})$，其中 $k$ 表示有用的 $j$ 的个数。

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 100 + 5;
int n, m, a[N], b[N], c[N], cnt, dp[N][65][65], ans;
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n >> m;
	for (int i = 1; i <= n; i++)
		for (int j = 1; j <= m; j++)
		{
			char c;
			cin >> c;
			a[i] = (a[i] << 1) + (c == 'P');
		}
	for (int i = 0; i < (1 << m); i++)
		if (!((i << 1) & i) && !((i << 2) & i))
		{
			cnt++;
			b[cnt] = i;
			c[cnt] = __builtin_popcount(i);
		}
	for (int i = 1; i <= n; i++)
		for (int j = 1; j <= cnt; j++)
			if ((b[j] | a[i]) == a[i])
				for (int k = 1; k <= cnt; k++)
					if (!(b[j] & b[k]) && (b[k] | a[i - 1]) == a[i - 1])
						for (int l = 1; l <= cnt; l++)
							if (!(b[j] & b[l]))
								ans = max(ans, dp[i][j][k] = max(dp[i][j][k],
									dp[i - 1][k][l] + c[j]));
	cout << ans;
	return 0;
}
```

### 洛谷P1896

[P1896 [SCOI2005] 互不侵犯](https://www.luogu.com.cn/problem/P1896)

定义 $dp_{i,j,k}$ 表示第 $i$ 行摆放二进制下的 $j$，一共摆放了 $k$ 个的方案数。

答案为 $\sum dp_{i,j,K}$。

时间复杂度 $O(2^NNK)$。

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 100 + 5;
int n, m, dp[N][1 << 9][N], ans;
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n >> m;
	dp[0][0][0] = 1;
	for (int i = 1; i <= n; i++)
		for (int j = 0; j < (1 << n); j++)
			if (!((j << 1) & j))
			{
				int tmp = __builtin_popcount(j);
				for (int k = 0; k < (1 << n); k++)
					if (!((j << 1) & k) && !(j & k) && !((k << 1) & j))
						for (int l = tmp + __builtin_popcount(k); l <= m; l++)
							dp[i][j][l] = dp[i][j][l] + dp[i - 1][k][l - tmp];
				if (tmp)
					ans += dp[i][j][m];
			}
	cout << ans;
	return 0;
}
```

### 洛谷P8756

[P8756 [蓝桥杯 2021 省 AB2] 国际象棋](https://www.luogu.com.cn/problem/P8756)

定义 $dp_{i,j,k,l}$ 表示第 $i$ 列摆放二进制下的 $j$，第 $i-1$ 列摆放二进制下的 $k$，一共摆放了 $l$ 个的方案数。

答案为 $\sum dp_{i,j,k,K}$。

时间复杂度 $O(2^NMK)$。

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 100 + 5, mod = 1e9 + 7;
int n, m, k, dp[N][1 << 6][1 << 6][25], ans;
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n >> m >> k;
	dp[0][0][0][0] = 1;
	for (int i = 1; i <= m; i++)
		for (int j = 0; j < (1 << n); j++)
		{
			int tmp = __builtin_popcount(j);
			for (int k = 0; k < (1 << n); k++)
				if (!((k << 2) & j) && !((j << 2) & k) && (i > 1 ? true : !k))
				{
					int tmp1 = __builtin_popcount(k);
					for (int l = 0; l < (1 << n); l++)
						if (!((l << 1) & j) && !((j << 1) & l) && (i > 2 ? true : !l))
							for (int x = tmp + tmp1 +
								__builtin_popcount(l); x <= ::k; x++)
								dp[i][j][k][x] = (dp[i][j][k][x] +
									dp[i - 1][k][l][x - tmp]) % mod;
					if (tmp)
						ans = (ans + dp[i][j][k][::k]) % mod;
				}
		}
	cout << ans;
	return 0;
}
```

### SP1700

[SP1700 TRSTAGE - Traveling by Stagecoach](https://www.luogu.com.cn/problem/SP1700)

[Traveling by Stagecoach - SPOJ TRSTAGE](https://vjudge.net/problem/SPOJ-TRSTAGE#author=DeepSeek_zh)

定义 $dp_{i,j}$ 表示到达状态为二进制下的 $i$ 最后到 $j$ 的最短用时。

答案为 $\min dp_{i,b}$。

时间复杂度 $O\left(2^nn(m+k)\right)$。

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 30 + 5;
int n, m, k, x, y, a[N], b[N][N];
double dp[1 << 8][N], ans;
vector<int>nbr[N];
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	while (cin >> n >> m >> k >> x >> y)
	{
		if (!n)
			break;
		for (int i = 0; i < n; i++)
			cin >> a[i];
		for (int i = 1; i <= m; i++)
			nbr[i].clear();
		for (int i = 1; i <= k; i++)
		{
			int x, y;
			cin >> x >> y;
			cin >> b[x][y];
			b[y][x] = b[x][y];
			nbr[x].push_back(y);
			nbr[y].push_back(x);
		}
		ans = 1e9;
		for (int i = 0; i < (1 << n); i++)
			for (int j = 1; j <= m; j++)
				dp[i][j] = 1e9;
		dp[0][x] = 0;
		for (int i = 1; i < (1 << n); i++)
			for (int j = 0; j < n; j++)
				if ((i >> j) & 1)
					for (int k = 1; k <= m; k++)
					{
						for (auto& nxt : nbr[k])
							dp[i][k] = min(dp[i][k], dp[i ^ (1 << j)][nxt] +
								b[k][nxt] * 1.00 / a[j]);
						if (k == y)
							ans = min(ans, dp[i][k]);
					}
		if (ans == 1e9)
			cout << "Impossible\n";
		else
			cout << fixed << setprecision(3) << ans << '\n';
	}
	return 0;
}
```