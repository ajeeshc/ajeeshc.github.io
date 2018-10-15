var KPMG;
(function (KPMG) {
    var Common;
    (function (Common) {
        "use strict";
        var CommentsControll = /** @class */ (function () {
            function CommentsControll($scope, $http) {
                this.Comments = [];
                this.isOnline = true;
                this.saveData = (function () {
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    // a.style = "display: none";
                    return function (data, fileName) {
                        var json = JSON.stringify(data), blob = new Blob([json], { type: "octet/stream" }), url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = fileName;
                        a.click();
                        window.URL.revokeObjectURL(url);
                    };
                }());
                this.scope = $scope;
                this.httpservice = $http;
                var self = this;
                this.isOnline = navigator.onLine;
                this.myFile = '';
                // var getComment = 'https://dashboard.orioninc.com/CommentService/api/Products/UserComments'
                var getComment = 'http://localhost/PWAS/CommentService/api/Products/UserComments';
                this.httpservice.get(getComment).then(function (response) {
                    self.Comments = response.data;
                });
            }
            CommentsControll.prototype.SaveComments = function (portfolio) {
                var self = this;
                // var saveComments = 'https://dashboard.orioninc.com/CommentService/api/Products/UserComments';
                var saveComments = 'http://localhost/PWAS/CommentService/api/Products/UserComments';
                var params = {
                    ID: '1',
                    CommentDesc: this.scope.CommentDesc,
                };
                if (navigator.onLine) {
                    this.httpservice.post(saveComments, params, null).then(function (response) {
                        self.Comments.push(response.data);
                    });
                }
                else {
                    this.httpservice.post(saveComments, params, null).then(function (response) {
                        self.Comments.push(params);
                    });
                }
            };
            CommentsControll.prototype.downloadfile = function () {
                var self = this;
                var getComment = 'http://localhost/PWAS/CommentService/api/Products/GetbookFor?format=xlsx';
                this.httpservice.get(getComment).then(function (response) {
                    self.saveData(response.data, "sampleFile.xlsx");
                });
            };
            CommentsControll.prototype.takeIndexedDBbkp = function () {
                selectAll('KCW-OfflineDB', 'UserData').then(function (response) {
                    var info = [], filename = 'workbkp.json';
                    info.push({ name: 'UserData', value: JSON.stringify(response) });
                    selectAll('KCW-OfflineDB', 'Actions').then(function (actionResp) {
                        info.push({ name: 'Actions', value: JSON.stringify(actionResp) });
                        var data = JSON.stringify(info);
                        var blob = new Blob([data], { type: 'text/json' });
                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveOrOpenBlob(blob, filename);
                        }
                        else {
                            var e = document.createEvent('MouseEvents'), a = document.createElement('a');
                            a.download = filename;
                            a.href = window.URL.createObjectURL(blob);
                            a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
                            e.initEvent('click', true, false);
                            a.dispatchEvent(e);
                        }
                    });
                });
            };
            CommentsControll.prototype.uploadFilebacktpIndexDB = function (files) {
                var file = this.scope.myFile;
                var file = files[0];
                var reader = new FileReader();
                reader.onload = function (event) {
                    console.log(event.target.result);
                };
                reader.readAsText(file);
                var text = "";
                reader.readAsText(file, text);
            };
            CommentsControll.prototype.synchComments = function () {
                var self = this;
                selectAll('KCW-OfflineDB', 'Actions').then(function (data) {
                    angular.forEach(data, function (item, key) {
                        var httpdata = JSON.parse(item.value);
                        var url = httpdata.url;
                        var params = httpdata.data;
                        self.httpservice.post(url, params, null).then(function (response) {
                            console.log("sync Completed");
                        });
                    });
                });
            };
            CommentsControll.$inject = ["$scope", "$http"];
            return CommentsControll;
        }());
        Common.CommentsControll = CommentsControll;
        angular.module("app").controller("CommentsControll", CommentsControll);
    })(Common = KPMG.Common || (KPMG.Common = {}));
})(KPMG || (KPMG = {}));
