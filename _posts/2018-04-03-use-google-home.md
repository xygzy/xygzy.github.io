---
layout: post
title: 在中国大陆使用Google Home
categories: 学习
tags:  学习 Device
author: GZY
---
##  购买Google Home

今年3月去日本游玩，看到ビッグカメラ有活动，购物税前满5000日元即可以半价3000日元购买一个Google Home Mini。

顿时心痒难耐，于是购入一台黑色的Google Home Mini。

因为家里已经有了一台可以翻墙的小米路由器3，本以为让Google Home直接连上小米路由器3就可以顺利翻墙，没想到却是不行。附[小米路由器3安装ss脚本](https://github.com/blademainer/miwifi-ss)





##  解决Google Home不能在大陆使用的问题

经过谷歌搜索，发现原来是因为Google Home自带有dns服务器8.8.8.8，不会默认使用路由器指派的dns服务器，而在大陆该dns服务器已经被污染，无法获取到正确的ip地址。所以必须在路由器层面上劫持这些请求。


[参考博客](https://gist.github.com/willwhui/28e8896b6e4560f1cf0d32a5acf501f3)了解到解决方法如下：

添加如下的iptables规则（192.168.28.1为路由器地址）：

iptables -t nat -A PREROUTING -s 192.168.28.1/24 -p udp --dport 53 -j DNAT --to 192.168.28.1

iptables -t nat -A PREROUTING -s 192.168.28.1/24 -p tcp --dport 53 -j DNAT --to 192.168.28.1

iptables -I PREROUTING -t nat -p udp -d 8.8.4.4 --dport 53 -j REDIRECT --to-ports 1053

iptables -I PREROUTING -t nat -p udp -d 8.8.8.8 --dport 53 -j REDIRECT --to-ports 1053

iptables -I PREROUTING -t nat -p tcp -d 8.8.4.4 --dport 53 -j REDIRECT --to-ports 1053

iptables -I PREROUTING -t nat -p tcp -d 8.8.8.8 --dport 53 -j REDIRECT --to-ports 1053

由于iptables规则重启后会丢失，所以需要放置在开机启动脚本里面。

##  仍遗留的问题

使用后发现，Google Home总是会偶尔抽风，连接不上。

怀疑是因为ss附带的gfwlist不是最新的。因此找到了[最新的gfwlist](https://cokebar.github.io/gfwlist2dnsmasq/dnsmasq_gfwlist_ipset.conf)，将其中的dns服务替换为208.67.222.222，使用特殊端口443后放入小米路由器3，并未解决问题。

不知道是哪里出了问题，此问题待解。

##  需注意的问题

+ 在小米路由器后台更改路由器设置后，可能会导致iptables失效，此时需要重新启动小米路由器方可恢复。

+ 其他待补充
