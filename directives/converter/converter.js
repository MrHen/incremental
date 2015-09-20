/// <reference path="../../../typings/tsd.d.ts" />
var Converter;
(function (Converter) {
    var app = angular
        .module("incremental.converter", [])
        .directive('converter', function () { return new ConverterDirective(); })
        .controller("ConverterController", ConverterController);
    var ConverterDirective = (function () {
        function ConverterDirective() {
            this.templateUrl = 'directives/converter/converter.html';
            this.restrict = 'E';
            this.scope = {
                text: "=",
                source: "=",
                dest: "="
            };
            this.controller = ConverterController;
            this.controllerAs = "vm";
            this.bindToController = true;
        }
        return ConverterDirective;
    })();
    Converter.ConverterDirective = ConverterDirective;
    var ConverterController = (function () {
        function ConverterController() {
        }
        ConverterController.prototype.convert = function () {
            if (this.source > 0) {
                this.source--;
                this.dest++;
            }
        };
        return ConverterController;
    })();
    Converter.ConverterController = ConverterController;
})(Converter || (Converter = {}));
