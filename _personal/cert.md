---
layout: personal
title: 浏览器证书配置
cate1: 环境
cate2: 
description: 日常使用
keywords: 汇总, 证书, 环境
---

## 前置条件

* cacert.pem
* pisdev.p12
* 浏览器（以谷歌浏览器为例）

## 配置

1. 在浏览器的设置找到”设置>隐私设置和安全性>安全>管理设备证书“

![cert1](/images/personal/cert1.png)

将cacert.pem按照图示位置导入浏览器

2. 双击pisdev.p12进行安装。密码同文件名。

![cert2](/images/personal/cert2.png)

3. 打开浏览器输入地址 https://ip/ms/ 进行访问

