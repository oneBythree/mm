var app = angular.module('MyApp', ['ngRoute', 'ngVerify']);
app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
    // var vm = this;
    // vm.refresh = function() {
    //     $route.reload();
    // }
    $routeProvider
        .when('/goods', {
            templateUrl: 'goods.html',
        })
        .when('/rule', {
            templateUrl: 'rule.html',
        })
        .when('/msg', {
            templateUrl: 'msg.html',
        })
        .when('/log', {
            templateUrl: 'log.html',
        })
        .when('/goods/add', {
            templateUrl: 'good-add.html',
        })
        .when('/goods/batchadd', {
            templateUrl: 'batch-add.html',
        })
        .when('/rule/add', {
            templateUrl: 'rule-add.html',
        })
        .when('/daliy', {
            templateUrl: 'daliy.html',
        })
        .when('/record', {
            templateUrl: 'record.html',
        })
        .when('/record/add', {
            templateUrl: 'record-add.html',
        })
        .when('/record/giveic', {
            templateUrl: 'give-IC.html',
        })
        .when('/record/icinfo', {
            templateUrl: 'ic-info.html',
        })
        .when('/nod', {
            templateUrl: 'nod.html',
        })
        .when('/nod/add', {
            templateUrl: 'nod-add.html',
        })
        .when('/crosswalks', {
            templateUrl: 'crosswalks.html',
        })
        .when('/codetable', {
            templateUrl: 'codetable.html',
        })
        .when('/areatable', {
            templateUrl: 'areatable.html',
        })
        .when('/company/daliydata', {
            templateUrl: 'company-daliy-data.html',
        })
        .otherwise({
            redirectTo: '/goods'
        });
        //$locationProvider.html5Mode(true);
}]);


// function Home
