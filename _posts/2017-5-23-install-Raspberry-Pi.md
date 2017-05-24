---
layout: post
title:  "树莓派3安装记录"
categories: study
tags:  study
author: GZY
---

* content
{:toc}


最近入手了一个树莓派3，因为家用需要存储量和运行速度不是很高，所以计划作为家用媒体服务器以及家用共享文件服务器使用。
因为之前没有用过树莓派的系统，所以先在网上查了一下怎么弄。
在博客里稍作记录。
主要分为以下三部分：

* 树莓派micro-SD卡制作
* ngrok内网穿透
* 家用媒体服务器（minidlna）
* 家用共享文件服务器（待定）


## 树莓派micro-SD卡制作


使用软件<a href="http://sourceforge.net/projects/win32diskimager/" target="_blank">Win32DiskImager</a>进行SD卡的烧录。

树莓派系统镜像：<a href="https://www.raspberrypi.org/downloads/raspbian/" target="_blank">Raspbian</a>

lscpu 查询CPU的信息

free -h 了解内存使用状况

sudo fdisk -l SD卡的存储情况

sudo raspi-config 开启SSH


## ngrok内网穿透，参考 http://blog.csdn.net/lw_chen/article/details/53419665 http://www.vuln.cn/8634


1. sudo apt-get install build-essential golang mercurial git 安装必要的工具和语言环境

2. go version 看看是不是小于等于 1.2.1

3. git clone https://github.com/tutumcloud/ngrok.git ngrok

4. NGROK_DOMAIN="gzy.host"

openssl genrsa -out base.key 2048

openssl req -new -x509 -nodes -key base.key -days 10000 -subj "/CN=$NGROK_DOMAIN" -out base.pem

openssl genrsa -out server.key 2048

openssl req -new -key server.key -subj "/CN=$NGROK_DOMAIN" -out server.csr

openssl x509 -req -in server.csr -CA base.pem -CAkey base.key -CAcreateserial -days 10000 -out server.crt

cp base.pem assets/client/tls/ngrokroot.crt

cp server.crt assets/server/tls/snakeoil.crt

cp server.key assets/server/tls/snakeoil.key


5. sudo make release-server release-client 如果一切正常，ngrok/bin 目录下应该有 ngrok、ngrokd 两个可执行文件，ngrokd 是服务端文件，ngrok 是 Linux 的客户端

6. ./bin/ngrokd -tlsKey=server.key -tlsCrt=server.crt -domain="gzy.host" -httpAddr=":8081" -httpsAddr=":8082" 服务端启动

7. vi ngrok.cfg

server_addr: gzy.host:4443
trust_host_root_certs: false
tunnels:
    http:
        proto:
            http: 80
        subdomain: test
    ssh:
        remote_port: 110
        proto:
            tcp: 22


./ngrok -config=ngrok.cfg start http ssh 客户端启动

8. /etc/rc.local

在exit 0这句之前加入这句话：
(sleep 3; /root/ngrok/ngrok -config=/root/ngrok/ngrok.cfg start ssh) &



## 家用媒体服务器（minidlna）


dlna作为家用媒体播放协议，由来已久。此次使用minidlna实现此功能。端口号为：8200。

1. sudo apt-get install autopoint debhelper dh-autoreconf gcc libavutil-dev libavcodec-dev libavformat-dev libjpeg-dev libsqlite3-dev libexif-dev libid3tag0-dev libogg-dev libvorbis-dev libflac-dev –y

2. wget http://sourceforge.net/projects/minidlna/files/latest/download?source=files -O minidlna.tar.gz

3. tar -xvzf minidlna.tar.gz

4. cd minidlna-1.15

5. ./configure

6. sudo make

7. sudo make install

8. sudo cp minidlna.conf  /etc/

9. sudo cp linux/minidlna.init.d.script  /etc/init.d/minidlna

10. sudo chmod +x /etc/init.d/minidlna

11. sudo update-rc.d minidlna defaults

12. sudo vi /etc/minidlna.conf

13. sudo service minidlna restart

14. service minidlna status

来源：http://bbs.elecfans.com/jishu_901029_1_1.html

1. sudo apt-get update

2. sudo apt-get install minidlna

3. etc/minidlna.conf

4. /etc/init.d/minidlna restart

5. sudo update-rc.d minidlna defaults 让 minidlna 随机启动

6. sudo service minidlna force-reload 强制刷新

7. 

## 家用共享文件服务器（待定）




<script type="text/javascript">
  var urlPath = window.location.pathname;
  if(urlPath != "/"){
    //alert("This is a test");
    console.log("You are in page!");
  }
</script>