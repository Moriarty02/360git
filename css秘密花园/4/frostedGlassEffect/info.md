##frosttedGlassEffect
###毛玻璃效果
####这个其实算是一种实现的hack，本身浏览器的差异对filter的支持都不是很好
###主要的几点：
- 背景图片固定（background:fixed）
- 因为opacity的继承性质，所以使用伪元素代替实现
- 伪元素铺满整个父元素
- 
    .main:before {

        content: "";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        -webkit-filter:blur(20px);
	
        margin: -30px;
    }

- filter有兼容：
- `.blur {	
    filter: url(blur.svg#blur); 
    -webkit-filter: blur(10px); 
       -moz-filter: blur(10px);
        -ms-filter: blur(10px);    
            filter: blur(10px);  
    filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false); }`
   
- 最后blur会向外延伸一点点，导致玻璃的周围是模糊的，这里可以使用margin回收进来，比如blur（20px）就是 margin：-30px,-20就可以了，但是取30是为了效果更好
