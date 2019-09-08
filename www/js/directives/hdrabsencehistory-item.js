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
				

				// Pour garder une trace des élèves qui n'ont pas absenté...
				// on va les traite comme les absnets..---> une table assisanceLine

				/* scope.$watch("session_view", function (newValue, oldValue) {

					if (scope.session_view.students.length > 0) {
						if ((scope.session_view.session.students_count - scope.session_view.students.length) < 10) {
							console.log("Students not absents are less than 10");
							var qn_not_absents = [];
							scope.session_view.students_not_absents = [];

							for (var i = 0; i < scope.session_view.students.length - 1; i++) {
								var std_i = scope.session_view.students[i].queuing_number;
								var std_j = scope.session_view.students[i + 1].queuing_number;

								var qn_delta = std_j - std_i;

								if (qn_delta > 1) {
									for (var k = 1; k < qn_delta; k++) {
										qn_not_absents.push(std_i + k);
									}
								}
							}

							console.log("queuing_numbers not absents")
							console.log(qn_not_absents);

							var classroom_students = $filter('filter')($rootScope.classrooms_view, scope.session_view.classroom.title)[0].students;

							for (var i = 0; i < qn_not_absents.length; i++) {
								var index = classroom_students.findIndex(function (item) { return (item.queuing_number == qn_not_absents[i]) })
								var student = classroom_students[index];

								student.is_student_fix_problem = false;
								student.classroom_title = scope.session_view.classroom.title;

								scope.session_view.students_not_absents.push(student);

							}

							console.log("students not absents")
							console.log(scope.students_not_absents);

						}
					}
				}) */

				/* var absoluateDiff = function (arr1, arr2) {
					var arr3 = [];

					if (arr1.length >= arr2.length) {
						arr2.forEach(function (element) {
							if (!isStudentExist(element, arr1)) {
								arr3.push(element);
							}
						}, this);

					}
					else {
						arr1.forEach(function (element) {
							if (!isStudentExist(element, arr2)) {
								arr3.push(element);
							}
						}, this);
					}


					return arr3;
				} */

				/* var isStudentExist = function (student, arr) {
					var flag = false;

					arr.forEach(function (element) {
						if (student.massar_number == element.massar_number) {
							flag = true;
						}
					}, this);

					return flag;
				} */

				//add self observation to observation field






			}
		};
	});