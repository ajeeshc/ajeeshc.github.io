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
