---
layout: post
title:  "迁移redis"
categories: 学习
tags:  学习 Linux
author: GZY
---

* content
{:toc}

## 概要

当需要从服务器A复制redis到服务器B时，其中服务器A的地址为192.168.1.1。





## 具体操作

* 配置redis密码（修改redis.conf）
requirepass "pass"

* 进入redis命令行
redis-cli 

* 输入密码
auth pass

* 查看路径
CONFIG GET dir

* 输入复制元的密码（修改redis.conf）
 masterauth "pass"

* 将待复制的服务器设置为从属服务器
slaveof 192.168.1.1 6379

* 输入info命令，等待master_link_status变为up

* 断开主从关系
slaveof no one

* 完成