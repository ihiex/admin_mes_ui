<template>
  <div class="main_content">
    <!-- <OrganizationChart></OrganizationChart> -->
    <el-button @click="add">add</el-button>
    <el-button @click="handleAppend">insert</el-button>
    <el-button @click="handleRemove">remove</el-button>
    <el-button @click="handleGetHead">head</el-button>
    <el-button @click="handleGetNode">get node</el-button>
    <el-button @click="handlePrint">print</el-button>
    <el-button @click="handleReversal">reversal</el-button>

  </div>
</template>
<script>
import OrganizationChart from './organizationChart'
import List from './list/List.js'
// import Node from './list/Node.js'
import DoubleLinkList from './list/DoubleLinkList.js'

// 链表测试
export default {
  components: {
    // OrganizationChart
  },
  data() {
    return {
      name: 'Test',
      list: null,
      node: null
    }
  },

  mounted() {

  },
  methods: {

    handleReversal() {
      let n = 3
      let list = this.list.getHead();
      let current = list;
      let index = 1;

      let arr = []; //分组
      let lastNode = null
      while (current.next) {
        current = current.next
        if (!current.next) {
          // current = current.prev
          while (current.prev) {
            if (index === n) {
              arr.push({ node: current, count: index })
              index = 0;
            }
            current = current.prev
            if (index < n && !current.prev) {
              arr.push({ node: current, count: index })
              break
            }
            index++
          }
          break
        }
      }

      let i = 0;
      arr.forEach(res => {
        if (res.count === n) {
          let s = res.node
          let n = res.node.next.next

          let temp = s.next
          s.next = n.next;
          n.next = s.next

          let tem = s.prev;
          s.prev = n.prev;
          n.prev = tem
         /*  let c = res.node
          let n = res.node.next
          let l = Math.floor(n / 2)
          let tt = 0

          while (l > 0) {
            while(c.next){
              if(tt == l){
                c
              }
            }
            l--
          } */
        }
      })

      console.log(arr)
      // this.list.print()

    },
    handlePrint() {
      this.list.print()
    },
    handleGetNode() {
      this.node = this.list.getNode(1)
      console.log(this.node)
    },
    handleRemove() {
      // this.list.remove(this.node)
      this.list.removeAt(1)
    },
    handleGetHead() {
      console.log(this.list.getHead())

    },
    handleAppend() {
      // this.list.insert(1, 34)
      this.list.insert(1, 34)
    },

    add() {
      // console.log(this.generateParenthesis(4))
      // this.list = new List()
      /* this.list.append(23)
      this.list.append(2)
      this.list.append(52) */

      this.list = new DoubleLinkList()
      for (let i = 1; i <= 8; i++) {
        this.list.append(i)
      }
      /*  this.list.append(2)
       this.list.append(52) */
    },
    // 回溯法
    generateParenthesis(n) {
      let res = [];

      function rfs(l, r, str) {
        if (l == n && r == n) {
          res.push(str)
        }
        if (l < n) {
          rfs(l + 1, r, str + '(')
        }
        if (r < l) {
          rfs(l, r + 1, str + ')')
        }
      }

      rfs(0, 0, '')

      return res
    },
    listSort(l1, l2) {
      /*   if(l1 == null){
         return l2
        }
        if(l1.ne) */
    }

  }

}
</script>
<style scoped lang="scss">
.main_content {
  height: inherit
}
</style>
