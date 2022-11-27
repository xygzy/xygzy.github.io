---
layout: post
title:  "在centos中搭建ss所需的防火墙设置"
categories: 学习
tags:  学习 SS
author: GZY
---

* content
{:toc}

## 关于

当为SS更换端口时，需要在 firewall-cmd 里打开该端口才可以使用





## 命令行

* 查看所有打开的端口
firewall-cmd --zone=public --list-ports

* 添加
firewall-cmd --zone=public --add-port=80/tcp --permanent   （--permanent永久生效，没有此参数重启后失效）

* 重新载入
firewall-cmd --reload

* 查看
firewall-cmd --zone=public --query-port=80/tcp

* 删除
firewall-cmd --zone=public --remove-port=80/tcp --permanent