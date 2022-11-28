---
layout: personal
title: Personal
description: 私人领地
keywords: 私人, Personal
comments: false
copyright: false
menu: 私人
permalink: /personal/
---

> 记多少命令和快捷键会让脑袋爆炸呢？

{% case site.components.personal.view %}

{% when 'list' %}

<ul class="listing">
{% for personal in site.personal %}
{% if personal.title != "Personal Template" and personal.topmost == true %}
<li class="listing-item"><a href="{{ site.url }}{{ personal.url }}"><span class="top-most-flag">[置顶]</span>{{ personal.title }}</a></li>
{% endif %}
{% endfor %}
{% for personal in site.personal %}
{% if personal.title != "Personal Template" and personal.topmost != true %}
<li class="listing-item"><a href="{{ site.url }}{{ personal.url }}">{{ personal.title }}<span style="font-size:12px;color:red;font-style:italic;">{%if personal.layout == 'mindmap' %}  mindmap{% endif %}</span></a></li>
{% endif %}
{% endfor %}
</ul>

{% when 'cate' %}

{% assign item_grouped = site.personal | where_exp: 'item', 'item.title != "Personal Template"' | group_by: 'cate1' | sort: 'name' %}
{% for group in item_grouped %}
###### {{ group.name }}
{% assign cate_items = group.items | sort: 'title' %}
{% assign item2_grouped = cate_items | group_by: 'cate2' | sort: 'name' %}
{% for sub_group in item2_grouped %}
{% assign name_len = sub_group.name | size %}
{% if name_len > 0 -%}
<i>{{ sub_group.name }}: <sup>{{ sub_group.items | size }}</sup></i>
{%- endif -%}
{%- assign item_count = sub_group.items | size -%}
{%- assign item_index = 0 -%}
{%- for item in sub_group.items -%}
{%- assign item_index = item_index | plus: 1 -%}
<a href="{%- if item.type == 'link' -%}{{ item.link }}{%- else -%}{{ site.url }}{{ item.url }}{%- endif -%}" style="display:inline-block;padding:0.5em" {% if item.type == 'link' %} target="_blank" {% endif %} >{{ item.title }}<span style="font-size:12px;color:red;font-style:italic;">{%if item.layout == 'mindmap' %}  mindmap{% endif %}</span></a>{%- if item_index < item_count -%}<span> <b>·</b></span>{%- endif -%}
{%- endfor -%}
{% endfor %}
{% endfor %}

{% endcase %}
