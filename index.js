/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./services/dataStore/dataStore.service.ts" />
var IncrementalApp;
(function (IncrementalApp) {
    var IncrementalController = (function () {
        function IncrementalController($scope, dataStore) {
            this.$scope = $scope;
            this.dataStore = dataStore;
            this.scope = $scope;
            $scope.resources = dataStore.current;
        }
        IncrementalController.$inject = ["$scope", "dataStore"];
        return IncrementalController;
    })();
    IncrementalApp.IncrementalController = IncrementalController;
    var app = angular
        .module("incremental", ['incremental.directives', 'incremental.services'])
        .controller("IncrementalController", IncrementalController);
})(IncrementalApp || (IncrementalApp = {}));
