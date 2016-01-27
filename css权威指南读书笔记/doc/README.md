#CSS权威指南阅读笔记
##选择器：

###属性选择器：
e.g：
1. 要选择有class属性（值不限制）的h1，
h1[class]{background}

###奇葩选择器

div[foo^="bar"]{}//foo属性值 以bar开始
div[foo$="bar"]{} //foo属性值 以bar结尾
div[foo*="bar"]{}//foo属性值含有bar的子串


###后代选择器
.parents .children
###子代选择器
h1>strong{
color:red;
}
###相邻兄弟元素

h1 + p{
margin-top:12px;
}

第一个元素//不是p的子元素的第一个 而是p元素的第一个
p:first-child{
font-size:bold;
}
##伪类选择器
###第一个字母
	h2:first-letter{
		color:skyblue;
	}
###第一行文本
	p:first-line{
		color: #dedede;
	}