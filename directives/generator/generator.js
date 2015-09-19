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
    var GeneratorController = (function () {
        function GeneratorController() {
        }
        GeneratorController.prototype.generate = function () {
            this.value++;
        };
        return GeneratorController;
    })();
    Generator.GeneratorController = GeneratorController;
})(Generator || (Generator = {}));
