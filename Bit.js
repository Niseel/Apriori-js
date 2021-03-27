// Bit.js

"use strict";

class Bit {
  // Nhận vào 1 k-itemset và k
  // với k-itemset truyền vào sẽ trả về 1 ItemsetCollection
  // ItemsetCollection chứa từng phần từ là Itemset
  // các itemset đó là các tập subset của k-itemset đầu vào
  // input k trả về k-subset của k-itemset truyền vào
  // k = 0 trả về tất cả subset
  static findSubsets(itemset, n) {
    let subsets = new ItemsetCollection();

    let subsetCount = Math.pow(2, itemset.length);
    for (var i = 0; i < subsetCount; i++) {
      if (n == 0 || Bit.getOnCount(i, itemset.length) == n) {
        let binary = Bit.decimalToBinary(i, itemset.length);

        let subset = new Itemset();
        for (var charIndex = 0; charIndex < binary.length; charIndex++) {
          if (binary[binary.length - charIndex - 1] == "1") {
            subset.push(itemset[charIndex]);
          }
        }
        subsets.push(subset);
      }
    }

    return subsets;
  }

  static getBit(value, position) {
    let bit = value & Math.pow(2, position);
    return bit > 0 ? 1 : 0;
  }

  // Chuyển số dec sang binary
  static decimalToBinary(value, length) {
    let binary = "";
    for (var position = 0; position < length; position++) {
      binary = Bit.getBit(value, position) + binary;
    }
    return binary;
  }

  // Đếm số bit 1 trong số dec khi chuyển qua binary
  static getOnCount(value, length) {
    let binary = Bit.decimalToBinary(value, length);

    let onCount = 0;
    for (var i = 0; i < binary.length; i += 1) {
      if (binary[i] == "1") {
        onCount += 1;
      }
    }

    return onCount;
  }
}
