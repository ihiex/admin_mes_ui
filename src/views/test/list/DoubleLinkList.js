import Node from './Node'

export default class DoubleLinkList {
  constructor(element) {
    this.element = element;
    this.next = null;
    this.prev = null;
    this.length = 0; //存储列表项的数量
    this.head = null; //第一个节点的引用
  };

  append = function (element) {
    let node = new Node(element), //{1}
      current; // 指向列表中current项的变量
    if (this.head === null) { //列表中第一个节点 //如果head元素为null，要向列表添加第一个元素。
      this.head = node;
    } else {
      current = this.head; // 要向列表的尾部添加一个元素
      //循环列表，直到找到最后一项
      while (current.next) {
        current = current.next;
      }
      //找到最后一项，将其next赋为node，建立链接
      current.next = node; //当前（也就是最后一个）元素的next指针指向想要添加到列表的节点
      node.prev = current
    }
    this.length++; //更新列表的长度 //{6}
  }; //向链表尾部追加元素
  insert(position, element) {
    //检查越界值
    if (position >= 0 && position <= this.length) { //处理位置，需要检查越界值
      let node = new Node(element),
        current = this.head,
        previous,
        index = 0;
      if (position === 0) { //在第一个位置添加
        //现在要处理不同的场景。
        //第一种场景，需要在列表的起点添加一个元素，也就是第一个位置。
        //current变量是对列表中第一个元素的引用。我们需要做的是把node.next的值设为
        //current（列表中第一个元素）。现在head和node.next都指向了current。
        //接下来要做的就是把head的引用改为node
        node.next = current;
        this.head = node;
      } else {
        //现在来处理第二种场景：在列表中间或尾部添加一个元素。需要循环访问列表，
        //找到目标位置
        while (index++ < position) {
          previous = current;
          current = current.next;
        }

        node.next = current; //跳出循环时,current变量对想要插入新元素的位置之后一个元素的引用
        //而previous将是对想要插入新元素的位置之前一个元素的引用。在这种情况下，我们要在previous和current之间添加新项。因此，首先需要把新项（node）和当前项链接起来
        previous.next = node; //然后需要改变previous和current之间的链接让previous.next指向node
        node.prev = previous

      }
      this.length++; //更新列表的长度
      return true;
    } else {
      return false; // 越界返回false，表示没有添加项到列表中
    }
  };//在任意位置插入元素
  removeAt(position) {
    //检查越界值
    if (position > -1 && position < this.length) { // 验证这个位置是有效
      let current = this.head, // 让head指向列表的第二个元素。用current变量创建一个对列表中第一个元素的引用
        previous,
        index = 0;
      //移除第一项
      if (position === 0) { //  如果不是有效的位置，就返回null，要从列表中移除第一个元素
        this.head = current.next;
      } else {
        while (index++ < position) { //  使用一个用于内部控制和递增的index变量
          previous = current; //  对当前元素的前一个元素的引用
          current = current.next; //  current变量总是为对所循环列表的当前元素的引用
        }
        //将previous与current的下一项链接起来：跳过current，从而移除它
        previous.next = current.next; //  从列表中移除当前元素
        current.next.prev = previous
      }
      this.length--;
      return current;
    } else {
      return null;
    }

  }; //从链表中移除元素
  remove(element) {
    let index = this.indexOf(element);
    return this.removeAt(index);
  }; //根据元素的值移除元素
  indexOf(element) {
    let current = this.head, //循环访问列表变量初始值是head
      index = 0; //计算位置数
    while (current) {
      if (element === current) {
        return index; //检查当前元素是否是要找的。如果是，就返回它的位置
      }
      index++; // 就继续计数
      current = current.next; //检查列表中下一个节点
    }
    return -1;
  }; //查找链表是否有改元素
  isEmpty() {
    return this.length === 0;
  }; //检查链表是否为空
  size() {
    return this.length;
  }; //检查链表的长度
  getHead() {
    return this.head;
  }; //查看链表头元素
  toString() {
    let current = this.head, //要循环访问列表中的所有元素，就需要有一个起点,把current变量当作索引
      string = ''; //控制循环访问列表,初始化用于拼接元素值的变量
    while (current) { //循环访问列表中的每个元素
      string += current.element + (current.next ? 'n' : '');//用current来检查元素是否存在
      //如果列表为空，或是到达列表中最后一个元素的下一位（null），while循环中的代码就不会执行
      //得到了元素的内容，将其拼接到字符串中
      current = current.next; //继续迭代下一个元素
    }
    return string; // 返回列表内容的字符串
  }; //把LinkedList对象转换成一个字符串
  print() {
    let arr = []
    let current = this.head
    while (current) {
      arr.push(current.value)
      current = current.next; //检查列表中下一个节点
    }
    console.log(arr.join('->'));
  }; //打印链表元素
  getNode(i) {
    let current = this.head, index = 0
    if (i === 0) {
      return current
    } else {
      while (current) {
        if (i === index++) {
          return current; //检查当前元素是否是要找的。如果是，就返回它的位置
        }
        current = current.next; //检查列表中下一个节点
      }
    }
  }
}
