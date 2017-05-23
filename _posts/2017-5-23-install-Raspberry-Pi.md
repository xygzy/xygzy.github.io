---
layout: post
title:  "树莓派3安装记录"
categories: study
tags:  study
author: GZY
---

* content
{:toc}
<script type="text/javascript">
  var urlPath = window.location.pathname;
  if(urlPath != "/"){
    //alert("This is a test");
    console.log("You are in page!");
  }
</script>

最近入手了一个树莓派3，计划作为家用媒体服务器以及家用共享文件服务器使用。
因为之前没有用过树莓派的系统，所以先在网上查了一下怎么弄。
在博客里稍作记录。

## 家用媒体服务器（minidlna）

dlna作为家用媒体播放协议，由来已久。此次使用minidlna实现此功能。

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

* One
* Two
* Three