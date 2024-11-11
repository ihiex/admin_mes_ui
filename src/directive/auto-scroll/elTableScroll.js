/*
 * @Author: Jason.zou jason.zou1986@gmail.com
 * @Date: 2024-09-23 16:33:31
 * @LastEditors: Jason.zou jason.zou1986@gmail.com
 * @LastEditTime: 2024-09-23 17:08:28
 * @FilePath: \NewSFC_Web_UI\src\directive\z-drag\elTableScroll.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  bind(el, binding, vnode) {
    const time = binding.value.time || (1000 * 60);
    let speed = binding.value.speed || (1000 * 60);
    const loop = binding.value.loop || false;
    const timeLoop = binding.value.timeLoop || false;

    const wrapper = el.querySelector('.el-table__body-wrapper');
    console.log(wrapper)
    wrapper.__isExecute__ = false;
    wrapper.__vueAutoScroll__ = () => {
      if (wrapper.clientHeight >= wrapper.scrollHeight) {
        return;
      }
      clearInterval(wrapper.__vueScrollTimeout__);
      wrapper.__vueScrollTimeout__ = setInterval(() => {
        if (timeLoop && wrapper.__isExecute__) {
          wrapper.scrollTop = 0;
        }

        clearInterval(wrapper.__vueScrollInterval__);
        wrapper.__vueScrollInterval__ = setInterval(() => {
          wrapper.__isExecute__ = false;
          wrapper.scrollTop += 1;
          if (wrapper.clientHeight + wrapper.scrollTop === wrapper.scrollHeight) {
            if (loop) wrapper.scrollTop = 0;
            else {
              clearInterval(wrapper.__vueScrollInterval__)
            }
            wrapper.__isExecute__ = true;
            if (timeLoop && wrapper.__isExecute__) {
              clearInterval(wrapper.__vueScrollInterval__)
              // 如需立即开始请注释以下两段代码
              clearInterval(wrapper.__vueScrollTimeout__);
              wrapper.__vueAutoScroll__();
            }
          }
        }, speed / wrapper.scrollHeight);


      }, time);
    };
    wrapper.addEventListener('mouseenter', () => {
      clearInterval(wrapper.__vueScrollInterval__)
      clearInterval(wrapper.__vueScrollTimeout__);
    });
    wrapper.addEventListener('mouseleave', wrapper.__vueAutoScroll__);
  },
  componentUpdated(el, binding, vnode) {
    const wrapper = el.querySelector('.el-table__body-wrapper');
    wrapper.__vueAutoScroll__();
  },
  unbind(el, binding, vnode) {
    const wrapper = el.querySelector('.el-table__body-wrapper');
    clearInterval(wrapper.__vueScrollInterval__);
    clearInterval(wrapper.__vueScrollTimeout__);
    wrapper.removeEventListener('mouseenter', () => {
      clearInterval(wrapper.__vueScrollInterval__)
      clearInterval(wrapper.__vueScrollTimeout__);
    });
    wrapper.removeEventListener('mouseleave', wrapper.__vueAutoScroll__);
  }
}

