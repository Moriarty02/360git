##box-shadow兼容性 IE9+


##One side boxshadow

    box-shadow:0px      5px      4px  -4px   black      ;
    box-shadow:h-shadow v-shadow blur spread color inset;
####所谓的单侧阴影主要是利用单方向的偏移，blur的参数会导致实际的shadow大概是8px，然后spread 尺寸回收一半 这样就导致其他边上没有阴影，而偏移的5-4=1 所以会有一个单侧的阴影出现
##相邻的阴影
    box-shadow: 3px 3px 6px -3px black;
####主要还是通过平移 水平和垂直方向平移3px 然后 模糊半径6 缩小3

##对称的阴影：
    box-shadow: 5px 0 5px -5px black,-5px 0 5px -5px black;