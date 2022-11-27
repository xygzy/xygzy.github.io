---
layout: post
title: 使用国内服务器作为跳板访问ss
categories: 学习
tags:  学习 SS
author: GZY
---
##  为什么要用跳板服务器

之前使用vultr搭建的ss服务器，直连一直很稳定。但发现在今年两会期间开始开始间歇性的无法ping通。

谷歌后发现应该是ip被干扰。但对于已经习惯墙外生活的我来说实在是不习惯。

于是寻找解决方法，正好自己有闲置的腾讯云上海节点的服务器，看到别人用跳板服务器的方法解决此问题，因此，我也照葫芦画瓢。

把我的国内服务器当成了跳板服务器。





## 如何当成跳板

只需添加如下iptables规则即可：

iptables -t nat -A PREROUTING -p tcp --dport 8888 -j DNAT --to-destination 8.8.8.8:8888

iptables -t nat -A POSTROUTING -p tcp -d 8.8.8.8 --dport 8888 -j SNAT --to-source 192.168.1.1

iptables -t nat -A PREROUTING -p udp --dport 8888 -j DNAT --to-destination 8.8.8.8:8888

iptables -t nat -A POSTROUTING -p udp -d 8.8.8.8 --dport 8888 -j SNAT --to-source 192.168.1.1

需注意的问题：

+ 8888为需要中转的端口号

+ 8.8.8.8为墙外ss服务器地址

+ 192.168.1.1为云服务器内网地址。如果写成外网地址，会导致中转失败。

## 将iptables规则设置为自启动方法

+ 写入开机启动脚本rc.local

+ 写入/etc/iptables/rules.v4

## 如果上述方法不成功

注意检查iptables时候允许包转发，检查 /etc/sysctl.conf 的 ipv4.ip_forward 是否为1。

## 如果需要在本机访问时也进行端口转发

外网访问需要经过PREROUTING链，但是localhost不经过该链。

遇到该问题是因为在一台内网机器内需要做端口转发，该内网机器使用了frp来进行内网穿透。直接使用iptables规则+frp时，发现问题，了解到所设置的iptables对localhost的端口并不适用。

最终发现，可以在frp内直接使用转发功能，且穿透其实就是某种程度的转发。具体配置如下：

[name]

type = tcp

local_ip = 需转发地址

local_port = 8888

remote_port = 8888

use_encryption = true

use_compression = true

