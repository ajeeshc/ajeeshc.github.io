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
