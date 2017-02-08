function makeAPITable(sourse,node){
  var table = naiveUI.createTable(sourse,"API-table",false,[])
  node.appendChild(table)
}

var lastClickLi,lastShow

;(function initialize(){
  var firstShow = document.querySelector("#total-introduce")
  firstShow.className += "block"

  lastShow = firstShow
})()

;(function makeComponent(){
  ;(function makeShuffling(){  
    var shufflingPlacerHolderNode = document.querySelector(".shuffling-wrapper"),
      shufflingSourse = [["http://tupian.enterdesk.com/2014/mxy/02/11/4/4.jpg","mountain","mountain"],
        ["http://img0.ph.126.net/4UmN4959IkgR--p-roGYEQ==/54324670522774929.jpg","horse","horse"],
        ["http://pic.58pic.com/58pic/15/15/35/08858PICGTF_1024.jpg","sea","sea"],
        ["http://tupian.enterdesk.com/2012/1113/gha/2/shatanhb9.jpg","road","road"],
        ["http://img2.91.com/uploads/allimg/130424/32-1304241G237.jpg","flower","flowe"]
      ]

    naiveUI.createShuffling(shufflingSourse,shufflingPlacerHolderNode,"sgggg")

    var sourse = [
        ["属性名","说明","类型","默认值","是否必须"],
        ["sourse","需要进行轮播展示的图片,格式为:[[src,title,alt],[src,title,alt]]","Array","无","是"],
        ["placerHolderNode","占位元素，在占位元素内生成一个同样大小的轮播组件","HTMLElement","无","是"],
        ["style","轮播方式，有3种：fade,slip,smooth-slip","String","fade","否"],
        ["return","无","无","/","/"]
      ],
      node = document.querySelector("#compo-shuffling")
      makeAPITable(sourse,node)
  })()

  ;(function makeCalendar(){
    function handler(event){
      console.log(event.target.innerText)
    }
    var placerHolderNode = document.querySelector(".calendar-wrapper")

    naiveUI.createCalendar(placerHolderNode,handler)

    var sourse = [
      ["属性名","说明","类型","默认值","是否必须"],
      ["placerHolderNode","占位元素，在占位元素内生成一个同样大小的日历组件","HTMLElement","无","是"],
      ["handler","点击日期时的事件处理函数","function","无","否"],
      ["return","无","无","/","/"]
      ],
      node = document.getElementById("compo-calendar")

    makeAPITable(sourse,node)
  })()

  ;(function makeTable(){
    var sourse = [
        ['姓名','年龄','身高'],
        ['王二',18,182],
        ['莉娜',21,168],
        ['张三',26,203],
        ['思聪',33,174],
        ['逍遥',16,181],
        ['圆圆',20,120],
        ['小6',25,177],
        ['蓝猫',10,90],
        ['展堂',30,182]
      ]

    var table = naiveUI.createTable(sourse,"exam-table",true,[1,2]),
      node = document.querySelector("#compo-table .exam-area")

    node.appendChild(table)

    var tableAPI = [
        ["属性名","说明","类型","默认值","是否必须"],
        ['sourse','表格数据','Array','无','是'],
        ['className',"css接口,不传入和传入''(空字符串)都表示使用默认样式","String","无","无","否"],
        ['ifFirstLineFreeze','是否设置首行冻结',"Boolean","false","否"],
        ['sortRanges','需要设置排序按钮的列,不传入和传入[](空数组)都表示不排序','Array','[ ]','否'],
        ['handler','点击tbody的数据时的时间处理函数','Function','无','否'],
        ['return','返回生成的表格','HTMLElement','/','/']
      ],
      tableAPIWrapper = document.querySelector(".table-api")

    makeAPITable(tableAPI,tableAPIWrapper)
  })()

  ;(function makeSelect(){
    var today = new Date(),
      year = today.getYear() + 1900,
      mon = today.getMonth(),
      months = [],
      years = []

    for(let i = 1970; i <= year + 20; i++){
      years.push([i + "年",i])
    }

    for(let i = 1;i < 13; i++){
        months.push([i + "月",i])
    }

    var indexY = 47,
      indexM = 1,
      yearSelect = naiveUI.createSelect(years,indexY,"calendar-select"),
      monSelect = naiveUI.createSelect(months,indexM,"calendar-select"),
      node = document.querySelector("#compo-select .exam-area")

    node.appendChild(yearSelect)
    node.appendChild(monSelect)

    var sourse = [
        ["属性名","说明","类型","默认值","是否必须"],
        ["optionsValues","option的innerText和data-value的集合，例如：<br>[['篮球',1],['足球',2]]","Array","无","是"],
        ["selectedIndex","默认选中的index","Number","0","否"],
        ["className","select的css接口","String","无","否"],
        ["return","返回生成的select选择器","HTMLElement","无","/"]
      ],
      node = document.getElementById("compo-select")

    makeAPITable(sourse,node)
  })()
})()

;(function eventHandler(){
  var nav = document.querySelector(".nav")
  nav.addEventListener("click",function(event){
    if(event.target.tagName.toLowerCase() === "li" && event.target.className === "pointer"){
      var dataValue = event.target.getAttribute("data-value"),
        nodeToShow = document.getElementById(dataValue)

      if(lastShow){
        lastShow.className = "content-wrapper"
      }
      if(lastClickLi){
        lastClickLi.className = "pointer"
      }

      event.target.className +=" chosen"
      nodeToShow.className += " block"
      lastShow = nodeToShow
      lastClickLi = event.target

      if(dataValue === "compo-slideDoor" && !document.querySelector("#compo-slideDoor .slide-door-img")){
        ;(function makeSildeDoor(){
          var placerHolderNode = document.querySelector(".slideDoor-wrapper"),
            sourse = [["http://tupian.enterdesk.com/2014/mxy/02/11/4/4.jpg","mountain","mountain"],
              ["http://img0.ph.126.net/4UmN4959IkgR--p-roGYEQ==/54324670522774929.jpg","horse","horse"],
              ["http://pic.58pic.com/58pic/15/15/35/08858PICGTF_1024.jpg","sea","sea"],
              ["http://tupian.enterdesk.com/2012/1113/gha/2/shatanhb9.jpg","road","road"],
              ["http://img2.91.com/uploads/allimg/130424/32-1304241G237.jpg","flower","flowe"]
            ],
            ratio = 4/3

          naiveUI.createSlideDoor(sourse,placerHolderNode,ratio)

          var sourse = [
              ["属性名","说明","类型","默认值","是否必须"],
              ["sourse","需要进行滑动门展示的图片,格式为:[[src,title,alt],[src,title,alt]]","Array","无","是"],
              ["placerHolderNode","占位元素，在占位元素内生成一个同样大小的滑动组件","HTMLElement","无","是"],
              ["picRatio","图片长宽比","Number","无","是"],
              ["return","无","无","无"]
            ],
            node = document.querySelector("#compo-slideDoor")
            
          makeAPITable(sourse,node)
        })()
      }

      if(dataValue === "effect-waterfall" && !document.querySelector("#effect-waterfall .waterfall-flex")){
         ;(function setWaterfall(){
          var imgSourse = ["http://g.hiphotos.baidu.com/zhidao/pic/item/c75c10385343fbf2c46c7a9bb47eca8064388fc2.jpg",
            "http://f.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=d35252a18794a4c20a76ef2f3bc437e3/e4dde71190ef76c6a23548859d16fdfaae5167bc.jpg",
            "http://img2.ph.126.net/hefKdojeIrkC1StWXtQNTQ==/1025976290128129001.jpg",
            "http://b.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=4efce860ab345982c5dfed9639c41d9b/63d9f2d3572c11df70cdc337652762d0f703c282.jpg",
            "http://p5.image.hiapk.com/uploads/allimg/141215/7730-1412151GZ6.jpg",
            "http://5.66825.com/download/pic/000/329/a49fc9ced078f6aef2fc085fb8fe391a.jpg",
            "http://image3.uuu9.com/war3/dota/UploadFiles_5254/200807/08072715435217311.jpg",
            "http://v1.qzone.cc/pic/201604/18/20/35/5714d49c31a98083.jpg%21600x600.jpg",
            "http://img.pconline.com.cn/images/upload/upc/tx/wallpaper/1205/18/c5/11666275_1337332857422.jpg",
            "http://imgsrc.baidu.com/forum/pic/item/faedab64034f78f0ce24125e79310a55b3191c6b.jpg",
            "http://bcs.91.com/rbpiczy/Wallpaper/2015/1/9/d4b1ade76d3549bdbd94937201a32c0d-9.jpg",
            "http://pic.makepolo.net/news/allimg/20161220/1482205778200337.jpg"]

          var i = 0
          function createImg(sourse){
            var img = document.createElement("img")
            img.src = sourse[i++]
            img.alt = "Kobe Or James"
            if(i === 12){
              i = 0
            }
            return img
          }

          var target = document.querySelector(".waterfall")
            em = naiveUI.setWaterfall(3,target,true)

          for(let i = 0; i < 6; i ++){
            em.add(createImg(imgSourse))
          }
          naiveUI.setScrollLoad(createImg,em.add,target,[imgSourse])

          var waterfallAPI = [
              ["属性名","说明","类型","默认值","是否必须"],
              ['rangeNum','列数','Number','无','是'],
              ['targetNode','需要设置瀑布流布局的元素','HTMLElement','无','是'],
              ['isDefaultStyle','是否采用默认样式','Boolean','true','否'],
              ['return','操作接口，有两个方法：<br>add——给targetNode添加一个元素，remove：删除最近添加的节点',"Object",'/','/']
            ],
            waterfallAPIWrapper = document.querySelector(".waterfall-api"),
            scrollLoarAPI = [
              ["属性名","说明","类型","默认值","是否必须"],
              ['contentCreator','滚动时产生加载内容的函数，例如生成一张图片，返回生成的内容','Function','无','是'],
              ['contentOpeartor','操作生成内容的函数，例如把生成的图片添加到DOM:contentOpeartor(content,targetNode)','Function','无','是'],
              ['targetNode','需要设置滚动加载的元素','HTMLElement','无','是'],
              ['creatorArguments','contentCreator函数的参数数组','Array','无','否']
            ],
            scrollLoadAPIWrapper = document.querySelector(".scrollLoad-api")

          makeAPITable(waterfallAPI,waterfallAPIWrapper)
          makeAPITable(scrollLoarAPI,scrollLoadAPIWrapper)
        })()
      }

    }
  },false)
})()

;(function setEffect(){
  ;(function drag(){
    var dragPart = document.querySelector(".drag-part"),
      dragNode = document.querySelector(".node-to-drag"),
      dragWrapper = document.querySelector(".drag-area")

    var node = naiveUI.dragable(dragNode,dragPart,dragWrapper)
    node.setDrag()

    var sourse = [
        ["属性名","说明","类型","默认值","是否必须"],
        ["dragNode","被拖曳的元素","HTMLElement","无","是"],
        ["dragPart","点击元素的某一部分进行拖动","HTMLElement","dragNode","否"],
        ["dragWrapper","在dragWrapper元素范围内进行拖动,不需要是dragNode的祖先元素","HTMLElement","documentElement","否"],
        ["return","返回操作接口对象,具有两个方法：<br>setDrag——设置拖曳，clearDrag——清除拖曳效果","Object","/","/"]
      ],
      node = document.querySelector("#effect-drag .api")

    makeAPITable(sourse,node)
  })()
})()

;(function resize(){
  var nodeToResize = document.querySelector(".resize-node")

  naiveUI.resizeable(nodeToResize)

  var sourse = [
      ["属性名","说明","类型","默认值","是否必须"],
      ["element","需要设置缩放的元素","HTMLElement","无","是"],
      ["return","返回设置了缩放的元素","HTMLElement","/","/"]
    ],
    node = document.querySelector("#effect-resize .api")

  makeAPITable(sourse,node)
})()

;(function setMagnifier(){
  var img = document.querySelector(".img-to-magnify"),
    size = [115,75],
    scale = 4

  var mag = naiveUI.setImgMagnifier(img,size,scale)
  mag.setMagnifier()

  var sourse = [
      ["属性名","说明","类型","默认值","是否必须"],
      ['img','需要设置放大镜的图片',"HTMLElement",'无','是'],
      ['size','放大镜的尺寸：[width,height],width和height都是数字','Array','无','是'],
      ['scale','放大倍数','Number',"2","否"],
      ['return','操作接口，有两个方法：<br>setMagnifier——设置放大镜,clearMagnifier——清除放大镜','Object','/','/']
    ],
    node = document.querySelector("#effect-magnifier .api")

  makeAPITable(sourse,node)
})()
