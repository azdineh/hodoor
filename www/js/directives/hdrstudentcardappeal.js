angular.module('hdrApp')
	.directive('hdrStudentCardAppeal', function (hdrdbx, $rootScope,$timeout) {
		return {
			restrict: 'E',
			templateUrl: "js/directives/hdrstudentcardappeal.html",
			controller: function ($scope, $element) {
				$scope.cardInRed = "";
				$scope.tapped = false;
				$scope.cardInGray = "card-gray";


				$timeout(function () {

					if (ionic.Platform.isWebView()) {
						hdrdbx.selectStudentAbsences($scope.student.massar_number)
							.then(function (arr) {
								$scope.student_absences = arr;

							}, function (err) {
								console.log('Error while getting student absences');
								console.log(err);
							});

					} else {

						$scope.student_absences = [
							{ is_student_fix_problem: 0 },
							{ is_student_fix_problem: 1 },
							{ is_student_fix_problem: 0 }
						];

					}
				}, 475)

				$scope.onDoubleTap = function (student) {
					if ($scope.tapped) {
						$scope.tapped = false;
						/**
						 * push a new absent student, all with skiping duplicat item in absentStudents array
						 * see splice array method for more details
						 */
						$rootScope.absentStudents.splice($rootScope.absentStudents.indexOf(student), 1);
						//$rootscope.absentStudents.push(student);
						$scope.cardInRed = "";
						// $element.getElementById("hdr-absent-symbol").innerHTML=innerHTMLinitial;
					} else {
						$scope.tapped = true;
						//$rootScope.absentStudents.push(student);
						$rootScope.absentStudents.splice($rootScope.absentStudents.length, 0, student);
						$scope.cardInRed = "card-red";
					}
				};

			}
		};
	})