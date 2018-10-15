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
