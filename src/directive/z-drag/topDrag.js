export default {
  bind(el, binding, vnode) {

    el.style.position = 'relative';
    //需要调整尺寸的div
    let c = el
    let body = document.querySelector('body')
    // body监听移动事件
    body.addEventListener('mousemove', move)
    // 鼠标按下事件
    c.addEventListener('mousedown', down)
    // 鼠标松开事件
    body.addEventListener('mouseup', up)

    // 是否开启尺寸修改
    let resizeable = false;
    // 鼠标按下时的坐标，并在修改尺寸时保存上一个鼠标的位置
    let clientX, clientY
    // 鼠标按下时的位置，使用n、s、w、e表示
    let direc = ''

    // 鼠标松开时结束尺寸修改
    function up() {
        resizeable = false
        // 鼠标按下的位置在右边，修改宽度
        // if (direc.indexOf('e') !== -1) {
        //   c.style.width = Math.max(minW, parseInt(getComputedStyle(c, null).width) + width) + 'px'
        // }

        // // 鼠标按下的位置在上部，修改高度
        // if (direc.indexOf('n') !== -1) {
        //   c.style.height = Math.max(minH, parseInt(getComputedStyle(c, null).height) - height) + 'px'
        // }

        // // 鼠标按下的位置在底部，修改高度
        // if (direc.indexOf('s') !== -1) {
        //   c.style.height = Math.max(minH, parseInt(getComputedStyle(c, null).height) + height) + 'px'
        // }

        // // 鼠标按下的位置在左边，修改宽度
        // if (direc.indexOf('w') !== -1) {
        //   c.style.width = Math.max(minW, parseInt(getComputedStyle(c, null).width) - width) + 'px'
        // }
    }

    // 鼠标按下时开启尺寸修改
    function down(e) {
      let d = getDirection(e)
      // 当位置为四个边和四个角时才开启尺寸修改
      if (d !== '') {
        resizeable = true
        direc = d
        // clientX = e.clientX
        clientY = e.clientY
      }
    }

    // 鼠标移动事件
    function move(e) {
      let d = getDirection(e)
      let cursor
      if (d === '') {
        cursor = 'default';
      } else if (d == 'n') {
        cursor = d + '-resize'
      }
      c.style.cursor = cursor;
      if (resizeable) {
      //鼠标走过的距离
        binding.value.height = e.clientY - clientY
        // binding.value.width = e.clientX - clientX
        //添加交互虚线
      }

    }

    // 获取鼠标所在div的位置
    function getDirection(ev) {
      let xP, yP, offset, dir;
      dir = '';

      xP = ev.offsetX;
      yP = ev.offsetY;
      offset = 10;

      if (yP < offset) dir += 'n';
    /*   else if (yP > c.offsetHeight - offset) dir += 's';
      if (xP < offset) dir += 'w';
      else if (xP > c.offsetWidth - offset) dir += 'e'; */

      return dir;
    }
  }
}
