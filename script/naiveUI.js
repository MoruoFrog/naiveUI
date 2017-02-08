/**
 * A naive UI javascript library
 * 常见的交互与效果：拖曳，缩放，放大镜，滚动加载，瀑布流
 * 常见的组件：轮播，滑动门，表格(排序、首行冻结),select选择，日历
 * 配合naiveUI.css使用
 */

var naiveUI = {
/**
 * 为元素设置拖曳效果,position为fixed的请使用fixedDragable
 * @param  {HTMLElement} dragNode   
 * @param  {HTMLElement} dragPart     optional
 * @param  {HTMLElement} dragWrapper  optional，规定拖曳范围的元素，不需要是dragNode的祖先元素，默认为documentElement
 * @return {object}      {setDrag:设置拖曳,clearDrag:清除拖曳}
 */
  dragable : function dragable(dragNode,dragPart,dragWrapper){   
    'use strict'
    var initLeft, //dragNode.left
      initTop,  //dragNode.top
      initX, //鼠标点击时的pageX  
      initY, //鼠标点击时的pageY 
      maxMoveX,
      minMoveX,
      maxMoveY,
      minMoveY,
      isDragable = false,
      doc = document.documentElement

    dragPart = dragPart? dragPart : dragNode
    dragWrapper = dragWrapper? dragWrapper : doc
    dragPart.style.cursor = "pointer"
    //取得mousedown事件发生时的鼠标位置和拖曳元素位置，并计算出可拖曳的范围
    function getPosition(event){
      var wrapperWidth = dragWrapper.clientWidth,
        wrapperHeight = dragWrapper.clientHeight,
        dragNodeStyle = document.defaultView.getComputedStyle(dragNode),
        body = document.body
       
      initLeft = parseInt(dragNodeStyle.left.slice(0,-2)),
      initTop = parseInt(dragNodeStyle.top.slice(0,-2)),
      initX = event.pageX,
      initY = event.pageY

      initLeft = isNaN(initLeft)? 0 : initLeft
      initTop = isNaN(initTop)? 0 : initTop

      if(document.defaultView.getComputedStyle(dragNode).position !== "absolute"){
        dragNode.style.position = "relative"
      }

      //计算拖曳的范围
      var dragClientRect = dragNode.getBoundingClientRect(),
        wrapperClientRect = dragWrapper.getBoundingClientRect(),
        wrapperStyle = document.defaultView.getComputedStyle(dragWrapper)

      if(dragWrapper !== doc){
        minMoveX =  -(dragClientRect.left - wrapperClientRect.left -  parseInt(wrapperStyle.borderLeftWidth.slice(0,-2)))
        maxMoveX = wrapperWidth - (-minMoveX) - dragNode.offsetWidth
        minMoveY = -(dragClientRect.top - wrapperClientRect.top - parseInt(wrapperStyle.borderTopWidth.slice(0,-2)))
        maxMoveY = wrapperHeight - (-minMoveY) - dragNode.offsetHeight
      }else{
        //若无dragWrapper，则全页面拖曳
        minMoveX = -dragClientRect.left
        maxMoveX = wrapperWidth - (-minMoveX) - dragNode.offsetWidth
        minMoveY = -dragClientRect.top
        maxMoveY = wrapperHeight - (-minMoveY) - dragNode.offsetHeight
      }
    }

    //mousemove事件发生时，取得鼠标位置，减去mousedown事件发生时的位置，得到偏移量，拖曳元素的初始位置+偏移量完成拖曳
    function moveNode(event){
      var currentX = event.pageX,
        currentY = event.pageY

      var leftMove = currentX - initX,
        topMove =  + currentY - initY

      if(leftMove >= minMoveX && leftMove <= maxMoveX){
        dragNode.style.left = initLeft + leftMove + "px"
      }
      if(topMove >= minMoveY && topMove <= maxMoveY){
        dragNode.style.top = initTop + topMove + "px"
      }
    }

    var lastScrollLeft,lastScrollTop
    function scrollMove(event){
      if(lastScrollLeft === undefined){
        if(dragWrapper !== doc){
          lastScrollLeft = dragWrapper.scrollLeft
          lastScrollTop = dragWrapper.scrollTop
        }else{
          lastScrollLeft = Math.max(document.body.scrollLeft,doc.scrollLeft)
          lastScrollTop = Math.max(document.body.scrollTop,doc.scrollTop)
        }
      }

      var currentScrollLeft,
        currentScrollTop

      if(dragWrapper !== doc){
        currentScrollLeft = dragWrapper.scrollLeft
        currentScrollTop = dragWrapper.scrollTop
      }else{
        currentScrollLeft = Math.max(document.body.scrollLeft,doc.scrollLeft)
        currentScrollTop = Math.max(document.body.scrollTop,doc.scrollTop)
      }

      var style = document.defaultView.getComputedStyle(dragNode),
        left = parseInt(style.left.slice(0,-2)),
        top = parseInt(style.top.slice(0,-2)),
        leftMove = currentScrollLeft - lastScrollLeft,
        topMove = currentScrollTop - lastScrollTop

      window.removeEventListener("mousemove",moveNode,false)
      dragNode.style.left = left + leftMove + "px"
      dragNode.style.top = top + topMove + "px"
     
      lastScrollLeft = currentScrollLeft
      lastScrollTop = currentScrollTop
    }

    function beginDrag(event){
      if(dragPart.contains(event.target)){
        var className = event.target.className

        //避免缩放时拖动
        if(className.indexOf("resize-tag-element") !== -1){
          console.log(className.indexOf("resize-tag-element"))
          return
        }

        getPosition(event)
        window.addEventListener("mousemove",moveNode,false)
        if(dragWrapper === document.documentElement){
          window.addEventListener("scroll",scrollMove,false)
        }else{
          dragWrapper.addEventListener("scroll",scrollMove,false)
        }
      }     
    }

    function stopDrag(event){
      window.removeEventListener("mousemove",moveNode,false)
      window.removeEventListener("scroll",scrollMove,false)
      dragWrapper.removeEventListener("scroll",scrollMove,false)
    }

    return {
      setDrag : function(){
        if(isDragable === false){
          dragPart.addEventListener("mousedown",beginDrag,false)
          window.addEventListener("mouseup",stopDrag,false)
          isDragable = true
        }
      },

      clearDrag : function(){
        if(isDragable === true){
          dragPart.removeEventListener("mousedown",beginDrag,false)
          window.removeEventListener("mouseup",stopDrag,false)
          isDragable = false
        }
      }
    }
  },

  /**
   * fixed定位的元素的拖拽效果
   * @param  {HTMLelement} dragPart 
   * @param  {HTMLelement} dragNode 
   * @param  {Array}       dragArea  optional [[topleftX,topleftY],[bottomrightX,bottomrightY]] ex:[[200,200],[800,1000]],默认为视口
   * @return {object}      操作接口
   */
  fixedDragable : function setFixedDrag(dragNode,dragPartdragArea){   
    "use strict"
    var mouseOffsetLeft, //鼠标点击点到外边框的距离
      mouseOffsetTop,
      maxLeft,
      maxTop,
      minLeft,
      minRight,
      isDragable = false,

    dragPart = dragPart? dragPart : dragNode
      //设置可拖拽区域
      minLeft = 0,
      maxLeft = document.documentElement.clientWidth - dragNode.offsetWidth,
      minTop = 0,
      maxTop = document.documentElement.clientHeight - dragNode.offsetHeight

    dragNode.style.position = "fixed"
    if(dragArea){
      minLeft = dragArea[0][0]
      maxLeft = dragArea[1][0]
      minTop = dragArea[0][1]
      maxTop = dragArea[1][1]
    }

    function getPosition(event){
      var clientLeft = dragNode.getBoundingClientRect().left,
        clientTop = dragNode.getBoundingClientRect().top

      var initX = event.clientX,
        initY = event.clientY

      //获取鼠标点击点到外边框的距离
      mouseOffsetLeft = initX - clientLeft
      mouseOffsetTop = initY - clientTop
      event.preventDefault()
    }

    function moveNode(event){
      var currentX = event.clientX,
        currentY = event.clientY

      //鼠标点击点坐标 - 鼠标点击点到元素边框的距离 = position-left/top
      var left = currentX - mouseOffsetLeft,
        top =  currentY - mouseOffsetTop

      //消除原本magin对位置的影响
      dragNode.style.margin = 0

      if(top >= 0 && top <= maxTop){ 
        dragNode.style.top = top + "px"
      }
      if(left >= 0 && left < maxLeft ){
        dragNode.style.left = left + "px"
      }

      event.preventDefault()
    }

    function beginDrag(event){
      if(dragPart.contains(event.target)){
        getPosition(event)
        window.addEventListener("mousemove",moveNode,false)
      }     
    }

    function stopDrag(event){
      window.removeEventListener("mousemove",moveNode,false)
    }

    return {
      setDrag : function(){
        if(isDragable === false){
          dragPart.addEventListener("mousedown",beginDrag,false)
          window.addEventListener("mouseup",stopDrag,false)
          isDragable = true
        }
      },

      clearDrag : function(){
        if(isDragable === true){
          dragPart.removeEventListener("mousedown",beginDrag,false)
          window.removeEventListener("mouseup",stopDrag,false)
          isDragable = false
        }
      }
    }
  },

  /**根据数据创建表格，可以具有排序，首行冻结等功能
   * @param  {Array}   sourse
   * [                                         [
   *   [td,td,td,td,td.....],//tHead             ['姓名','年龄','身高'],
   *   [td,td,td,td,td.....],//tBody             ['王二',18,182],
   *   [td,td,td,td,td.....],                    ['张三',26,203],
   *   [td,td,td,td,td.....],                    ['思聪',13,174]
   * ]                                         ]
   * @param  {Str}      className                 optional,默认使用naiveUI.css中的样式(不包含布局相关的样式)，不传入和传入""(空字符串)都表示使用默认样式
   * @param  {Boolean}  isFirstLineFreeze         optional是否设置首行冻结，默认false
   * @param  {Array}    sortRanges                optional,需要设置排序按钮的列,不传入和传入[](空数组)都表示不排序
   * @param  {Function} handler                   optional点击<td>时的事件处理函数
   * @return {HTMLelement}                        返回生成的表格
   */
  createTable : function createTable(sourse,className,isFirstLineFreeze,sortRanges,handler){
    "ues strict"
    var rowNum = sourse.length,
      rangeNum = sourse[0].length

    var table = document.createElement("table"),
      tbody = document.createElement("tbody"),
      thead

    table.className = className? className : ''

    ;(function makeTable(){
      thead = table.createTHead()
      thead.insertRow(0)
      for(let i = 0; i < rangeNum; i++){
        let td = thead.rows[0].insertCell(i)
        td.innerHTML = sourse[0][i]
      }
      for(let i = 0; i < rowNum - 1; i++){
        tbody.insertRow(i)
        for(let j = 0; j < rangeNum; j++){
          let td = tbody.rows[i].insertCell(j)
          td.innerHTML = sourse[i + 1][j]
        }
      }

    table.appendChild(tbody)
    })()

    ;(function setFirstLineFreeze(){
      if(isFirstLineFreeze){
        var firstTr = table.rows[0],
          lastTr = tbody.rows[tbody.rows.length - 1],
          freezeTr

        freezeTr = table.insertRow(0)

        for(let i = 0; i < rangeNum; i++){
          table.rows[0].insertCell(i).innerHTML = sourse[0][i]
        }

        freezeTr.className = "freeze-first-tr"
        window.addEventListener("scroll",function(event){
          if(firstTr.getBoundingClientRect().top <= 0){
            freezeTr.style.opacity = "1"
            freezeTr.style.position = "fixed"
            freezeTr.style.top = "0"
            freezeTr.style.zIndex = "999"
            //需要左移半个边框的宽度,当边框为1的时候，各浏览器会有1px的偏差
            var borderWidth = parseInt(document.defaultView.getComputedStyle(freezeTr.firstElementChild).borderLeftWidth.slice(0,-2))
            freezeTr.style.transform = "translateX(-" + borderWidth/2 + "px"
          }else{
            freezeTr.style.zIndex = "-999"
            freezeTr.style.opacity = "0"
          }

          if(lastTr.getBoundingClientRect().top <= 0){
            freezeTr.style.zIndex = "-999"
            freezeTr.style.opacity = "0"
          }
        },false)
      }
    })()

    ;(function setSort(){
      if(sortRanges !== undefined && sortRanges.length !== 0){
        function compare(direction,rangeIndex){
          return function(value1,value2){
            if(parseInt(value1[rangeIndex]) < parseInt(value2[rangeIndex])){
              
              if(direction === "up"){
                return -1
              }else{
                return 1
              }

            }else if(parseInt(value1[rangeIndex]) > parseInt(value2[rangeIndex])){
              
              if(direction === "up"){
                return 1
              }else{
                return -1
              }

            }else{
              return 0
            }
          }
        }

        //添加排序按钮
        var firstRange = isFirstLineFreeze? 1 : 0
        for(let i = 0; i < sortRanges.length; i++){
          upArrow = document.createElement("div")
          downArrow = document.createElement("div")

          downArrow.className = "table-sort-down-arrow"
          upArrow.className = "table-sort-up-arrow"

          table.rows[firstRange].cells[sortRanges[i]].style.position = "relative"
          table.rows[firstRange].cells[sortRanges[i]].appendChild(upArrow)
          table.rows[firstRange].cells[sortRanges[i]].appendChild(downArrow)

          if(isFirstLineFreeze){
            table.rows[0].cells[sortRanges[i]].style.position = "relative"
            table.rows[0].cells[sortRanges[i]].appendChild(upArrow.cloneNode())
            table.rows[0].cells[sortRanges[i]].appendChild(downArrow.cloneNode())
          }
        }    

        table.addEventListener("click",function(event){
          if(event.target.className === "table-sort-down-arrow" || event.target.className === "table-sort-up-arrow"){
            //获取需要排序的列
            var rangeIndex = (function(){
              var nodeText = event.target.parentNode.firstChild.nodeValue
              return sourse[0].indexOf(nodeText)
            })()

            switch(event.target.className){
              case "table-sort-down-arrow" :
                sourse.sort(compare("down",rangeIndex))
                break
              case "table-sort-up-arrow" :
                sourse.sort(compare("up",rangeIndex))
                break
            }

            for(let i = 0; i < rowNum - 1; i++){
              for(let j = 0; j < rangeNum; j++){
              tbody.rows[i].cells[j].innerText = sourse[i+1][j]
              }
            }                     
          } 
        },false)
      }
    })()

    if(typeof handler === "function"){
      tbody.addEventListener("click",function(event){
        if(event.target.tagName.toLowerCase() === "td"){
          handler(event)
        }
      },false)
    }
  return table
  },

  /**
   * element若为<table>，最后返回的是一个包含此table的div,因为改变了DOM，所以如果要为一个<table>同时设置拖曳和缩放，需要先设置缩放，再设置拖曳
   * @param {HTMLelement} 
   * return {HTMLelement} 设置了resizeable后的元素
   */
  resizeable : function setResizeable(element){
    'use strict'
    var bottomResizeTagElement,
      rightResizeTagElement,
      bottomRightTagElement,
      isTable = false

    ;(function makeDOM(){
      //由于div作为table的直接子元素时会出现问题，因此需要嵌套一层div在table外面
      if(element.tagName.toLowerCase() === "table"){
        var wrapperNode = document.createElement("div")
        element.style.height = "100%"
        element.style.width = "100%"
        element.parentNode.replaceChild(wrapperNode,element)
        wrapperNode.className = "table-wrapper"
        wrapperNode.appendChild(element)
        element = wrapperNode
        isTable = true
      }

      var position = document.defaultView.getComputedStyle(element).position
      if(position !== "absolute" && position !== "relative" && position !== "fixed"){
        element.style.position = "relative"
      }

      var borderBottomWidth = parseInt(document.defaultView.getComputedStyle(element).borderBottomWidth.slice(0,-2)),
       borderRightWidth = parseInt(document.defaultView.getComputedStyle(element).borderRightWidth.slice(0,-2)),
       width = element.offsetWidth,
       height = element.offsetHeight
      
      bottomResizeTagElement = document.createElement("div"),
      rightResizeTagElement = document.createElement("div"),
      bottomRightTagElement = document.createElement("div")

      element.appendChild(bottomResizeTagElement)
      element.appendChild(rightResizeTagElement)
      element.appendChild(bottomRightTagElement)

      bottomResizeTagElement.className = "resize-tag-element"
      bottomResizeTagElement.style.width = "100%"
      bottomResizeTagElement.style.height = borderBottomWidth >= 4? borderBottomWidth : 4 + "px"
      bottomResizeTagElement.style.bottom = -borderBottomWidth + "px"
      bottomResizeTagElement.style.right = -borderRightWidth + "px"
      bottomResizeTagElement.style.cursor = "n-resize"

      rightResizeTagElement.className = "resize-tag-element"
      rightResizeTagElement.style.width = borderRightWidth >= 4? borderRightWidth : 4 + "px"
      rightResizeTagElement.style.height = "100%"
      rightResizeTagElement.style.bottom = -borderBottomWidth + "px"
      rightResizeTagElement.style.right = -borderRightWidth + "px"
      rightResizeTagElement.style.cursor = "e-resize"

      bottomRightTagElement.className = "resize-tag-element"
      bottomRightTagElement.style.width = Math.max(borderRightWidth,borderBottomWidth) >= 6? Math.max(borderBottomWidth,borderRightWidth) : 6 + "px"
      bottomRightTagElement.style.height = Math.max(borderRightWidth,borderBottomWidth) >= 6? Math.max(borderBottomWidth,borderRightWidth) : 6 + "px"
      bottomRightTagElement.style.bottom = -borderBottomWidth + "px"
      bottomRightTagElement.style.right = -borderRightWidth + "px"
      bottomRightTagElement.style.cursor = "se-resize"
    })()

    function makeResizeable(event){
      var initX = event.clientX,
        initY = event.clientY,
        changeSize, 
        width = element.offsetWidth,
        height = element.offsetHeight

      switch(event.target){
        case bottomResizeTagElement :
          changeSize = function(event){
            var currentY = event.clientY
            element.style.height = height + currentY - initY + "px"
            if(isTable){
              var table = element.firstElementChild,
                rowNum = table.rows.length
              //改变tHead的Heigh
              table.tHead.rows[0].style.height = (height + currentY - initY)/rowNum + "px"
            }
          }
          break
        case rightResizeTagElement :
          changeSize = function(event){
            var currentX = event.clientX
            element.style.width = width + currentX - initX + "px"

          }
          break
        case bottomRightTagElement :
          changeSize = function(event){
            var currentX = event.clientX,
              currentY = event.clientY
            element.style.height = height + currentY - initY + "px"
            element.style.width = width + currentX - initX + "px"
            if(isTable){
              var table = element.firstElementChild,
                rowNum = table.rows.length
              table.tHead.rows[0].style.height = (height + currentY - initY)/rowNum + "px"
            }
          }
      }

      if(changeSize){
        window.addEventListener("mousemove",changeSize,false)
        window.addEventListener("mouseup",function(event){
          window.removeEventListener("mousemove",changeSize,false)
        },false)
      }

      event.preventDefault()
    }

    element.addEventListener("mousedown",makeResizeable,false)
    return element
  },

  /**
   * 在placerHolderNode内产生一个轮播组件
   * @param {Array}  sourse               需要进行轮播的图片  [[src,title,alt],[src,title,alt]]
   * @param {[type]} placerHolderNode     在placerHolderNode中添加一个轮播组件，其position需要是absolute或者relative，当style为"slip"或"smoothSlip"时，需要overflow:hidden
   * @param {[type]} picWidth             picWidth需要和placerHolderNode的width相同
   * @param {[type]} picHeight            
   * @param {[type]} style                轮播效果，"slip":滑动轮播，"fade":淡入淡出轮播，"smoothSlip":滑动轮播，当在最后和第一张图片之间转换的时候也是平滑滑动的
   */
  createShuffling : function(sourse,placerHolderNode,style){
    "use strict"
    var PICWIDTH = placerHolderNode.clientWidth, 
        PICHEIGHT = placerHolderNode.clientHeight, 
        PICNUM = sourse.length 

    var imgWrapperNode = document.createElement("div")

    if(style === undefined){
      style = "fade"
    }
    ;(function makeDOM(){
      ;(function setPosition(){
        var position = document.defaultView.getComputedStyle(placerHolderNode).position
        if(position !== "absolute" && position !== "relative" && position !== "fixed"){
          placerHolderNode.style.position = "relative"
        }
      })()

      var imgs = []
      for(let i = 0; i < sourse.length; i++){
        let imgNode = document.createElement("img")
        imgNode.src = sourse[i][0]
        imgNode.title = sourse[i][1]
        imgNode.alt = sourse[i][2]
        imgWrapperNode.appendChild(imgNode)
        imgs.push(imgNode)
      }
      imgWrapperNode.className = "shuffling-img-wrapper"
      placerHolderNode.appendChild(imgWrapperNode)

      //缩略图
      var slideBarWrapper = imgWrapperNode.cloneNode(true),
        viewImgs = slideBarWrapper.querySelectorAll("img"),
        viewImgNum = viewImgs.length
      slideBarWrapper.className = "shuffling-slidebar"
      slideBarWrapper.style.height = 100/PICNUM + "%" //保持缩略图长宽比一致
      for(let i = 0; i　< viewImgNum; i++){
        viewImgs[i].style.width = 100/PICNUM + "%"
      }
      placerHolderNode.appendChild(slideBarWrapper)


      //进度条
      var processBarWrapper = document.createElement("div")
      processBarWrapper.className = "shuffling-processbar-wrapper"
      for(let i = 0; i < sourse.length; i++){
        let processBar = document.createElement("div")
        processBar.className = "shuffling-processbar"
        let processNode = document.createElement("div")
        processNode.className = "shuffling-processNode"
        processBar.appendChild(processNode)
        processBarWrapper.appendChild(processBar)
      }
      placerHolderNode.appendChild(processBarWrapper)

      //上一张与下一张按钮
      var lastBtn = document.createElement("div")
      lastBtn.className = "shuffling-last-arrow"
      placerHolderNode.appendChild(lastBtn)
      var nextBtn = document.createElement("div")
      nextBtn.className = "shuffling-next-arrow"
      placerHolderNode.appendChild(nextBtn)

      switch(style){
        case "slip" :
          imgWrapperNode.className += " slip-shuffling"
          placerHolderNode.style.overflow = "hidden"
          imgs.forEach(function(item,index,array){
            item.style.width = PICWIDTH + "px"
            item.style.height = PICHEIGHT + "px"
          })
          break
        case "smoothSlip" : 
          imgWrapperNode.className += " smooth-slip-shuffling"
          placerHolderNode.style.overflow = "hidden"

          var newLastImgNode = imgWrapperNode.firstElementChild.cloneNode(true)        
          var newFirstImgNode = imgWrapperNode.lastElementChild.cloneNode(true)

          imgWrapperNode.appendChild(newLastImgNode)
          imgs.push(newLastImgNode)
          imgWrapperNode.insertBefore(newFirstImgNode,imgWrapperNode.firstElementChild)
          imgs.unshift(newFirstImgNode)
          imgWrapperNode.style.left = -PICWIDTH + "px"

          imgs.forEach(function(item,index,array){
            item.style.width = PICWIDTH + "px"
            item.style.height = PICHEIGHT + "px"
          })
        default :
          imgWrapperNode.className += " fade-shuffling"
          break
      }
    })()

    ;(function beginShuffling(){
      var delay = 10000,
        transitionTime = 500, //毫秒
        currentPic = 0, //当前显示的图片的Index                                       
        lastPic,    //上一个显示的图片的index
        changePic,   //函数
        process, //显示进度条的延时对象
        selfShuffling //自动轮播的延时对象

      switch(style){
        case "slip" :
          changePic = function(){
            imgWrapperNode.style.left = currentPic * -PICWIDTH + "px"
          }
          break
        case "smoothSlip":
          //当图片拖动效果完成后，取消图片移动的transition动画效果，并立刻改变imgWrapper的位置
          changePic = function(){
            imgWrapperNode.style.left = (currentPic + 1) * -PICWIDTH + "px"

            if(currentPic === PICNUM ){
              currentPic = 0
              setTimeout(function(){
                imgWrapperNode.style.transition = "none"
                imgWrapperNode.style.left = 1 * -PICWIDTH + "px"           
              },transitionTime)
              setTimeout(function(){
                imgWrapperNode.style.transition = "all " + transitionTime/1000 + "s linear"
              },transitionTime+100)
            }else if(currentPic === -1){
              currentPic = PICNUM - 1
              setTimeout(function(){
                imgWrapperNode.style.transition = "none"
                imgWrapperNode.style.left = PICNUM * -PICWIDTH + "px"
            },transitionTime)
              setTimeout(function(){
                imgWrapperNode.style.transition = "all " + transitionTime/1000 + "s linear"
              },transitionTime+100)
            }

          }
          break
          //默认"fade"
          default:
          var imgs = Array.prototype.slice.call(imgWrapperNode.querySelectorAll("img"))
          changePic = function(){
            imgs.forEach(function(item,index,array){
              item.style.opacity = "0"
            })
            imgs[currentPic].style.opacity = "1"
          }
          break
      }
      //更新currentPic的函数
      function changeCurrent(content){
        if(content === "add"){
          currentPic += 1
        }else if(content === "del"){
          currentPic -= 1
        }else{
          currentPic = content
        }

        if(style != "smoothSlip"){
          if(currentPic === PICNUM){
              currentPic = 0
            }
          if(currentPic === -1){
            currentPic = PICNUM - 1
          }
        }

      }

      //自动轮播
      function beginSelfShuffling(){
        var leftPosition,          
          processNodes = Array.prototype.slice.call(placerHolderNode.querySelectorAll(".shuffling-processNode")),
          slideBars = Array.prototype.slice.call(placerHolderNode.querySelectorAll(".shuffling-slidebar img")), //缩略图
          currentBar, //当前进度条
          processValue,
          lastBar

        //在进度条显示当前时间进程的函数
        function beginProcess(){
          processValue = 0
          //保证同一时间只有一个进度条
          clearInterval(process)
          currentBar = processNodes[currentPic]
          //还原上一个进度条的样式
          if(lastPic != undefined){
            lastBar = processNodes[lastPic]
            lastBar.style.width = "0"
            slideBars[lastPic].style.opacity = "0.6"
          }
          process = setInterval(
            function(){
              currentBar.style.width = processValue + "%"
              processValue += 100/(delay/10)
            },10)
          slideBars[currentPic].style.opacity = "1"
          //保存当前进度条以便进入下一个进度条时还原上一个进度条的样式
          lastPic = currentPic
        }

        beginProcess()
        //每隔delay，切换下一张图片，并开始显示时间进度条
        selfShuffling = setInterval(
          function(){
            changeCurrent("add")
            changePic()
            beginProcess()
          },delay)
      }

      beginSelfShuffling()

      ;(function handleEvent(){
        var lastBtn = placerHolderNode.querySelector(".shuffling-last-arrow"),
          nextBtn = placerHolderNode.querySelector(".shuffling-next-arrow"),
          slideBars = Array.prototype.slice.call(placerHolderNode.querySelectorAll(".shuffling-slidebar img")),
          leftPosition

        function changePosition(command){
          return function(event){
            var content

            switch(command){
              case "last":
                content = "del"
                break
              case "next":
                content = "add"
                break
              default :
                content = command
            }

            changeCurrent(content)
            changePic()
            event.stopPropagation()
            //点击之后重新开始计时
            clearInterval(selfShuffling)
            beginSelfShuffling()
          }
        } 

        lastBtn.addEventListener("click",changePosition("last"),false)
        nextBtn.addEventListener("click",changePosition("next"),false)
        slideBars.forEach(
          function(item,index,array){
            item.addEventListener("click",changePosition(index),false)
        })
      })()

    })()
  },

  /**
   * 在placerHolderNode下生成一个滑动门
   * @param  {Array}       sourse            滑动门的图片  [[src,title,alt],[src,title,alt]]
   * @param  {HTMLElement} placerHolderNode  [description]
   * @param  {[Num}        picRatio          图片长宽比
   */
  createSlideDoor : function (sourse,placerHolderNode,picRatio){
    var PICHEAD, //被盖住的图片露出来的宽度
      PICNUM = sourse.length,
      PICHEIGHT = placerHolderNode.clientHeight
      PICWIDTH = PICHEIGHT * picRatio

    var imgs = []
    PICHEAD = (placerHolderNode.clientWidth - PICWIDTH)/ (PICNUM - 1)

    ;(function makeDOM(){
      var position = document.defaultView.getComputedStyle(placerHolderNode).position
      if(position !== "absolute" && position !== "absolute" && position !== "fixed"){
        placerHolderNode.style.position = "relative"
      }
      placerHolderNode.style.overflow = "hidden"
      for(let i = 0; i < PICNUM; i++){
        let img = document.createElement("img")
        img.className = "slide-door-img"
        img.src = sourse[i][0]
        img.title = sourse[i][1]
        img.alt = sourse[i][2]
        img.style.zIndex = i + 1
        img.style.left = i * PICHEAD + "px"
        placerHolderNode.appendChild(img)
        imgs.push(img)
      }
    })()

    function movePic(direction,index){
      var node = imgs[index],
        left 
      if(direction === "left"){
        left = index * PICHEAD + "px"
      }else if(direction === "right"){
        left = (index-1) * PICHEAD + PICWIDTH + "px"
      }
      node.style.left = left
    }

    function slide(event){
      var currentPic = imgs.indexOf(event.target)

      imgs.forEach(function(item,index,array){
        //mouseover元素和它左边的元素左移
        if(0 < index && index <= currentPic){
          movePic("left",index)
        //mouseover右边的元素右移
        }else if(index > currentPic){
          movePic("right",index)
        }
      })
    }

    placerHolderNode.addEventListener("mouseover",slide,false)
  },
  
  /**
   * 给一个给定的图片设置放大镜特效，当鼠标停留在图片上时，在图片右侧出现放大效果
   * @param {HTMLElement} img       需要设置放大镜的图片
   * @param {Array}       size      放大镜的尺寸：[width,height],width和height都是数字
   * @param {Num}         scale     放大倍数
   */
  setImgMagnifier : function imgMagnifier(img,size,scale){
    var magnifierNode,
      showNode,
      imgClone,
      hasMagnifier = false,
      clientPosition, //img相对于视口的位置
      imgClientLeft,
      imgClientTop

    scale = scale === undefined? 2 : scale
    function magnify(event){
      var top = event.clientY - size[1]/2,
        left = event.clientX - size[0]/2,
        minLeft = imgClientLeft,
        maxLeft = imgClientLeft + img.offsetWidth - size[0],
        minTop = imgClientTop,
        maxTop = imgClientTop + img.offsetHeight - size[1]

      //放大镜距离img左上角的位置
      var offsetLeftToImg = left - imgClientLeft,
        offsetTopToImg = top - imgClientTop

      if(left >= minLeft && left <= maxLeft){
        magnifierNode.style.left = left + "px"
        imgClone.style.left = -(offsetLeftToImg * scale) + "px"
      }
      if(top >= minTop && top <= maxTop){
        magnifierNode.style.top = top + "px"
        imgClone.style.top = -(offsetTopToImg * scale) + "px"
      }
      
      //由于magnifier是fixed定位且z-index很大，因此无法触发img的mouseleave事件
      if(event.clientX < imgClientLeft - 1 || event.clientX > (imgClientLeft + img.offsetWidth + 1) ||
        event.clientY < imgClientTop - 1 || event.clientY > (imgClientTop + img.offsetHeight + 1)){
        document.body.removeChild(magnifierNode)
        document.body.removeChild(showNode)
        window.removeEventListener("mousemove",magnify,false)
        hasMagnifier = false
      }
    }

    function createMagnifier(event){
      if(hasMagnifier === false){
        clientPosition = img.getBoundingClientRect(),
        imgClientLeft = clientPosition.left,
        imgClientTop = clientPosition.top
        magnifierNode = document.createElement("div")
        magnifierNode.className = "magnifier"

        var left = event.clientX - size[0]/2,
          top = event.clientY - size[1]/2

        if(event.clientX < imgClientLeft + size[0]/2){
          left = imgClientLeft
        }else if(event.clientX > imgClientLeft + img.offsetWidth - size[0]/2 && event.clientY < imgClientLeft + img.offsetWidth){
          left = imgClientLeft + img.offsetWidth - size[0]
        }

        if(event.clientY < imgClientTop + size[1]/2){
          top = imgClientTop
        }else if(event.clientY > imgClientTop + img.offsetHeight  - size[1]/2 && event.clientY < imgClientTop + img.offsetHeight){
          top = imgClientTop + img.offsetHeight - size[1]
        }

        magnifierNode.style.left = left + "px"
        magnifierNode.style.top = top + "px"
        magnifierNode.style.width = size[0] + "px"
        magnifierNode.style.height = size[1]  + "px"
        document.body.appendChild(magnifierNode)

        showNode = document.createElement("div")
        showNode.className = "show-magnify"
        showNode.style.left = imgClientLeft + img.offsetWidth + 40 + "px"
        showNode.style.top = imgClientTop + "px"
        showNode.style.width = size[0] * scale + "px"
        showNode.style.height = size[1] * scale + "px"

        imgClone = img.cloneNode(true)
        imgClone.style.width = img.offsetWidth * scale + "px"
        imgClone.style.height = img.offsetHeight * scale + "px"

        showNode.appendChild(imgClone)
        document.body.appendChild(showNode)

        hasMagnifier = true
        window.addEventListener("mousemove",magnify,false)
      }
    }

   return{
    setMagnifier : function(){
      img.addEventListener("mouseenter",createMagnifier,false)
    },
    clearMagnifier : function(){
      img.removeEventListener("mouseenter",createMagnifier,false)
    }
  }
  },

  /**
   * div模拟下拉选择，由naiveUI.css提供默认的样式
   * @param  {Array}          [{desc:desc,value:value},{desc:desc,value:value}] 
   * @param  {Num}            selectedIndex  默认选中的option的下标
   * @param  {Str}            className      optional,自定义样式
   * @return {HTMLElement}    selectElement
   */
  createSelect : function(optionValues,selectedIndex,className){
    'use strict'
    var select = document.createElement("div"), //整个select元素
      options = document.createElement("div"),  //所有option的父元素和wrapper
      selectedNode = document.createElement("div"), //被选中的值的展示元素 
      arrow = document.createElement("div"), //下拉箭头
      isFold = true //下拉框是否展开

    selectedIndex = selectedIndex === undefined? 0 : selectedIndex

    function foldAndUnfold(event){
      if(event.target !== options){
        if(isFold){       
          options.style.display = "block"
          arrow.className = "select-up-arrow"
          isFold = false
          if(options.scrollHeight !== options.clientHeight){
            var height = selectedNode.offsetHeight
            options.scrollTop = height * selectedIndex
          }
        }else{
          options.style.display = "none"
          arrow.className = "select-down-arrow"
          isFold = true
        }
      }

      event.preventDefault()
    }

    //点击select以外的区域，收起select
    function fold(event){
      if(!select.contains(event.target)){
        if(!isFold){
          foldAndUnfold(event)
        }
      }
    }

    function changeSelectValue(event){
      if(event.target.className === "option"){
        var valueSelected = event.target.getAttribute("data-value"),
          textSelected =event.target.innerText

        selectedNode.firstChild.nodeValue = textSelected
        selectedNode.setAttribute("data-value",valueSelected)
        select.setAttribute("data-value",valueSelected)
        selectedIndex = optionValues.indexOf(valueSelected)

        event.preventDefault()
      }
    }

    ;(function makeDOM(){
      if(className){
        select.className = className + " select"
      }else{
        select.className = "select"
      }

      var initText = optionValues[selectedIndex][0],
        initValue = optionValues[selectedIndex][1]

      selectedNode.className = "selected-value"
      selectedNode.innerText = initText
      selectedNode.setAttribute("data-value",initValue)
      select.appendChild(selectedNode)
      select.setAttribute("data-value",initValue)

      arrow.className = "select-down-arrow"
      selectedNode.appendChild(arrow)

      var optionsNum = optionValues.length,
        doc = document
      for(let i = 0; i < optionsNum; i++){
        let option = doc.createElement("div")
        option.className = "option"
        option.innerHTML = optionValues[i][0]
        option.setAttribute("data-value",optionValues[i][1])
        options.appendChild(option)
      }
      options.className = "options"
      select.appendChild(options)
    })()

    select.addEventListener("mousedown",foldAndUnfold,false)
    options.addEventListener("mousedown",changeSelectValue,false)
    window.addEventListener("click",fold,false)

    return select
  },
  /**
   * 多列布局的添加滚动加载效果
   * @param  {Function}     contentCreator    滚动时产生加载内容的函数，例如生成一张图片，返回生成的内容
   * @param  {Function}     contentOpeartor   操作生成内容的函数，例如把生成的图片添加到DOM:contentOpeartor(content,targetNode)
   * @param  {HTMLElement}  targetNode        需要添加滚动加载效果的元素
   * @param  {Array}        creatorArguments  optional,contentCreator的参数,等于contentCreator的Arguments                         
   */
  setScrollLoad : function scrollLoad(contentCreator,contentOpeartor,targetNode,creatorArguments){
    var bottomDOM

    function setBottomDOM(){
      var childCount = targetNode.childElementCount
      var maxHeightRange = targetNode.firstElementChild
      for(let i = 0; i < childCount; i++){
        if(maxHeightRange.scrollHeight < targetNode.children[i].scrollHeight){
          maxHeightRange = targetNode.children[i]
        }
      }

      //不考虑每一列之中也存在多列的情况
      bottomDOM = maxHeightRange.lastElementChild
      if(maxHeightRange.childNodes.length === 0){
        bottomDOM = maxHeightRange
      }
    }

    setBottomDOM()
    targetNode.addEventListener("mousewheel",function(event){
      if(bottomDOM.getBoundingClientRect().bottom <= targetNode.getBoundingClientRect().bottom + 10){
        var content = contentCreator.apply(contentCreator,creatorArguments)
        contentOpeartor(content,targetNode)    
      }
    },false)

    targetNode.addEventListener("DOMMouseScroll",function(event){
      if(bottomDOM.getBoundingClientRect().bottom <= targetNode.getBoundingClientRect().bottom + 10){
        var content = contentCreator.apply(contentCreator,creatorArguments)
        contentOpeartor(content,targetNode)    
      }
    },false)

    targetNode.addEventListener("DOMNodeInserted",function(enent){
      //模拟DOMNodeInsertedIntoDocument
      setTimeout(setBottomDOM,10)
    },false)
  },
  /**
   * 为一个元素实现瀑布流布局,需要在targetNode的css里设置width和height；默认样式使用flex布局，各列等宽等间距
   * @param  {Num}          rangeNum       
   * @param  {HTMLElement}  targetNode     
   * @param  {Boolean}      isDefaultStyle  optional，是否采用默认样式
   * @return {Object}       {add:添加节点，remove:删除最新添加的节点}
   */
  setWaterfall : function waterfall(rangeNum,targetNode,isDefaultStyle){
    var ranges = [],
      minHeightRange,
      maxHeightRange

    for(let i = 0; i < rangeNum; i++){
      let range = document.createElement("div")
      targetNode.appendChild(range)
      ranges.push(range)    
    }

    if(isDefaultStyle === undefined || isDefaultStyle){
      targetNode.className += " waterfall-flex"
    }
    
    function add(content){
      minHeightRange = ranges[0]

      for(var i = 0; i < rangeNum; i++){
        if(minHeightRange.scrollHeight > ranges[i].scrollHeight){
          minHeightRange = ranges[i]
        }
      }
      minHeightRange.appendChild(content)
    }

    function remove(){
      maxHeightRange = ranges[rangeNum - 1]

      for(i = rangeNum - 1; i >= 0; i--){
        if(maxHeightRange.scrollHeight < ranges[i].scrollHeight){
          maxHeightRange = ranges[i]
        }
      }

      maxHeightRange.removeChild(maxHeightRange.lastElementChild)
    }

    return {
      add : add,
      remove : remove
    }
  },

  /**
   * 在placerHolderNode内生成一个日历
   * @param  {HTMLelement}      placerHolderNode [description]
   * @param  {Fun} handler      点击日期时触发的事件处理函数
   */
  createCalendar : function (placerHolderNode,handler){
    'use strict'
    var sourse = [], // 最终是7 * 7 的数组，表示一个月每一天的星期数
      calendar = document.createElement("div"),
      mon, //当前选择的月份
      year, //当前选择的年份
      day, //选择月份1号的星期数，
      dayNum //当月天数

    calendar.className = "calendar"

    //根据月份和年份得到当月的日历数据
    function setSourse(month,year){
      var date = new Date(Date.UTC(year,month,1))
      
      dayNum = 30
      day = date.getDay(), //取得1号的星期数
      sourse = []

      ;(function createThisMonth(){
        month += 1
        if(month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12){
          dayNum = 31
        }else if(month === 2){
          if(year%4 === 0){
            dayNum = 29
          }else{
            dayNum = 28
          }
        }

        //如果这个月第一天是星期天，则从日历第二行开始显示
        if(day === 0){
          day = 7
        }

        for(var i = day, j = 1; j <= dayNum; i++, j++){
          sourse[i] = j
        }
      })()

      ;(function addLastMonth(){
        var lastMonth = month - 1,
          lastMonthDayNum = 30

        if(lastMonth === 1 || lastMonth === 3 || lastMonth === 5 || lastMonth === 7 || lastMonth === 8 || lastMonth === 10 || lastMonth === 0){
          lastMonthDayNum = 31
        }else if(month === 2){
          if(year%4 === 0){
            lastMonthDayNum = 29
          }else{
            lastMonthDayNum = 28
          }
        }

        for(var i = day - 1, j = lastMonthDayNum; i >= 0; i--, j--){
          sourse[i] = j
        }
      })()

      ;(function addNextMonth(){
        for(var i = day + dayNum,j = 1 ; i < 42; i++,j++){
          sourse[i] = j
        }
      })()

      //把sourse格式化
      ;(function initializeSourse(){
        var temp = sourse,
          index = 0

        sourse = []

        for(var i = 0; i < 6; i++){
          sourse.push([])
          for(var j = 0; j < 7; j++){
            sourse[i].push(temp[index++])
          }
        }

        sourse.unshift(["日","一","二","三","四","五","六"])
        temp = null
      })()
    }

    var operationBar,
      monthSelect,
      yearSelect,
      nextMonBtn,
      lastMonBtn,
      calendarTable,
      tbody
    ;(function makeDOM(){
      var today = new Date(),
        months = [],
        years = [],
        indexYear,
        indexMon

      year = today.getYear() + 1900
      mon = today.getMonth()

      for(let i = 1970; i <= year + 20; i++){
        years.push([i + "年",i])
      }

      for(let i = 1;i < 13; i++){
          months.push([i + "月",i])
      }

      years.forEach(function(item,index,array){
        if(item[1] === year){
          indexYear = index
        }
      })

      months.forEach(function(item,index,array){
        if(item[1] === mon + 1){
          indexMon = index
        }
      })

      operationBar = document.createElement("div")
      operationBar.className = "calendar-operator"
      yearSelect = naiveUI.createSelect(years,indexYear,"calendar-select")
      monthSelect = naiveUI.createSelect(months,indexMon,"calendar-select")
      nextMonBtn = document.createElement("div")
      nextMonBtn.className = "calendar-next-arrow"
      lastMonBtn = document.createElement("div")
      lastMonBtn.className = "calendar-last-arrow" 
      operationBar.appendChild(nextMonBtn)
      operationBar.appendChild(lastMonBtn)
      operationBar.appendChild(yearSelect)
      operationBar.appendChild(monthSelect)

      //以当前日期初始化日历
      setSourse(mon,year)
      calendarTable = naiveUI.createTable(sourse,"calendar-table",false,[],handler)
      tbody = calendarTable.querySelector("tbody")
      changeStyle()

      placerHolderNode.appendChild(operationBar)
      placerHolderNode.appendChild(calendarTable)
    })()

    function changeDate(event){
      if(event.target === lastMonBtn){
        if(mon-- === -1){
          mon = 11
          year--
        }
      }else if(event.target === nextMonBtn){
        if(mon++ === 12){
          mon = 0
          year++
        }
      }

      if(monthSelect.contains(event.target)){       
        mon = parseInt(monthSelect.getAttribute("data-value")) - 1
      }else if(yearSelect.contains(event.target)){
        year = parseInt(yearSelect.getAttribute("data-value"))
      }
      
      monthSelect.querySelector(".selected-value").firstChild.nodeValue = mon + 1 + "月"
      yearSelect.querySelector(".selected-value").firstChild.nodeValue  = year + "年"
      setSourse(mon,year)
    }

    function updateCalendar(){
      for(var i = 0; i < 6; i++){
        for(var j = 0; j < 7; j++){
          tbody.rows[i].cells[j].innerText = sourse[i+1][j]
        }
      }
    }

    operationBar.addEventListener("mousedown",function(event){
      changeDate(event)
      updateCalendar()
      changeStyle()
    })

    //给上个月和下个月的日期改变样式
    function changeStyle(){
      var lastAndThisMonthDay = day + dayNum,
        count = 0
      for(var i = 0; i < 6; i++){
        for(var j = 0; j < 7 ;j ++){
          if(i === 0 && j < day){
            tbody.rows[i].cells[j].className = "lastMonth"
          }else if(count >= lastAndThisMonthDay){
            tbody.rows[i].cells[j].className = "nextMonth"
          }else{
            tbody.rows[i].cells[j].className = "thisMonth"
          }
          count++
        }
      }
    }

    var lastChosen,lastClass
    //取消浏览器的按住鼠标拖动选中文本的默认行为，使用mousedown事件代替click
    tbody.addEventListener("mousedown",function(event){
      if(lastChosen){
        lastChosen.className = lastClass
        lastClass = event.target.className
      }

      event.target.className = "date-chosen"
      lastChosen = event.target
      event.preventDefault()
    },false)

  }

}