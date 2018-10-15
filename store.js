window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var db, tx, store, index;

if (window.indexedDB) {

    let OfflineData = window.indexedDB.open("KCW-OfflineDB", 2);

    OfflineData.onupgradeneeded = function (e) {
        let db = OfflineData.result,
            store = db.createObjectStore("UserData", {}),
            index = store.createIndex("url", "url", { unique: true });
        store = db.createObjectStore("Actions", { autoIncrement: true }),
            index = store.createIndex("key", "key", { unique: true });
    };



}
else {
    alert("indexed DB not supported ")
}

function openDB(dbName, storeName) {

    var openRequest = window.indexedDB.open(dbName, 2);
    openRequest.onupgradeneeded = function (e) {
        let db = request.result;
        if (!db.objectStore.contains(storeName)) {
            db.createObjectStore(storeName, { autoIncrement: true });
        }
    }
    return openRequest;
}

function selectAll(dbName, storeName) {
    return new Promise((resolve, reject) => {
        var openRequest = window.indexedDB.open(dbName, 2);
        openRequest.onupgradeneeded = function (e) {
            let db = request.result;
            if (!db.objectStore.contains(storeName)) {
                db.createObjectStore(storeName, { autoIncrement: true });
            }
        }
        openRequest.onsuccess = function (e) {
            console.log("Success!");
            db = e.target.result;
            return readAllFromStore(storeName).then(function (response) {
                resolve(response)
            });
        }
        openRequest.onerror = function (e) {
            console.log("Error");
            console.dir(e);
        }
    });


}

function selectByKey(dbName, storeName, key) {
    openDB(dbName, storeName);
    openRequest.onsuccess = function (e) {
        console.log("Success!");
        db = e.target.result;
        selectfromDBbyKey(storeName, key);
    }
    openRequest.onerror = function (e) {
        console.log("Error");
        console.dir(e);
    }
}

function insert(dbName, storeName, data, key, isdirectData) {
    var openRequest = openDB(dbName, storeName);
    openRequest.onsuccess = function (e) {
        console.log("Success!");
        db = e.target.result;
        writeDatatoDBStore(storeName, data, key, isdirectData);
    }
    openRequest.onerror = function (e) {
        console.log("Error");
        console.dir(e);
    }
}

function update(dbName, storeName, data, key,isdirectData) {
    var openRequest = openDB(dbName, storeName);
    openRequest.onsuccess = function (e) {
        console.log("Success!");
        db = e.target.result;
        updateUserDataResponse(storeName, data, key,isdirectData);
    }
    openRequest.onerror = function (e) {
        console.log("Error");
        console.dir(e);
    }
}

function updateGetFromPost(dbName, storeName, data, key) {
    var openRequest = openDB(dbName, storeName);
    openRequest.onsuccess = function (e) {
        console.log("Success!");
        db = e.target.result;
        updateToIndexedDB(storeName, data, key);
    }
    openRequest.onerror = function (e) {
        console.log("Error");
        console.dir(e);
    }
}

function pushOfflineDataToIndexDB(Offlinedata) {
    var userData = JSON.parse(JSON.parse(Offlinedata)[0].value);
    var userActions = JSON.parse(JSON.parse(Offlinedata)[1].value);


    userData.forEach(function (item, index) {
        update('KCW-OfflineDB', 'UserData', item.value, item.key,true);
    });

    userActions.forEach(function (item, index, ) {
        insert('KCW-OfflineDB', 'Actions', item.value, item.key, true);
    });

}

/* SUPPORTING METHODS */

function isAUserDataCall(url) {
    return url.includes('31') || url.includes('UserComments') || url.includes('GetbookFor');
}

function isdocumentDownload(url) {
    return url.includes('GetbookFor');
}

function readAllFromStore(storeName) {
    var objectcln = [];
    return new Promise((resolve, reject) => {
        var transaction = db.transaction([storeName], "readwrite");
        var store = transaction.objectStore(storeName);
        var request = store.openCursor();
        request.onerror = function () {
            console.log("Error in - readAllFromStore");
        }
        request.onsuccess = function () {
            let cursor = event.target.result;

            if (cursor) {
                let key = cursor.primaryKey;
                let value = cursor.value;
                objectcln.push({ key: key, value: value });
                cursor.continue();
            }
            else {
                resolve(objectcln);
            }

        }
    });
}

function writeDatatoDBStore(storeName, data, key, isdirectData) {
    var transaction = db.transaction([storeName], "readwrite");
    var store = transaction.objectStore(storeName);

    if (key == null || key == undefined) {
        if (isdirectData)
            var request = store.add(data);
        else
            var request = store.add(data.value);
    }
    else {
        if (isdirectData)
            var request = store.add(data, key);
        else
            var request = store.add(data.value, key);
    }
    request.onerror = function () {
        console.log("Error");
    }
    request.onsuccess = function () {
        console.log("Yolo! Did it");
    }
}
function updateUserDataResponse(storeName, data, key, isdirectData) {
    selectfromDBbyKey(storeName, key).then(function (response) {
        var transaction = db.transaction([storeName], "readwrite");
        var store = transaction.objectStore(storeName);
        if (isdirectData)
            var request = store.put(data, key);
        else
            var request = store.put(data.value, key);
        request.onerror = function () {
            console.log("Error");
        }
        request.onsuccess = function () {
            console.log("Yolo! Did it");
        }
    });
}
function updateToIndexedDB(storeName, data, key) {

    //getTheUserDataKeyFromTheActionURL(key).then(function (result) {
    selectfromDBbyKey(storeName, key).then(function (response) {
        var newdata = creatTheUpdatedData(response, data);
        updatedData = JSON.stringify(newdata);
        var transaction = db.transaction([storeName], "readwrite");
        var store = transaction.objectStore(storeName);
        var request = store.put(updatedData, key);
        request.onerror = function () {
            console.log("Error");
        }
        request.onsuccess = function () {
            console.log("Yolo! Did it");
        }
    });
    //});

}

function selectfromDBbyKey(storeName, key) {
    return new Promise((resolve, reject) => {
        var transaction = db.transaction([storeName], "readwrite");
        var store = transaction.objectStore(storeName);
        var request = store.get(key);
        request.onerror = function (event) {
            console.log("Error in - selectbyKey ");
        }
        request.onsuccess = function (event) {
            resolve(request.result);
        }
    });
}

function creatTheUpdatedData(oldData, newData) {
    var Json_oldData = JSON.parse(oldData);
    var Json_newData = newData; //JSON.parse(newData.portfolio);
    var i = 0;
    Json_oldData.push(Json_newData);

    return Json_oldData;

}
function getTheUserDataKeyFromTheActionURL(key) {
    // here a logic has to be written here to get the key from the POST key
    return new Promise((resolve, reject) => {

        if (key.includes('UserComments')) {

            var obj = {
                key: 'http://localhost/PWAS/CommentService/api/Products/UserComments'
            };
            resolve(obj);
        }
        else {
            var obj = {
                key: 'http://etool.orioninc.com/OPMNext/DashBoardService/api/SprintTrackerDashBoard/GetAllProjectForPortfolio?portfolioID=31'
            };
            resolve(obj);
        }



    });
}