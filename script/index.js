//jsonp回调函数
function makeContent(data){
  document.querySelector(".display-wrapper").innerHTML = data.content
}

var lastClickLi
;(function eventHandler(){
  var nav = document.querySelector(".nav"),
    contentWrapper = document.querySelector(".display-wrapper")

  nav.addEventListener("click",function(event){
    if(event.target.tagName.toLowerCase() === "li" && event.target.className === "pointer"){
      id = event.target.getAttribute("data-value")
      if(lastClickLi){
        lastClickLi.className = "pointer"
      }

      event.target.className +=" chosen"
      lastClickLi = event.target

      //获取json
      var jsonsp = document.createElement("script")
      jsonsp.type = "text/javascript"
      jsonsp.src = "contentPages/" + id + ".json"
      document.body.appendChild(jsonsp)
      document.body.removeChild(jsonsp)

      switch (id){
        case "compo-calendar" :
          setTimeout(makeCalendar,5)
          break
        case "compo-table" :
          setTimeout(makeTable,5)
          break
        case "compo-shuffling" :
          setTimeout(makeShuffling,5)
          break
        case "compo-slideDoor" :
          setTimeout(makeSildeDoor,5)
          break
        case "compo-select" :
          setTimeout(makeSelect,5)
          break
        case "effect-drag" :
          setTimeout(setDrag,5)
          break
        case "effect-resize" :
          setTimeout(setResize,5)
          break
        case "effect-magnifier" :
          setTimeout(setMagnifier,5)
          break
        case "effect-waterfall" :
          setTimeout(setWaterfall,5)
          break
      }

      document.body.scrollTop = 0
    }
  },false)

})()


