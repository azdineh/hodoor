angular.module('hdrApp')
	.directive('hdrabsencehistoryitem', function ($ionicScrollDelegate, $rootScope, $filter) {
		return {
			restrict: 'E',
			templateUrl: "js/directives/hdrabsencehistory-item.html",
			controller: function ($scope, $element, $attrs) {

				$scope.limitstudent = 9;


				$scope.moreStudent = function () {
					$scope.limitstudent += 5;
					$ionicScrollDelegate.resize();
				}


			},
			link: function (scope, element, attrs) {

			}
		};
	});