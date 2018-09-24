//jsonp回调函数
function makeContent(data) {
    document.querySelector(".display-wrapper").innerHTML = data.content
}

var lastClickLi;
(function eventHandler() {
    var nav = document.querySelector(".nav"),
        contentWrapper = document.querySelector(".display-wrapper")

    nav.addEventListener("click", function (event) {
        if (event.target.tagName.toLowerCase() === "li" && event.target.className === "pointer") {
            id = event.target.getAttribute("data-value")
            if (lastClickLi) {
                lastClickLi.className = "pointer"
            }

            event.target.className += " chosen"
            lastClickLi = event.target

            //获取json
            var jsonsp = document.createElement("script")
            jsonsp.type = "text/javascript"
            jsonsp.src = "showPage/contentPages/" + id + ".json"
            document.body.appendChild(jsonsp)

            jsonsp.onload = jsonsp.onreadystatechange = function () {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                    document.body.removeChild(jsonsp)

                    switch (id) {
                        case "compo-calendar":
                            makeCalendar()
                            break
                        case "compo-table":
                            makeTable()
                            break
                        case "compo-shuffling":
                            makeShuffling()
                            break
                        case "compo-slideDoor":
                            makeSildeDoor()
                            break
                        case "compo-select":
                            makeSelect()
                            break
                        case "effect-drag":
                            setDrag()
                            break
                        case "effect-resize":
                            setResize()
                            break
                        case "effect-magnifier":
                            setMagnifier()
                            break
                        case "effect-waterfall":
                            setWaterfall()
                            break
                    }

                    jsonsp.onload = null
                }
            }

            document.body.scrollTop = 0
        }
    }, false)

})()
