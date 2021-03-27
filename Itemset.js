// Itemset.js

"use strict";

class Itemset extends Array {
  constructor() {
    super();
    this.Support = 0.0;
  }

  // Kiểm trả xem có tồn tại item trong itemset không
  // ví dụ itemset = {x, y, z} kiểm tra y
  // trả về true
  includesItemset(itemset) {
    for (var i = 0; i < itemset.length; i += 1) {
      var item = itemset[i];
      if (!this.includes(item)) {
        return false;
      }
    }
    return true;
  }

  // Trả về một đối tượng Itemset mới với phần tử đã bị loại bỏ
  // Ví dụ Itemset = {a, b, c} loại bỏ c sẽ trả vè
  // Itemset = {a, b}
  removeItemset(itemset) {
    var removed = new Itemset();
    for (var i = 0; i < this.length; i += 1) {
      var item = this[i];
      if (!itemset.includes(item)) {
        removed.push(item);
      }
    }
    return removed;
  }

  // Chuyển đối tưởng Itemset thành chuỗi nhưng không kèm
  // thuộc tính support
  // Có nghĩa là chuyển Array về String bt
  toStringNoSupport() {
    return "{" + this.join(", ") + "}";
  }

  // Có nghĩa là chuyển Array về String bt
  toString() {
    return "{" + this.join(", ") + "} (support: " + this.Support + "%)";
  }
}
