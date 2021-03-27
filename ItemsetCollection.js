// ItemsetCollection.js

"use strict";

class ItemsetCollection extends Array {
  constructor() {
    super();
  }

  // Trả về đối đượng Itemset chứa từng phần tử mảng là
  // item duy nhất kèm support = 0;
  getUniqueItems() {
    let uniqueItems = new Itemset();

    for (var index in this) {
      let itemset = this[index];
      for (var i = 0; i < itemset.length; i += 1) {
        if (!uniqueItems.includes(itemset[i])) {
          uniqueItems.push(itemset[i]);
        }
      }
    }

    return uniqueItems;
  }

  // Tìm support của phần tử itemset truyền vào
  // trong ItemsetCollection
  findSupport(itemset) {
    let matchCount = 0;
    for (var index in this) {
      let is = this[index];
      if (is.includesItemset(itemset)) {
        matchCount += 1;
      }
    }

    let support = (matchCount / this.length) * 100.0;
    return support;
  }

  // Chuyển ItemsetCollection thành rỗng
  clear() {
    this.length = 0;
  }

  // Có nghĩa là chuyển Array về String bt
  toString() {
    return this.join("\n");
  }
}
