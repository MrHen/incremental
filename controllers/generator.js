/// <reference path="../../typings/tsd.d.ts" />
var Generator;
(function (Generator) {
    var app = angular.module("incremental", []);
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
    app.controller("GeneratorController", GeneratorController);
})(Generator || (Generator = {}));
