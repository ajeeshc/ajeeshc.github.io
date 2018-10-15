(function () {
    "use strict";
    angular.module("app", [
        "ngRoute",
        "ui.bootstrap",
        "kendo.directives"
    ]).config(routeConfig);
    routeConfig.$inject = ["$routeProvider", "$locationProvider"];
    //set current locale
    kendo.culture(window['currentLocale']);
    function routeConfig($routeProvider, $locationProvider) {
        $routeProvider
            .when("/portal", {
            templateUrl: "JS/Common/portal.html",
            reloadOnSearch: false
        })
            .when("/form", {
            templateUrl: "JS/formPage/form.html",
            reloadOnSearch: true
        })
            .when("/comments", {
            templateUrl: "JS/Comments/Comments.html",
            reloadOnSearch: true
        });
        $locationProvider.html5Mode(false);
    }
    ;
})();
angular.module("app").filter('nospace', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
    };
});
angular.module("app").config(['$httpProvider', function ($httpProvider) {
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
            $httpProvider.interceptors.push('myHttpInterceptor');
        }
        else {
        }
        //  $httpProvider.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }
]);
angular.module('app').factory('myHttpInterceptor', function ($q) {
    return {
        // optional method
        'request': function (config) {
            if (config.method == 'POST' && !navigator.onLine) {
                var data = { value: JSON.stringify({ url: config.url, data: config.data }) };
                insert('KCW-OfflineDB', 'Actions', data);
                updateGetFromPost('KCW-OfflineDB', 'UserData', config.data, config.url);
            }
            return config;
        },
        // optional method
        'requestError': function (rejection) {
            return $q.reject(rejection);
        },
        // optional method 
        'response': function (response) {
            if (response.config.method == 'GET' && isAUserDataCall(response.config.url)) {
                if (navigator.onLine) {
                    if (isdocumentDownload(response.config.url)) {
                        var data = { value: JSON.stringify(response) };
                        var key = response.config.url;
                        update('KCW-OfflineDB', 'UserData', data, key);
                    }
                    else {
                        var data = { value: JSON.stringify(response.data) };
                        var key = response.config.url;
                        update('KCW-OfflineDB', 'UserData', data, key);
                    }
                }
            }
            return response;
        },
        // optional method
        'responseError': function (rejection) {
            return $q.reject(rejection);
        }
    };
});
angular.module('app').directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                element.bind('change', function (e) {
                    scope.myFile = element[0].files[0];
                    var reader = new FileReader();
                    readAsText(scope.myFile, function (response) {
                        pushOfflineDataToIndexDB(response);
                    });
                });
                function readAsText(file, callback) {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        callback(reader.result);
                    };
                    reader.readAsText(file);
                }
            }
        };
    }]);

var App;
(function (App) {
    "use strict";
    var ConfigurationController = /** @class */ (function () {
        function ConfigurationController($scope, $http, $timeout, $routeParams, $location, $window, $compile) {
            this.$scope = $scope;
        }
        ConfigurationController.prototype.syncApplication = function () {
            var synchoffline = 'http://etool.orioninc.com/OPMNext/DashBoardService/api/SprintTrackerDashBoard/GetAllProjectForPortfolio?portfolioID=2';
            this.httpService.get(synchoffline).then(function (response) {
                // console.log(JSON.stringify(response.data.Result));
            });
        };
        ConfigurationController.$inject = [
            "$scope",
            "$http",
            "$timeout",
            "$routeParams",
            "$location",
            "$window",
            "$compile"
        ];
        return ConfigurationController;
    }());
    App.ConfigurationController = ConfigurationController;
    angular.module("app").controller("configurator", ConfigurationController);
})(App || (App = {}));

var KPMG;
(function (KPMG) {
    var Common;
    (function (Common) {
        "use strict";
        var FormPageControll = /** @class */ (function () {
            function FormPageControll($scope, $http) {
                this.portfolios = null;
                this.scope = $scope;
                this.httpservice = $http;
                var self = this;
                var synchoffline = 'http://etool.orioninc.com/OPMNext/DashBoardService/api/SprintTrackerDashBoard/GetAllProjectForPortfolio?portfolioID=31';
                this.httpservice.get(synchoffline).then(function (response) {
                    self.portfolios = JSON.parse(response.data.Result);
                });
            }
            FormPageControll.prototype.updatePortfolio = function (portfolio) {
                var tfscapacity = 'https://mobility.orioninc.com/Mobility/OPM/YodaMobileService/YODAService.svc/GetResourceCapacityPlan';
                var params = {
                    teamsite: 'KPMG-service',
                    project: 'KPMG-Audit-Victor',
                    iterationId: 'Sprint-3',
                    team: 'OST-NextGen',
                    username: 'UserName',
                    password: 'PassWord',
                    portfolio: JSON.stringify(portfolio),
                };
                this.httpservice.post(tfscapacity, params, null).then(function (response) {
                });
            };
            FormPageControll.$inject = ["$scope", "$http"];
            return FormPageControll;
        }());
        Common.FormPageControll = FormPageControll;
        angular.module("app").controller("FormPageControll", FormPageControll);
    })(Common = KPMG.Common || (KPMG.Common = {}));
})(KPMG || (KPMG = {}));

var KPMG;
(function (KPMG) {
    var Common;
    (function (Common) {
        var FormPage;
        (function (FormPage_1) {
            var FormPage = /** @class */ (function () {
                function FormPage() {
                    this.restrict = "E";
                    this.link = function ($scope, elem, attrs) {
                        var targetpath = window["PortalPath"] + "JS/formPage/form.html";
                        $scope.getCustomTemplateUrl = function () { return (targetpath); };
                    };
                    this.templateUrl = window["PortalPath"] + "JS/formPage/form.html";
                    this.controller = Common.FormPageControll;
                    this.controllerAs = "frm";
                }
                FormPage.instance = function () {
                    return new FormPage();
                };
                return FormPage;
            }());
            angular.module("app").directive("formPage", FormPage.instance);
        })(FormPage = Common.FormPage || (Common.FormPage = {}));
    })(Common = KPMG.Common || (KPMG.Common = {}));
})(KPMG || (KPMG = {}));

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

