/// <reference path="../../../typings/tsd.d.ts" />
var Generator;
(function (Generator) {
    var app = angular
        .module("incremental", [])
        .directive('generator', function () { return new GeneratorDirective(); })
        .controller("GeneratorController", GeneratorController);
    var GeneratorDirective = (function () {
        function GeneratorDirective() {
            this.templateUrl = 'directives/generator/generator.html';
            this.restrict = 'E';
            this.scope = {
                value: "="
            };
            this.controller = GeneratorController;
            this.controllerAs = "vm";
            this.bindToController = true;
        }
        return GeneratorDirective;
    })();
    Generator.GeneratorDirective = GeneratorDirective;
    //export function generatorDirective() {
    //    return {
    //        templateUrl: 'directives/generator/generator.html',
    //        restrict: 'E',
    //        scope: {
    //            value: "="
    //        },
    //        controller: GeneratorController,
    //        controllerAs: "vm",
    //        bindToController: true
    //    };
    //}
    //
    var GeneratorController = (function () {
        function GeneratorController($scope) {
            $scope.value = 0;
            $scope.generate = function () {
                $scope.value++;
            };
        }
        GeneratorController.$inject = ['$scope'];
        return GeneratorController;
    })();
    Generator.GeneratorController = GeneratorController;
})(Generator || (Generator = {}));
