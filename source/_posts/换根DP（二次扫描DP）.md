---
title: 换根DP（二次扫描DP）
categories:
	- [动态规划]
	- [树形结构]
	- [算法]
	- [编程]
tags:
	- [动态规划]
	- [树形结构]
hot: true
new: true
date: 2025-09-27 00:00:00
---

# 换根DP（二次扫描DP）
## 介绍
对于树形DP,若给定无根树，而问题的最优解与根节点相关，那么考虑换根DP。

通常可以将枚举根节点跑DP的时间复杂度由 $O(N^2)$ 降为 $O(N)$。

<!--more-->

## 换根DP的实现步骤
1. 定义 $dp_i$ 表示以 $i$ 为根节点的子树，XXX的最值或方案数；跑一遍从下到上转移的树形DP（$dfs(root)$）；
2. 定义 $f_i$ 表示点 $i$ 为全局根节点的XXX的最值或方案数，并令 $f_1=dp_1$；
3. 再跑一遍从上到下转移的树形DP（$dfs1(root)$）。

## 例题

### 洛谷P3478
[P3478 [POI 2008] STA-Station](https://www.luogu.com.cn/problem/P3478)

定义 $dp_i$ 表示以 $i$ 为根节点的子树深度之和最大值。

$$dp_x=dep_x+\sum^{nxt}_{nxt\in children_x}dp_{nxt}$$

定义 $f_i$ 表示点 $i$ 为全局根节点的深度之和最大值。

设 $f_{nxt}=ff$，则：

$$\begin{aligned}ff & = (f_x-ff)+(n-size_{nxt})+(ff-size_{nxt})\\&=f_x-2size_{nxt}+n\end{aligned}$$

当然，这道题因为求的是选择的结点编号，所以可以不设 $dp_i$（不推荐）。

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 1e6 + 5;
int n, dp[N], f[N], size[N];
vector<int>nbr[N];
void dfs(int x, int fa, int sum)
{
	dp[x] = sum;
	::size[x] = 1;
	for (auto& nxt : nbr[x])
		if (nxt != fa)
		{
			dfs(nxt, x, sum + 1);
			::size[x] += ::size[nxt];
			dp[x] += dp[nxt];
		}
	return;
}
void dfs1(int x, int fa)
{
	for (auto& nxt : nbr[x])
		if (nxt != fa)
		{
			f[nxt] = f[x] - 2 * ::size[nxt] + n;
			dfs1(nxt, x);
		}
	return;
}
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n;
	for (int i = 1; i < n; i++)
	{
		int x, y;
		cin >> x >> y;
		nbr[x].push_back(y);
		nbr[y].push_back(x);
	}
	dfs(1, 0, 0);
	f[1] = dp[1];
	dfs1(1, 0);
	int id = 1;
	for (int i = 2; i <= n; i++)
		if (f[i] > f[id])
			id = i;
	cout << id;
	return 0;
}
```

### 洛谷P2986
[P2986 [USACO10MAR] Great Cow Gathering G](https://www.luogu.com.cn/problem/P2986)

定义 $dp_i$ 表示以 $i$ 为根节点的子树每只奶牛去参加集会所走的路程之和。

$$dp_x=\sum^{nxt}_{nxt\in children_x}dp_{nxt}+w_{x,nxt}size_{nxt}$$

定义 $f_i$ 表示点 $i$ 为全局根节点每只奶牛去参加集会所走的路程之和。

$$f_{nxt}=f_x+w_{x,nxt}(size_1-2size_{nxt})$$

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 1e5 + 5;
int n, dp[N], a[N], f[N], size[N];
vector<pair<int, int>>nbr[N];
void dfs(int x, int fa, int sum)
{
	dp[x] = 0;
	::size[x] = a[x];
	for (auto& y : nbr[x])
	{
		auto& nxt = y.first, & w = y.second;
		if (nxt != fa)
		{
			dfs(nxt, x, sum + 1);
			::size[x] += ::size[nxt];
			dp[x] += w * ::size[nxt] + dp[nxt];
		}
	}
	return;
}
void dfs1(int x, int fa)
{
	for (auto& y : nbr[x])
	{
		auto& nxt = y.first, & w = y.second;
		if (nxt != fa)
		{
			f[nxt] = f[x] + (::size[1] - 2 * ::size[nxt]) * w;
			dfs1(nxt, x);
		}
	}
	return;
}
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n;
	for (int i = 1; i <= n; i++)
		cin >> a[i];
	for (int i = 1; i < n; i++)
	{
		int x, y, z;
		cin >> x >> y >> z;
		nbr[x].push_back({ y,z });
		nbr[y].push_back({ x,z });
	}
	dfs(1, 0, 0);
	f[1] = dp[1];
	dfs1(1, 0);
	int id = 1;
	for (int i = 2; i <= n; i++)
		if (f[i] < f[id])
			id = i;
	cout << f[id];
	return 0;
}
```

### CF1187E
[Tree Painting](https://codeforces.com/problemset/problem/1187/E)|[中文翻译](https://vjudge.net/problem/CodeForces-1187E#author=DeepSeek_zh)

定义 $dp_i$ 表示以 $i$ 为根节点的子树获得的总分数。

$$dp_x=dep_x\sum^{nxt}_{nxt\in children_x}dp_{nxt}$$

定义 $f_i$ 表示点 $i$ 为全局根节点获得的总分数。

$$f_{nxt}=f_x+n-2size_{nxt}$$

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 1e6 + 5;
int n, dp[N], f[N], size[N];
vector<int>nbr[N];
void dfs(int x, int fa, int sum)
{
	dp[x] = sum;
	::size[x] = 1;
	for (auto& nxt : nbr[x])
		if (nxt != fa)
		{
			dfs(nxt, x, sum + 1);
			::size[x] += ::size[nxt];
			dp[x] += dp[nxt];
		}
	return;
}
void dfs1(int x, int fa)
{
	for (auto& nxt : nbr[x])
		if (nxt != fa)
		{
			f[nxt] = f[x] - 2 * ::size[nxt] + n;
			dfs1(nxt, x);
		}
	return;
}
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n;
	for (int i = 1; i < n; i++)
	{
		int x, y;
		cin >> x >> y;
		nbr[x].push_back(y);
		nbr[y].push_back(x);
	}
	dfs(1, 0, 1);
	f[1] = dp[1];
	dfs1(1, 0);
	int id = 1;
	for (int i = 2; i <= n; i++)
		if (f[i] > f[id])
			id = i;
	cout << f[id];
	return 0;
}
```

### CF1324F
[Maximum White Subtree](https://codeforces.com/problemset/problem/1324/F)|[中文翻译](https://vjudge.net/problem/CodeForces-1324F#author=DeepSeek_zh)

当确定第一个染色节点 $x$ 后, 之后都只能染黑色节点的邻接点；

若 $x$ 作为根，则染色顺序一定是从上到下，且代价确定；

因此，一棵树的代价只和根节点有关，考虑换根DP。

定义 $dp_i$ 表示以 $i$ 为根节点的子树白顶点数与黑顶点数的最大差值。

$$dp_x=\sum^{nxt}_{nxt\in children_x}\max(0,dp_{nxt})$$

定义 $f_i$ 表示点 $i$ 为全局根节点白顶点数与黑顶点数的最大差值。

$$f_{nxt}=dp_{nxt}+\max(0,f_x-\max(0,dp_{nxt}))$$

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 2e5 + 5;
int n, dp[N], a[N], f[N], size[N];
vector<pair<int, int>>nbr[N];
void dfs(int x, int fa, int sum)
{
	dp[x] = ::size[x] = a[x];
	for (auto& y : nbr[x])
	{
		auto& nxt = y.first, & w = y.second;
		if (nxt != fa)
		{
			dfs(nxt, x, sum + 1);
			::size[x] += ::size[nxt];
			dp[x] += max(0ll, dp[nxt]);
		}
	}
	return;
}
void dfs1(int x, int fa)
{
	for (auto& y : nbr[x])
	{
		auto& nxt = y.first, & w = y.second;
		if (nxt != fa)
		{
			f[nxt] = dp[nxt] + max(0ll, f[x] - max(0ll, dp[nxt]));
			dfs1(nxt, x);
		}
	}
	return;
}
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n;
	for (int i = 1; i <= n; i++)
		cin >> a[i], a[i] = a[i] ? 1 : -1;
	for (int i = 1; i < n; i++)
	{
		int x, y, z = 1;
		cin >> x >> y;
		nbr[x].push_back({ y,z });
		nbr[y].push_back({ x,z });
	}
	dfs(1, 0, 0);
	f[1] = dp[1];
	dfs1(1, 0);
	for (int i = 1; i <= n; i++)
		cout << f[i] << ' ';
	return 0;
}
```

### 洛谷U224225
[U224225 Accumulation Degree](https://www.luogu.com.cn/problem/U224225)

定义 $dp_i$ 表示以 $i$ 为根节点的子树水系的流量最大值。

定义 $f_i$ 表示点 $i$ 为全局根节点水系的流量最大值。

状态转移见代码。

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 2e5 + 5;
int t, n, dp[N], f[N];
vector<pair<int, int>>nbr[N];
void dfs(int x, int fa, int sum)
{
	dp[x] = 0;
	for (auto& y : nbr[x])
	{
		auto& nxt = y.first, & w = y.second;
		if (nxt != fa)
		{
			dfs(nxt, x, sum + 1);
			if (nbr[nxt].size() == 1)
				dp[x] += w;
			else
				dp[x] += min(w, dp[nxt]);
		}
	}
	return;
}
void dfs1(int x, int fa)
{
	for (auto& y : nbr[x])
	{
		auto& nxt = y.first, & w = y.second;
		if (nxt != fa)
		{
			f[nxt] = dp[nxt] + min(w, f[x] - min(w, dp[nxt]));
			dfs1(nxt, x);
		}
	}
	return;
}
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> t;
	while (t--)
	{
		cin >> n;
		for (int i = 1; i <= n; i++)
			nbr[i].clear();
		for (int i = 1; i < n; i++)
		{
			int x, y, z;
			cin >> x >> y >> z;
			nbr[x].push_back({ y,z });
			nbr[y].push_back({ x,z });
		}
		dfs(1, 0, 0);
		f[1] = dp[1];
		dfs1(1, 0);
		int id = 1;
		for (int i = 2; i <= n; i++)
			if (f[i] > f[id])
				id = i;
		cout << f[id] << '\n';
	}
	return 0;
}
```

### 洛谷P3761
[P3761 [TJOI2017] 城市](https://www.luogu.com.cn/problem/P3761)

利用[树的直径](https://www.luogu.com.cn/article/8v2c463v)的树形DP，求树的中心，就是换根DP。

```cpp
#include<bits/stdc++.h>
typedef int int32;
#define int long long
using namespace std;
const int N = 2e5 + 5;
int n, dis1[N], dis2[N], up[N], maxi, mini, ans = INT_MAX;
vector<pair<int, int>>nbr[N];
void dfs(int x, int fa)
{
	for (auto& y : nbr[x])
	{
		auto& nxt = y.first, & w = y.second;
		if (nxt != fa)
		{
			dfs(nxt, x);
			int tmp = dis1[nxt] + w;
			if (dis1[x] < tmp)
			{
				dis2[x] = dis1[x];
				dis1[x] = tmp;
			}
			else if (dis2[x] < tmp)
				dis2[x] = tmp;
		}
	}
	int sum = dis1[x] + dis2[x];
	if (sum > maxi)
		maxi = sum;
	return;
}
void dfs1(int x, int fa)
{
	for (auto& y : nbr[x])
	{
		auto& nxt = y.first, & w = y.second;
		if (nxt != fa)
		{
			up[nxt] = up[x] + w;
			if (dis1[nxt] + w == dis1[x])
				up[nxt] = max(up[nxt], dis2[x] + w);
			else
				up[nxt] = max(up[nxt], dis1[x] + w);
			dfs1(nxt, x);
		}
	}
	int tmp = max(up[x], dis1[x]);
	if (tmp < mini)
		mini = tmp;
	return;
}
pair<int, int>work(int x, int fa)
{
	maxi = 0;
	mini = INT_MAX;
	for (int i = 1; i <= n; i++)
		dis1[i] = dis2[i] = up[i] = 0;
	dfs(x, fa);
	dfs1(x, fa);
	return { maxi,mini };
}
signed main()
{
	ios::sync_with_stdio(0);
	cin.tie(0), cout.tie(0);
	cin >> n;
	for (int i = 1; i < n; i++)
	{
		int x, y, z;
		cin >> x >> y >> z;
		nbr[x].push_back({ y,z });
		nbr[y].push_back({ x,z });
	}
	for (int i = 1; i <= n; i++)
		for (auto& y : nbr[i])
		{
			auto& nxt = y.first, & w = y.second;
			if (i < nxt)
			{
				pair<int, int>a = work(i, nxt), b = work(nxt, i);
				ans = min(ans, max({ a.first,b.first,a.second + b.second + w }));
			}
		}
	cout << ans;
	return 0;
}
```
