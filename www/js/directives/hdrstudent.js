angular.module('hdrApp')
	.directive('hdrStudent', function (hdrdbx, $timeout, $state) {


		return {
			restrict: 'E',
			templateUrl: "js/directives/hdrstudent.html",
			controller: function ($scope, $element, $attrs) {

				$scope.showtitle = true;
				$scope.showmore = true;
				$scope.shomeqn = true;
				//	$scope.mode = "simple";
				$scope.student_absences = [];


				//in the scope, there is stduent object that present student in the absenceline
				//student.classroom_title present classroom in the absenceline (history needs)

				if (ionic.Platform.isWebView()) {


					if ($state.current.name == "tab.sessionshistory" || $state.current.name == "tab.sessionalter") {
						//console.log("current state :" + $state.current.name);

					}
					else {


						hdrdbx.selectStudentAbsences($scope.student.massar_number)
							.then(function (arr) {
								$scope.student_absences = arr;


							}, function (err) {
								console.log('Error while getting student absences');
								console.log(err);
							});
					}








				} else {

					$scope.student_absences = [
						{ is_student_fix_problem: 0 },
						{ is_student_fix_problem: 1 },
						{ is_student_fix_problem: 0 }
					];

				}
				$scope.goToStudentView = function (student, classroom) {
					$state.go('tab.student', { 'student': student, 'classroom': { 'title': classroom.title } });
				}
			},
			link: function (scope, element, attrs) {


				scope.$watch("sessionalterchange", function (newValue, oldValue) {
					//This gets called when data changes.
					if (ionic.Platform.isWebView()) {

						if ($state.current.name == "tab.sessionshistory") {

						} else {


							hdrdbx.selectStudentAbsences(scope.student.massar_number)
								.then(function (arr) {
									scope.student_absences = arr;

								}, function (err) {
									console.log('Error while getting student absences');
									console.log(err);
								});
						}

					} else {

						scope.student_absences = [
							{ is_student_fix_problem: 0 },
							{ is_student_fix_problem: 1 },
							{ is_student_fix_problem: 0 }
						];

					}
				});
			}
		};
	})