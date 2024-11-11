export default {
  bind(el, binding, vnode) {
    let dialogHeaderEl = el.querySelector('.el-dialog__header')
    let dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cssText += ';cursor:move;'
    dragDom.style.cssText += ';top:0px;'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    let getStyle = (function() {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })()

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      let disX = e.clientX - dialogHeaderEl.offsetLeft
      let disY = e.clientY - dialogHeaderEl.offsetTop

      let dragDomWidth = dragDom.offsetWidth
      let dragDomHeight = dragDom.offsetHeight

      let screenWidth = document.body.clientWidth
      let screenHeight = document.body.clientHeight

      let minDragDomLeft = dragDom.offsetLeft
      let maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

      let minDragDomTop = dragDom.offsetTop
      // rem by lianyi 20210208 let maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight
      // add by lianyi 20210208 解决问题：当弹出框高度大于屏幕显示高度时，拖拽时，弹出框的顶端会超出屏幕的上端，造成无法再拖拽
      let maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight > screenHeight ? screenHeight : dragDomHeight

      // 获取到的值带px 正则匹配替换
      let styL = getStyle(dragDom, 'left')
      let styT = getStyle(dragDom, 'top')

      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
      } else {
        styL = +styL.replace(/\px/g, '')
        styT = +styT.replace(/\px/g, '')
      }

      document.onmousemove = function(e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX
        let top = e.clientY - disY

        // 边界处理
        if (-(left) > minDragDomLeft) {
          left = -minDragDomLeft
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft
        }

        if (-(top) > minDragDomTop) {
          top = -minDragDomTop
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`

        // emit onDrag event
        vnode.child.$emit('dragdialog')
      }

      document.onmouseup = function(e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
