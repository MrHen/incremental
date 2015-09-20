/// <reference path="../../typings/tsd.d.ts" />

var app = angular
    .module("incremental.directives", [
        'incremental.converter',
        'incremental.generator',
        'incremental.resourceList'
    ]);
