/// <reference path="../../../typings/tsd.d.ts" />
var DataStore;
(function (DataStore) {
    function generateDataStoreInstance() {
        return new MemoryDataStoreService();
    }
    DataStore.generateDataStoreInstance = generateDataStoreInstance;
    var MemoryDataStoreService = (function () {
        function MemoryDataStoreService() {
            this.tickCount = 0;
            this.current = {
                'scrap': 2,
                'junk': 0
            };
        }
        MemoryDataStoreService.prototype.tick = function (next, count) {
            if (count === void 0) { count = 1; }
            this.tickCount += count;
            this.current = angular.extend(next);
        };
        return MemoryDataStoreService;
    })();
    DataStore.MemoryDataStoreService = MemoryDataStoreService;
    var app = angular
        .module("incremental.dataStore", [])
        .factory('dataStore', generateDataStoreInstance);
})(DataStore || (DataStore = {}));
