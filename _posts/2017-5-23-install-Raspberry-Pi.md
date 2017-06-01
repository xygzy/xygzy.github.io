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
主要分为以下四个部分：

* 树莓派micro-SD卡制作
* ngrok内网穿透
* 家用媒体服务器（minidlna）
* 家用共享文件服务器


## 树莓派micro-SD卡制作


使用软件<a href="http://sourceforge.net/projects/win32diskimager/" target="_blank">Win32DiskImager</a>进行SD卡的烧录。

树莓派系统镜像：<a href="https://www.raspberrypi.org/downloads/raspbian/" target="_blank">Raspbian</a>

lscpu 查询CPU的信息

free -h 了解内存使用状况

sudo fdisk -l SD卡的存储情况

sudo raspi-config 选择1扩展存储空间，开启SSH


## ngrok内网穿透


参考 http://blog.csdn.net/lw_chen/article/details/53419665 http://www.vuln.cn/8634

服务器端计划用腾讯云服务器，虽然带宽比较小，但对于家用来说，已经完全足够了。

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

    树莓派为linux-arm架构，重新声明go env里的变量 export GOOS=linux export GOARCH=arm

    sudo make release-client

6. ./bin/ngrokd -tlsKey=server.key -tlsCrt=server.crt -domain="gzy.host" -httpAddr=":8081" -httpsAddr=":8082" 服务端启动

7. vi ngrok.cfg

    ```html
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
    ```

    ./ngrok -config=ngrok.cfg start http ssh 客户端启动

8. /etc/rc.local 开机自动启动（待定）

    在exit 0这句之前加入这句话：
    (sleep 3; /root/ngrok/ngrok -config=/root/ngrok/ngrok.cfg start ssh) &


## 家用媒体服务器（minidlna）


dlna作为家用媒体播放协议，由来已久。此次使用minidlna实现此功能。端口号为：8200。

来源：http://bbs.elecfans.com/jishu_901029_1_1.html

1. sudo apt-get update

2. sudo apt-get install minidlna

3. etc/minidlna.conf

4. /etc/init.d/minidlna restart

5. sudo update-rc.d minidlna defaults 让 minidlna 随机启动

6. sudo service minidlna force-reload 强制刷新


## 家用共享文件服务器


家用的主要目的无非是两个，一是作为文件中转站使用，二是为dlna上传合适的资源来播放。

对于较大的文件共享，计划使用Samba

改变文件夹里所有文件权限 chmod -R 777 fold

sudo apt-get install samba samba-common-bin 安装samba

vim /etc/samba/smb.conf 将 security=user 改为 security=share ，同时在文件结尾添加如下行（实际与以下内容稍有不同）：
```python
[share]
comment=this is Linux share directory
path=/home/myth/share
public=yes
writable=yes
```

sudo /etc/init.d/samba restart 重启samba


对于较小的文件共享，计划用python搭建一个简单的服务器来实现文件的上传。

python -m SimpleHTTPServer 8080 简单的python服务器，可作为文件共享使用，无法处理post请求。

python -m CGIHTTPServer 8080 简单的python服务器，可作为文件共享使用，可以处理post请求。

D:\upload.html
```html
<!DOCTYPE HTML>
<html>
	<head>
		<title>
			ファイルのアップロード
		</title>
	</head>
	<body>
	<div style="text-align:center;color:#B7B7B7;">
			<p>
			家族用のファイル共有
			</p>
			<p>
				<form action="/cgi-bin/form.py" method="post" enctype="multipart/form-data">
					<label for="uploadfile">アップロード</label>&nbsp;<input type="file" name="uploadfile" id="uploadfile" /><br /><br />
					<input type="submit" name="submit" value="確認" />
				</form>
			</p>
		</div>
	</body>
</html>
```

D:\cgi-bin\form.py
```python
# -*- coding: utf-8 -*-
import os
import shutil
import cgi

def fbuffer(f, chunk_size=10000):
   while True:
      chunk = f.read(chunk_size)
      if not chunk: break
      yield chunk

# 接受表单提交的数据 
form = cgi.FieldStorage() 

# 提取这个文件
myfile = form["uploadfile"]

#判断是否是文件
if myfile.filename:
	# 上传小文件
    # open(os.path.join(os.getcwd(), myfile.filename), 'wb').write(myfile.file.read())
    
    # 上传大文件
    f = open(os.path.join(os.getcwd(), myfile.filename), 'wb', 10000)
    # Read the file in chunks
    for chunk in fbuffer(myfile.file):
        f.write(chunk)
    f.close()

print 'Content-Type: text/html\n\n' 
print '<script> window.location="../../";</script> '
```

<script type="text/javascript">
  var urlPath = window.location.pathname;
  if(urlPath != "/"){
    console.log("感谢您访问本网站，期待您的下次访问!");
  }
</script>