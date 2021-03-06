// AprioriMining.js

"use strict";

class AprioriMining {
  static doApriori(db, supportThreshold) {
    let I = db.getUniqueItems(); // Load những item có trong giao dịch
    let L = new ItemsetCollection(); // Tạo biến lưu trữ tất cả các frequent k-itemset
    let Li = new ItemsetCollection(); // Tạo biến lưu trữ các frequent tại mỗi lần thứ k duyệt
    let Ci = new ItemsetCollection(); // Tạo biến lưu trữ các itemset tại mỗi lần thứ k duyệt
    // First iteration (1-item itemsets)
    // Quét lần 1 tạo 1-itemset
    for (var i = 0; i < I.length; i += 1) {
      Ci.push(Itemset.from([I[i]]));
    }
    // Lúc này Ci = [I1 I2 I3 I4 I5]
    let k = 2; // Biến để bắt đầu lần lặp tiếp theo

    // Đểm tần xuất của các 1-itemset và kiếm tra chúng với min-support
    // 1-itemset nào pass sẽ được đẩy vào Li và L
    while (Ci.length != 0) {
      // Set Li from Ci (pruning)
      Li.clear();
      for (var index in Ci) {
        let itemset = Ci[index];
        itemset.Support = db.findSupport(itemset);
        if (itemset.Support >= supportThreshold) {
          Li.push(itemset);
          L.push(itemset);
        }
      }

      // Kết thúc vòng lặp clear Ci để tiếp tục dùng cho (k+1)-itemset
      // Set Ci for next iteration (find supersets of Li)
      Ci.clear();
      let subsets = Bit.findSubsets(Li.getUniqueItems(), k); // Get k-item subsets
      subsets.forEach((set) => Ci.push(set));
      k += 1;
    }
    return L; // trả về tập các frequent k-itemset
  }

  static mine(db, L, confidenceThreshold) {
    // Biến chứa toàn bộ luật để trả về
    let allRules = [];

    // Lặp qua hết các frequent itemset truyền vào
    for (var i in L) {
      let itemset = L[i];
      let subsets = Bit.findSubsets(itemset, 0); // Lấy tất cả subset

      for (var j in subsets) {
        // Áp dụng công thức luật X -> Y từ X -> Y-X
        let subset = subsets[j];
        let supportXY = db.findSupport(itemset);
        let supportX = db.findSupport(subset);
        // Tính toán các chỉ số của Association Rules
        let confidence = (supportXY / supportX) * 100.0;
        let consequent = itemset.removeItemset(subset);
        let supportY = db.findSupport(consequent);
        let lift = confidence / 100.0 / (supportY / 100.0);
        let levarage =
          supportXY / 100.0 - (supportX / 100.0) * (supportY / 100.0);
        let conviction = (1.0 - supportY) / (1.0 - confidence);

        if (confidence >= confidenceThreshold) {
          // kiểm tra thõa mãn confidence
          let rule = new AssociationRule();
          subset.forEach((i) => rule.X.push(i));
          itemset.removeItemset(subset).forEach((i) => rule.Y.push(i));
          rule.Support = db.findSupport(itemset);
          rule.Confidence = confidence;
          rule.Lift = lift;
          rule.Levarage = levarage;
          rule.Conviction = conviction;

          if (rule.X.length > 0 && rule.Y.length > 0) {
            allRules.push(rule);
          }
        }
      }
    }

    return allRules;
  }
}
