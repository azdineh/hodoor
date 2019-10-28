angular.module('hdrApp')
	.directive('hdrStudent', function ($timeout, $state, hdrlocalstorage) {


		return {
			restrict: 'E',
			templateUrl: "js/directives/hdrstudent.html",
			controller: function ($scope, $element, $attrs) {

				$scope.showtitle = true;
				$scope.showmore = true;
				$scope.shomeqn = true;
				//	$scope.mode = "simple";


				//in the scope, there is stduent object that present student in the absenceline
				//student.classroom_title present classroom in the absenceline (history needs)

				if (ionic.Platform.isWebView()) {

					//get the last image of student from classrooms[i].studends[j]
					/* if ($state.current.name == "tab.sessionshistory" || $state.current.name == "tab.sessionalter") {


						var ind_student = hdrlocalstorage.findIndexOf('students', $scope.student);
						var ind_classroom = hdrlocalstorage.findIndexOf('classrooms', { id: $scope.student.id_classroom });

						var current_is_fix_problem =angular.copy($scope.student.is_student_fix_problem);

						$scope.student = hdrlocalstorage.classrooms[ind_classroom].students[ind_student];

						$scope.student.is_student_fix_problem = current_is_fix_problem;
						console.log($scope.student);
						//console.log("current state :" + $state.current.name);

					}
					else {


					} */








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


				/* scope.$watch("sessionalterchange", function (newValue, oldValue) {
					//This gets called when data changes.
					if (ionic.Platform.isWebView()) {

						if ($state.current.name == "tab.sessionshistory") {

						} else {
						}

					} else {

						scope.student_absences = [
							{ is_student_fix_problem: 0 },
							{ is_student_fix_problem: 1 },
							{ is_student_fix_problem: 0 }
						];

					}
				}); */
			}
		};
	})