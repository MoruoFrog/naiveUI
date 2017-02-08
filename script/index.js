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
      shufflingSourse = [
        ["images/Tulips.jpg","tulip","tulip"],
        ["images/Desert.jpg","desert","desert"],
        ["images/Hydrangeas.jpg","hydrangea","hydrangea"],
        ["images/Jellyfish.jpg","jellyfish","jellyfish"],
        ["images/Koala.jpg","koala","koala"],
        ["images/Kobe6.jpg","Kobe","kobe"]
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

      if(dataValue === "compo-slideDoor"){
        ;(function makeSildeDoor(){
          var placerHolderNode = document.querySelector(".slideDoor-wrapper"),
            sourse = [["images/Tulips.jpg","tulip","tulip"],
              ["images/Desert.jpg","desert","desert"],
              ["images/Hydrangeas.jpg","hydrangea","hydrangea"],
              ["images/Jellyfish.jpg","jellyfish","jellyfish"],
              ["images/Koala.jpg","koala","koala"]
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

      if(dataValue === "effect-waterfall"){
         ;(function setWaterfall(){
          var imgSourse = ["images/1.jpg","images/2.jpg","images/3.jpg","images/4.jpg","images/5.jpg","images/6.jpeg","images/7.jpg","images/8.jpg","images/9.jpg","images/10.jpg","images/11.jpg","images/12.jpg"]

          var i = 0
          function createImg(sourse){
            var img = document.createElement("img")
            img.src = sourse[i++]
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
