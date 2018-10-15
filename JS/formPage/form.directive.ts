module KPMG.Common.FormPage {
    class FormPage implements ng.IDirective {
        "use strict";

        static instance(): ng.IDirective {
            return new FormPage();
        }

        restrict = "E";
        link = ($scope: any, elem, attrs) => {
            var targetpath = window["PortalPath"] + "JS/formPage/form.html";
            $scope.getCustomTemplateUrl = () => (targetpath);
        }
        templateUrl = window["PortalPath"] + "JS/formPage/form.html";
        controller = FormPageControll;
        controllerAs = "frm";
    }

    angular.module("app").directive("formPage", FormPage.instance);
}