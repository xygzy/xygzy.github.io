---
layout: post
title:  "关于移动宽带ip更换规律"
categories: 学习
tags:  学习
author: GZY
---

* content
{:toc}

## 前言

最近家里换了移动宽带，由于需要给云服务器设置ip访问白名单，所以研究了最近一个月的公网ip变化规律，发现了一点小规律。





## 变化过程

* 9月27日晚上21:59:33由 *.*.225.60 变为 *.*.226.147

* 10月7日晚上21:59:55由 *.*.226.147 变为 *.*.225.1

* 10月17日晚上22:00:13由 *.*.225.1 变为 *.*.226.153

## 分析结果

大概每10天更换一次公网ip，每次更换ip在晚上10点左右进行。更换ip在 *.*.225.0 网段 与 *.*.226.0 网段交替进行。

因此，ip白名单可设置为：*.*.224.0/19