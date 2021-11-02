---
layout: post
title:  "在linux中访问samba共享目录"
categories: 学习
tags:  学习 Linux
author: GZY
---

* content
{:toc}

## 安装

sudo apt-get install smbclient





## 具体操作

* 查看列表
smbclient -L miwifi.com

* 进入文件夹
smbclient //miwifi.com/Share

* 获得文件
get/mget file

* 上传文件
put/mput file

* 获得文件夹
prompt
recurse
mget [文件夹名]