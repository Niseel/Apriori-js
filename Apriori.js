// Apriori.js

//i1 i2 i3 i4 i5
// var _testDB = [
//     'cheese, diaper, water, bread, umbrella',
//     'diaper, water',
//     'cheese, diaper, milk',
//     'diaper, cheese, detergent',
//     'cheese, milk, beer'
// ];
// var _testDB = [
//   "coconut, orange, mango",
//   "apple, peach, mango",
//   "mango, watermelon, banana, peach",
//   "orange, mango, watermelon, banana",
//   "banana, apple, coconut",
//   "peach, apple, banana, watermelon",
//   "watermelon, mango",
//   "coconut, watermelon, orange",
//   "peach, apple, banana",
//   "banana, mango",
//   "orange, coconut, banana, peach",
//   "apple, banana, peach",
//   "peach, mango, apple, banana",
//   "mango, orange, watermelon, banana, coconut",
// ];
// var _testDB = [
//   "I1, I2, I3",
//   "I2, I3, I4",
//   "I4, I5",
//   "I1, I2, I4",
//   "I1, I2, I3, I5",
//   "I1, I2, I3, I4",
// ];
var dataset;
var _testDB = [];
var _db = [];
var datasource = [];

$(function () {
  SetControlBehaviors();
  $("#ResetDBButton").click();
  $("#ItemsTextBox").focus();
  var fileInput = document.getElementById("csv"),
    readFile = function () {
      var reader = new FileReader();
      reader.onload = function () {
        //document.getElementById("out").innerHTML = reader.result;
        dataset = reader.result;
        console.log(dataset);

        var database = [];
        var arr = dataset.split("\n");
        for (let i = 1; i < arr.length; i++) {
          var curItem = arr[i].split(",");

          // dữ liệu không dùng 3 cột đầu
          curItem.shift();
          curItem.shift();
          curItem.shift();
          database.push(curItem.join(","));
        }
        database.pop();
        database.forEach((item) => {
          datasource.push(item.substring(1, item.length - 2));
        });
      };
      // start reading the file. When it is done, calls the onload event defined above.
      reader.readAsBinaryString(fileInput.files[0]);
    };

  fileInput.addEventListener("change", readFile);
});

///////////////////
// Helper Methods

function SetControlBehaviors() {
  // Set generate-db-button behavior
  $("#GenerateDBButton").click(function () {
    // Read comma-separated items with whitespace removed
    let items = $.trim($("#ItemsTextBox").val());
    let itemsList = items.split(",");
    for (var i in itemsList) {
      itemsList[i] = $.trim(itemsList[i]);
    }

    // Generate random database
    let transCount = parseInt($.trim($("#TransCountTextBox").val()));

    _db = [];
    for (var transIndex = 0; transIndex < transCount; ) {
      let itemCount = getRandomInt(1, itemsList.length);
      let itemset = [];

      for (var j = 0; j < itemCount; j += 1) {
        let itemIndex = getRandomInt(1, itemsList.length);
        let item = itemsList[itemIndex - 1];
        if (itemset.indexOf(item) < 0) itemset.push(item);
      }

      if (itemset.length > 0) {
        _db.push(itemset.join(", "));
        transIndex += 1;
      }
    }

    $("#DBTextBox").val(_db.join("\n"));
  });

  // Set reset-db-button behavior
  $("#ResetDBButton").click(function () {
    // Mỗi khi load lại trang hoặc nhấn nút reset
    // dữ liệu từ data tức _testDB sẽ được đổ vào mảng _db
    // đồng thời loại lại dữ liệu đã được tải lên textArea #DBTextBox
    _db = [];
    _testDB.forEach((i) => _db.push(i));
    $("#DBTextBox").val(_db.join("\n"));
  });

  // Set apriori-button behavior
  $("#AprioriButton").click(function () {
    // Create ItemsetCollection for current db
    // Tạo biến db là kiểu ItemsetCollection chứa từng phần từ
    // là kiểu Itemset từ dữ liệu đầu vào _db
    // lưu ý kí tự tách chuỗi
    let db = new ItemsetCollection();
    //_db = _db.map((item) => item.substring(1, item.length-2));
    _db = [...datasource];
    for (var i in _db) {
      let items = _db[i].split(", ");
      db.push(Itemset.from(items));
    }

    // Step1: Find large itemsets for given support threshold
    let supportThreshold = parseFloat(
      $.trim($("#SupportThresholdTextBox").val())
    );
    let L = AprioriMining.doApriori(db, supportThreshold);

    ClearResult();
    AddResultLine(L.length + " Large Itemsets (by Apriori):");
    AddResultLine(L.join("\n"));
    AddResultLine("");

    // Step2: Build rules based on large itemsets and confidence threshold
    let confidenceThreshold = parseFloat(
      $.trim($("#ConfidenceThresholdTextBox").val())
    );
    let allRules = AprioriMining.mine(db, L, confidenceThreshold);
    AddResultLine(allRules.length + " Association Rules");
    AddResultLine(allRules.join("\n"));

    // Tên và nội dung file xuất
    let fileName = "AssociationRule.txt";
    let fileContent = L.length + " Large Itemsets (by Apriori): \n";
    fileContent += L.join("\n");
    fileContent += "\n\n\n";
    fileContent += allRules.length + " Association Rules: \n";
    fileContent += allRules.join("\n");

    // Xuất file để download
    var blob = new Blob([fileContent], {
      type: "text/plain;charset=utf-8",
    });
    // Hàm lưu của thư viện FileSaver
    saveAs(blob, fileName);
  });
}

// Trả về số nguyên ngẫu nhiên từ min -> max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Thêm chuỗi input và #ResultTextBox và xuống dòng
function AddResultLine(text) {
  $("#ResultTextBox").val($("#ResultTextBox").val() + text + "\n");
}

// Xóa khung kết quả #ResultTextBox
function ClearResult(text) {
  $("#ResultTextBox").val("");
}

function testObjects() {
  var is = new ItemsetCollection();
  is.push(Itemset.from(["ab", "bc", "c"]));
  is.push(Itemset.from(["a", "e", "f", "z", "c"]));
  is.push(Itemset.from(["d", "n", "c"]));
  is.push(Itemset.from(["a"]));
  is.push(Itemset.from(["z", "a", "c"]));
  is.push(Itemset.from(["zx", "a"]));
  //console.log(is);
  // alert(is.getUniqueItems());
  // alert("Support:" + is.findSupport(Itemset.from(["c"])));

  // console.log(is.getUniqueItems());
  // console.log(is);

  var i = Itemset.from(["a", "b", "cd"]);
  i.Support = 40;
  // cd khác dc là sai nè
  // console.log(i);
  // console.log(i.includesItemset(Itemset.from(["a", "cd"])));
  // //console.log("Removed:" + i.removeItemset(Itemset.from(["a"])));
  // console.log(s);

  var rule1 = new AssociationRule();
  rule1.X = Itemset.from(["a", "b"]);
  rule1.Y = Itemset.from(["c"]);
  rule1.Support = 45.857;
  rule1.Confidence = 80;
  // Mô phỏng đối tưởng AssociationRules với giá trị X, Y Support và Confidence thiếu Lift cần thêm nhé.
  //alert(rule1);
  //console.log(rule1);
  // Chuyển số dec sang binary
  // alert(Bit.decimalToBinary(16, 6));
  // alert(Bit.decimalToBinary(15, 6));

  // Đếm số bit 1 trong số dec khi chuyển qua binary
  // alert(Bit.getOnCount(16, 6));
  // alert(Bit.getOnCount(15, 6));

  // Số itemset con sinh ra từ k-itemset
  //alert(Bit.findSubsets(Itemset.from(["a", "b", "c", "d"]), 0));
  //console.log(Bit.findSubsets(Itemset.from(["a", "b", "c", "d"]), 5));

  // test
  //subset.forEach((i) => rule.X.push(i));
}
