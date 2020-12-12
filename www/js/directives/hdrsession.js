angular.module('hdrApp')
    .directive('hdrsession', [function () {
        return {
            restrict: 'E',
            templateUrl: 'js/directives/hdrsession.html',
            controller: function ($scope, $element, $attrs) { 
                
            }
        };
    }]);

