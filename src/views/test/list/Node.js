export default class Node {
  constructor(element){
    this.value = element
    this.next = null
    this.prev = null
  }
  next(){
    return this.next
  }
  prev(){
    return this.prev
  }
}
