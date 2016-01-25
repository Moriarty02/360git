这次主要看的是结合padding和margin的实现图片的占位

##主要要解决的问题就是，当图片没有加载出来的时候，位置塌陷，然后当图片加载出来的时候会出现闪一下的问题，即使在图片加载很快的时候也会出现这个问题。
##解决方案
##① 
###利用padding实现图片的占位。
##HTML:
    <div class="placeholder">
        <img src="http://p7.qhimg.com/d/inn/a0a7ed08/1226img/presents.jpg">
    </div>
##CSS:
	.placeholder {
        position: relative;
        width: 50%;
        background-color: red;
        padding-top: 50%;
    }
    
    img {
        position: absolute;
        top: 0;
        width: 100%;
    }

####原理其实很简单，就是利用一个道理：子元素的padding margin width 等参数为百分数的时候，是根据父元素的width来计算的，那么针对这种方形的格子布局方式，就可以用这种方式，padding-top取50%，实际就是width（也是50%，然后图片定位在位置上层，宽度取100%。既铺满了
###这种方式很适合做助手APP里面的占位方式，因为是方的，但是有个缺点就是由于使用的padding，所以导致无法使用max-height，因为本身的height为0，代码参看index.html

##② 使用伪元素实现占位。
####其实这个主要是避免了第一种方式没办法处理max-height的问题。
####实现就是通过对容器添加after伪元素，利用margin-top撑起来，然后图片元素依然是通过定位的方式。具体参考index2.html
##HTML：
    <div class="imgcon">
        <img src="http://p7.qhimg.com/d/inn/a0a7ed08/1226img/presents.jpg">
    </div>
##CSS:
    .imgcon {
        position: relative;
        width: 50%;
        background-color: tomato;
        overflow: hidden;
    }
    
    .imgcon:after {
        content: "";
        display: block;
        margin-top: 100%;
    }
    
    img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }


##③ 百分比padding 实现大图的加载优化
###经常遇到的一个问题是，移动端有个很大很大的背景图，好几百K，这对移动端还是很吃力的，这个时候就可以考虑这种方式：

###将图片切成三块（or more）
###然后通过图片容器之前的长宽百分比padding实现图片的占位
###由于浏览器加载资源是并行加载的，所以一次加载一张大图和并行加载三张小图，后者更优，尽管三张小图HTTP加载量比一张要大（因为每一次请求要带上很多控制信息放在http头里面），但依然是更优的选择。
###这是原图：
![origin](http://p2.qhimg.com/d/inn/3a512bfb/1245091.jpg)

### 切割之后的图：
###part1:
![](http://p8.qhimg.com/d/inn/3bd26326/img1.jpg)
###part2
![](http://p9.qhimg.com/d/inn/c8a6e4c1/img2.jpg)
###part13
![](http://p9.qhimg.com/d/inn/0ea7cbb7/img3.jpg)


##HTML:
    <div class="wrap">
        <div class="imgcon con1"><img src="img1.jpg"></div>
        <div class="imgcon con2"><img src="img2.jpg"></div>
        <div class="imgcon con3"><img src="img3.jpg"></div>
    </div>
##CSS:
    .wrap {
        position: relative;
    }
    
    .imgcon {
        position: relative;
        width: 100%;
        height: 0;
        background-color: skyblue;
        overflow: hidden;
    }
    
    .con1 {
        padding-bottom: 22.65%;
    }
     .con2{
     	padding-bottom: 15.36%;
     }
     .con3{
     	padding-bottom: 18.22%;
     }
    img {
        width: 100%;
    }

###每一个的padding的百分比是通过切出来的图片长宽比来计算出来的，这样即使中间有图没有加载好，也不会影响整体的布局。具体参考result.html