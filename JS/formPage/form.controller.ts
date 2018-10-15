module KPMG.Common {
    "use strict";



    export class FormPageControll {
        static $inject = ["$scope", "$http"];
        private scope: any;
        private httpservice: any;
        linksCollection: any;
        portfolios:any=null;  

        constructor($scope: any,
            $http: ng.IHttpService
            ) {
            this.scope = $scope;
            this.httpservice = $http;
            var self = this; 
        
 
  

            var synchoffline = 'http://etool.orioninc.com/OPMNext/DashBoardService/api/SprintTrackerDashBoard/GetAllProjectForPortfolio?portfolioID=31'
            this.httpservice.get(synchoffline).then(function (response) {
               self.portfolios = JSON.parse(response.data.Result);
            });

            


        } 

        updatePortfolio(portfolio):void{

            var tfscapacity = 'https://mobility.orioninc.com/Mobility/OPM/YodaMobileService/YODAService.svc/GetResourceCapacityPlan';
            var params = {
                teamsite: 'KPMG-service',
                project: 'KPMG-Audit-Victor',
                iterationId: 'Sprint-3',
                team: 'OST-NextGen', 
                username: 'UserName',
                password: 'PassWord',
                portfolio:JSON.stringify(portfolio),
            };

            this.httpservice.post(tfscapacity, params, null).then(function (response) {
            });

        }
     
    }
    angular.module("app").controller("FormPageControll", FormPageControll);
}
 