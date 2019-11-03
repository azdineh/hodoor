angular.module('hdrApp')
	.controller('SessionalterController', function ($scope, $filter, $timeout, hdrlocalstorage, $rootScope,
		 $ionicLoading, $ionicScrollDelegate, $stateParams, $ionicPopup) {

		$scope.initialobservation = "";
		$scope.pageReady = false;
		$ionicLoading.show();
		$scope.$on('$ionicView.afterEnter', function () {

			$scope.session_view = $stateParams.session_view;

			$scope.session_view.absents_students.forEach(function (student, index, arr) {
				student = hdrlocalstorage.getRecentStudent_forSessionView(student);
				arr[index] = student;
			})

			$scope.data = {
				isExamSession: $scope.session_view.isExamSession == 0 ? false : true
			}
			calculateRestOfStudents();

			$scope.pageReady = true;
			$ionicLoading.hide();
		})



		$scope.test009 = function () {
			//alert('dfdfdf');
			$scope.showUpdateSessionConfirm();
		}


		$scope.observationUpdateMode = false;

		$scope.switchObservationUpateMode = function () {

			if ($scope.observationUpdateMode == true)
				$scope.observationUpdateMode = false
			else {
				$scope.observationUpdateMode = true;

				setTimeout(function () {
					document.getElementById('hdr-textarea-observation').focus();
				}, 20);

			}

			$ionicScrollDelegate.resize();
		}

		$scope.test010 = function () {
			$scope.showAddAbsentsStudentsConfirm();
		}

		if (ionic.Platform.isWebView()) {

			$scope.$on('$ionicView.enter', function () {
				/* if (!$scope.session_view) {

					$scope.session_view = $stateParams.session_view;
				} */

				//$scope.session_view.observation = $scope.session_view.observation.replace(/<br>/g, "\r");
				$scope.sessionalterchange = 0;
			});


			$scope.saveObservation = function (session, observation) {
				//var obsToDB = observation.replace(/\r/g, "\n");

				session.observation = observation;
				hdrlocalstorage.updateSession(session);
				$timeout(function () {
					$scope.saved = true;
					$scope.switchObservationUpateMode();
				}, 100)
			}



			$scope.showConfirmForRemoveStudent = function (id) {
				document.getElementById('hdr-session-alter-confirm' + id).classList.remove("ng-hide");
			}
			$scope.hideConfirmForRemoveStudent = function (id) {
				document.getElementById('hdr-session-alter-confirm' + id).classList.add("ng-hide");
			}

			$scope.removeStudent = function (student) {

				/* document.getElementById('hdr-session-alter-student' + student.massar_number).classList.add("ng-hide"); */
				document.getElementById('hdr-session-alter-confirm' + student.massar_number).classList.add("ng-hide");

				document.getElementById('hdr-session-alter-spinner' + student.massar_number).classList.remove("ng-hide");

				if (ionic.Platform.isWebView()) {
					document.getElementById('hdr-session-alter-spinner' + student.massar_number).classList.add("ng-hide");

					var index0 = $scope.session_view.absents_students.indexOf(student);
					//remove item from array with splice
					$scope.session_view.absents_students.splice(index0, 1);
					hdrlocalstorage.updateSession($scope.session_view);

					//remove stuent absence in student absentSessions
					hdrlocalstorage.removeAbsentSession($scope.session_view, student);

					calculateRestOfStudents();
				}
			}



			$scope.changeStudentFixProblem = function (session, student) {

				hdrlocalstorage.updateSession(session);

				hdrlocalstorage.updateAbsentSessionInfo('is_student_fix_problem', student, session);

				//$scope.sessionalterchange += 1;
			}
		}
		else {

			var students = [];
			students.push({ id: "1", full_name: 'جباري هبة الحكيم', registration_number: '159986', massar_number: "S1234200", birth_date: "12/01/2000", queuing_number: '1' });
			students.push({ id: "2", full_name: 'مريم يعقوبي', registration_number: '159986', massar_number: "S12345977", birth_date: "12/02/2000", queuing_number: '2' });
			students.push({ id: "5", full_name: 'Omar zerouali', registration_number: '159986', massar_number: "S123ZI687", birth_date: "12/05/2000", queuing_number: '5' });

			$scope.session_view = {};
			$scope.session_view.classroom_title = "TCLH-8";
			$scope.session_view.title = "11:30-12:30";
			$scope.session_view.parity = "even";
			$scope.session_view.unix_time = "15478421547";
			$scope.session_view.isExamSession = 1;
			$scope.session_view.absents_students = students;
		}


		$scope.showHelp = function () {
			var helpPopup = $ionicPopup.show({
				templateUrl: "views/sessionshistory/sessionalter/helpsessionalterview.html",
				title: '<h3 class="title assertive-bg padding light" >مساعدة</h3>',
				subTitle: '',
				scope: $scope,
				buttons: [
					{
						text: 'رجوع ',
						type: 'button',
						onTap: function (e) {
							//e.preventDefault();
						}
					}
				]
			});
		};


		$scope.showUpdateSessionConfirm = function () {

			//session_view.session.title
			var str = new String($scope.session_view.title);
			// session.title like 10:30-08:30
			var tiretIndex = str.indexOf('-');
			var timeStart = str.substring(tiretIndex + 1, str.length);
			var timeEnd = str.substring(0, tiretIndex);

			var doublepointIndex1 = timeStart.indexOf(':') >= 0 ? timeStart.indexOf(':') : timeStart.length; // 08:30
			$scope.hStart = parseInt(timeStart.substring(0, doublepointIndex1));
			$scope.mStart = parseInt(timeStart.substring(doublepointIndex1 + 1, timeStart.length)) == '' ? 0 : parseInt(timeStart.substring(doublepointIndex1 + 1, timeStart.length));


			var doublepointIndex2 = timeEnd.indexOf(':') >= 0 ? timeEnd.indexOf(':') : timeEnd.length; // 08:30
			$scope.hEnd = parseInt(timeEnd.substring(0, doublepointIndex2));
			$scope.mEnd = parseInt(timeEnd.substring(doublepointIndex2 + 1, timeEnd.length)) == '' ? 0 : parseInt(timeEnd.substring(doublepointIndex2 + 1, timeEnd.length));


			var confirmPopup = $ionicPopup.confirm({
				title: "<h3>تعديل الفترة الزمنية</h3>",
				templateUrl: "views/sessionshistory/sessionalter/updatesession.html",
				scope: $scope,
				cancelText: 'إلغاء الأمر',
				okText: 'تعديل'
			});

			$timeout(function () {
				$scope.selectSessionParity($scope.session_view.parity);
			}, 570);

			confirmPopup.then(function (res) {
				if (res) {
					console.log('You are sure');

					var separa1 = ":";
					var separa2 = ":";

					var hs, ms, he, me;

					if (!$scope.hStart || $scope.hStart == 0) {
						hs = "24";
					}
					else hs = "" + $scope.hStart;

					if (!$scope.mStart || $scope.mStart == 0) {
						ms = "";
						separa2 = "";
					}
					else ms = "" + $scope.mStart;

					if (!$scope.hEnd || $scope.hEnd == 0) {
						he = "24";
					}
					else he = "" + $scope.hEnd

					if (!$scope.mEnd || $scope.mEnd == 0) {
						me = "";
						separa1 = "";
					}
					else me = "" + $scope.mEnd;

					$scope.session_view.title = he + separa1 + me + "-" + hs + separa2 + ms;

					//$scope.session_view.title = $scope.hEnd + "-" + $scope.hStart;
					if (ionic.Platform.isWebView()) {

						var msg = "";
						if ($scope.userPartity == "even") {
							if ($scope.session_view.parity == "all") {
								if ($scope.session_view.absents_students.length > 0)
									msg = "سيقوم التحول من حصة عامة إلى حصة الزوجيين بحذف التلاميذ الفرديين (إن وجدو) من لائحة المتغيبين";
							}
							if ($scope.session_view.parity == "odd") {
								if ($scope.session_view.absents_students.length > 0)
									msg = "سيقوم التحول من حصة الفرديين ال حصة الزوجيين يحذف جميع التلاميذ الفرديين";
							}
						}
						if ($scope.userPartity == "odd") {
							if ($scope.session_view.parity == "all") {
								if ($scope.session_view.absents_students.length > 0)
									msg = "سيقوم التحول من حصة عامة إلى حصة الفرديين بحذف التلاميذ الزوجيين (إن وجدو) من لائحة المتغيبين";
							}
							if ($scope.session_view.parity == "even") {
								if ($scope.session_view.absents_students.length > 0)
									msg = "سيقوم التحول من حصة الزوجيين إلى حصة الفرديين الى حذف جميع التلاميذ الزوجيين";
							}
						}

						if (confirm("هل أنت متأكد من تعديل الحصة.." + "\n " + msg)) {

							var stdfunc = function () { };
							if ($scope.userPartity == "even") {
								stdfunc = $scope.even;

								//on supprime les absentSessions de  odd student
								var oddAbsentStudent = $scope.session_view.absents_students.filter($scope.odd);
								oddAbsentStudent.forEach(function (student) {
									hdrlocalstorage.removeAbsentSession($scope.session_view, student);
								})

							}
							if ($scope.userPartity == "odd") {
								stdfunc = $scope.odd;

								//on supprime les absentSessions de even student
								var evenAbsentStudent = $scope.session_view.absents_students.filter($scope.even);
								evenAbsentStudent.forEach(function (student) {
									hdrlocalstorage.removeAbsentSession($scope.session_view, student);
								})

							}
							if ($scope.userPartity == "all") {
								stdfunc = function (input, index) { return false };
							}

							$ionicLoading.show({});

							if ($scope.userPartity != 'all')
								$scope.session_view.absents_students = $scope.session_view.absents_students.filter(stdfunc);

							//$scope.session_view.title = $scope.hEnd + ":" + $scope.mEnd + "-" + $scope.hStart + ":" + $scope.mStart;
							$scope.session_view.isExamSession = $scope.data.isExamSession == true ? 1 : 0;
							$scope.session_view.parity = $scope.userPartity;

							hdrlocalstorage.updateSession($scope.session_view);

							$scope.session_view.absents_students.forEach(function (absentstudent) {
								hdrlocalstorage.updateAbsentSessionInfo('isExamSession', absentstudent, $scope.session_view);
								hdrlocalstorage.updateAbsentSessionInfo('parity', absentstudent, $scope.session_view);
								hdrlocalstorage.updateAbsentSessionInfo('title', absentstudent, $scope.session_view);
							})

							//console.log("update absent student from all to even(pairs)");
							$ionicLoading.hide({});

						}
						else {

						}

					}

				} else {
					console.log('You are not sure');
				}
			});
		};


		$scope.selectedStudent = {};
		$scope.selectElement = function (student) {

			var elem;


			if ($scope.selectedStudent.id != null && student.id != $scope.selectedStudent.id) {
				elem = document.getElementById('hdr-student-item' + $scope.selectedStudent.id);
				if (elem != null)
					elem.classList.remove("hdr-card-session");
			}

			elem = document.getElementById('hdr-student-item' + student.id);
			if (elem != null) {
				if (elem.classList.contains('hdr-card-session')) {
					elem.classList.remove("hdr-card-session");
					$scope.selectedStudent = {};
					$scope.itemSelected = false;

				}
				else {
					elem.classList.add("hdr-card-session");
					$scope.itemSelected = true;
					$scope.selectedStudent = student;
				}
			}

		}

		$scope.foundStudents = [];
		$scope.searchIt = function (textToSearch) {

			$rootScope.textToSearch = textToSearch;
			var regg = new RegExp('^[0-9]{1,}$');
			var startIndex = 0;


			if (regg.test(textToSearch)) {

				startIndex = 0;
				$scope.byQueuingNumberFlag = true;
			}
			else {
				startIndex = 1;
				$scope.byQueuingNumberFlag = false;
			}

			if (textToSearch.length > startIndex)
				/*  $scope.foundStudents = $filter('filter')($rootScope.students_view, { full_name: textToSearch }); */
				$scope.foundStudents = $filter('filter')($scope.restOfStudents, $scope.search);
			else
				$scope.foundStudents = [];
		}

		$scope.search = function (item, index, array) {
			if (item.full_name.includes($scope.textToSearch) || item.queuing_number == $rootScope.textToSearch)
				return true;
			else
				return false;
		}

		$scope.even = function (input, index) { return (input.queuing_number) % 2 === 0 };
		$scope.odd = function (input, index) { return (input.queuing_number) % 2 === 1 };
		$scope.all = function (input, index) { return true };



		//restOfStudents = classroom.students - session.absents_students
		var calculateRestOfStudents = function () {
			if (ionic.Platform.isWebView()) {
				$scope.restOfStudents = [];

				var classroom_tmp = $filter('filter')($rootScope.classrooms_view, $scope.session_view.classroom_title)[0];


				var students_of_classroom = [];
				$scope.restOfStudents = [];

				//clone the array
				students_of_classroom = students_of_classroom.concat(classroom_tmp.students);

				//console.log(students_of_classroom);

				var i = 0;

				$scope.session_view.absents_students.forEach(function (student) {
					if (student.isMoved != true) {
						students_of_classroom.splice(student.queuing_number - 1 - i, 1);
						i += 1;
					}
				}, this);

				if ($scope.session_view.parity == "even") {
					students_of_classroom = students_of_classroom.filter($scope.even);
				}
				if ($scope.session_view.parity == "odd") {
					students_of_classroom = students_of_classroom.filter($scope.odd);
				}



				$scope.restOfStudents = students_of_classroom;
				console.log($scope.restOfStudents);
			}
		}

		//calculateRestOfStudents();
		$scope.showAddAbsentsStudentsConfirm = function () {

			//students except absent students												
			if (!ionic.Platform.isWebView()) {
				/* 				$scope.session_view.classroom = {};
								$scope.session_view.classroom_title = "TCS4"; */
			}


			calculateRestOfStudents();


			var confirmPopup = $ionicPopup.confirm({
				title: 'إضافة تلميذ متغيب',
				templateUrl: "views/sessionshistory/sessionalter/addabsentsstudents.html",
				scope: $scope,
				cancelText: 'إلغاء الأمر',
				okText: 'إضافة'
			});

			confirmPopup.then(function (res) {
				if (res) {
					console.log('You are sure');
					if ($scope.selectedStudent.id) {
						if (ionic.Platform.isWebView()) {
							//add student in absence line
							$scope.selectedStudent.isMoved = false;
							$scope.selectedStudent.is_student_fix_problem = 0;
							$scope.session_view.absents_students.push($scope.selectedStudent);

							$scope.session_view.absents_students.sort(function (a, b) { return a.queuing_number - b.queuing_number });
							console.log("add new absents student to the session");
							
							hdrlocalstorage.updateSession($scope.session_view);
							hdrlocalstorage.addAbsentSessionToStudent($scope.session_view, $scope.selectedStudent);
							
							$scope.selectedStudent = {};
							calculateRestOfStudents();
						}

					}
					else {
						alert(".لم يتم تحديد أي تلميذ");
					}



				} else {
					console.log('You are not sure');
					$scope.selectedStudent = {};
				}

				$scope.foundStudents = [];


			});
		};


		$scope.selectSessionParity = function (id) {

			if (id == "all") {
				document.getElementById("hdr-parity-odd").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-parity-even").style.backgroundColor = "rgb(212, 223, 206)";
				//$scope.session_view.parity = "all";
				$scope.userPartity = "all";

			}
			if (id == "odd") {
				document.getElementById("hdr-parity-all").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-parity-even").style.backgroundColor = "rgb(212, 223, 206)";
				//$scope.session_view.parity = "odd";
				$scope.userPartity = "odd";
			}
			if (id == "even") {
				document.getElementById("hdr-parity-all").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-parity-odd").style.backgroundColor = "rgb(212, 223, 206)";
				//$scope.session_view.parity = "even";
				$scope.userPartity = "even";
			}

			var elm = document.getElementById("hdr-parity-" + id);
			//var initbgColor = elm.style.backgroundColor;
			elm.style.backgroundColor = "rgb(114, 241, 41)";

			/* 			if (elm.style.backgroundColor == "rgb(114, 241, 41)") {
						}
						else {
							elm.style.backgroundColor = "rgb(114, 241, 41)";
						} */

		}




		$scope.showConfirmForRemoveStudent = function (id) {
			document.getElementById('hdr-session-alter-confirm' + id).classList.remove("ng-hide");
		}
		$scope.hideConfirmForRemoveStudent = function (id) {
			document.getElementById('hdr-session-alter-confirm' + id).classList.add("ng-hide");
		}

		$scope.removeStudnet = function (id) {
			document.getElementById('hdr-session-alter-student' + id).classList.add("ng-hide");
			document.getElementById('hdr-session-alter-confirm' + id).classList.add("ng-hide");
		}

		$scope.selectAll = function (id) {
			var elm = document.getElementById(id);

			$timeout(function () {
				elm.select()
			}, 50)
		}


	});