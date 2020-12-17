if (!window.indexedDB) {
  console.log(
    "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
  );
}

const db_name = "budgetDB";
var request = indexedDB.open(db_name);

request.onupgradeneeded = setUpgrade

function setUpgrade (ev) {
  // The database did not previously exist, so create object stores and indexes.

  var db
  db = ev.target.result;

  var store = db.createObjectStore("transactions", { autoIncrement: true });
  var nameIndex = store.createIndex("name", "name");
  var priceIndex = store.createIndex("value", "value");
  var dateIndex = store.createIndex("date", "date");
};

request.onsuccess = function () {
  db = request.result;
};

function saveRecord(transactionData) {
  alert('saving record...')
  var request= indexedDB.open('budgetDB')

  request.onupgradeneeded = setUpgrade

  request.onsuccess = e => {
    var db = e.target.result

    var tx = db.transaction(["transactions"], "readwrite");
    var store = tx.objectStore("transactions")
  
    store.put({
      name: transactionData.name,
      value: transactionData.value,
      date: transactionData.date
    })

  }

}


exports = saveRecord