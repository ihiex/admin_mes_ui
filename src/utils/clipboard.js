import Vue from 'vue'
import Clipboard from 'clipboard'

function clipboardSuccess() {
  Vue.prototype.$baseMessage('复制成功', 'success')
}

function clipboardError() {
  Vue.prototype.$baseMessage('复制失败', 'error')
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 复制文本
 * @param text
 * @param event
 */
export default function handleClipboard(text, event) {
  let clipboard = new Clipboard(event.target, {
    text: () => text,
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
