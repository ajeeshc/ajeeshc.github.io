module App {

    "use strict";

    interface IConfigurationController extends angular.IScope {

    }

    export class ConfigurationController {
        static $inject = [
            "$scope",
            "$http",
            "$timeout",
            "$routeParams",
            "$location",
            "$window",
            "$compile"];

        private configurationControllerScope: IConfigurationController;
        private httpService: ng.IHttpService;
        private localizationService: any
        timeOutService: ng.ITimeoutService;
        private scope: any;
        private observerService: any
        constructor(
            public $scope: IConfigurationController,
            $http: ng.IHttpService,
            $timeout: ng.ITimeoutService,
            $routeParams: any,
            $location: any,
            $window: any,
            $compile: any) {

                

        }  

        syncApplication():void{
            var synchoffline = 'http://etool.orioninc.com/OPMNext/DashBoardService/api/SprintTrackerDashBoard/GetAllProjectForPortfolio?portfolioID=2'
            this.httpService.get(synchoffline).then(function (response) {
               // console.log(JSON.stringify(response.data.Result));
            });
        }
    }
    angular.module("app").controller("configurator", ConfigurationController);
}