angular.module('hdrApp')
	.controller('ClassroomController', function ($scope, azdutils, $rootScope, $filter, $window, $ionicPopup, $ionicScrollDelegate, $ionicModal, $stateParams, $timeout, hdrdbx) {



		/* 		$scope.fct = function (id) {
					var initial_bg = document.getElementById(id).style.backgroundColor;
					
					document.getElementById(id).style.backgroundColor = "lightgray";
					$timeout(function () {
						document.getElementById(id).style.backgroundColor = initial_bg;
					}, 150);
				} */

		/* 		$scope.goToStudentView = function (student) {
					$scope.fct(student.id);
					$state.go('tab.student', { 'student': student, 'classroom': $scope.classroom });
				} */

		$scope.itemSelected = false;
		$scope.isFirstStudent = false;
		$scope.isLastStudent = false;
		$scope.selectedStudent = {};

		$scope.isNewStudent = true;
		$scope.changeOption = function () {
			if ($scope.isNewStudent) {
				$scope.isNewStudent = false;
			}
			else {
				$scope.isNewStudent = true;

			}
		}

		$scope.selectElement = function (student) {

			var elem;



			var studentIndex = $scope.classroom.students.indexOf(student);
			if (studentIndex == 0) {
				$scope.isFirstStudent = true;
			} else {
				$scope.isFirstStudent = false;
			}
			if (studentIndex == $scope.classroom.students.length - 1) {
				$scope.isLastStudent = true;
			}
			else {
				$scope.isLastStudent = false;
			}




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

		$scope.showConfirm = function (student) {
			var template = "";
			template = '<p dir="rtl"><b>' + student.full_name + '</b></p><p dir="rtl">هل أنت متأكد من حذف التلميذ(ة) ؟</p>';


			var confirmPopup = $ionicPopup.confirm({
				title: 'تأكيد',
				template: template,
				cancelText: 'إلغاء الأمر',
				okText: 'نعم'
			});

			confirmPopup.then(function (res) {
				if (res) {
					console.log('You are sure');
					//$scope.removeSeveralSessions($scope.sessionsSelected);
					$scope.removeStudent(student);
				} else {
					console.log('You are not sure');
				}
			});
		};

		$scope.removeStudent = function (student) {

			document.getElementById('hdr-student-item' + student.id).classList.add("ng-hide");
			$scope.itemSelected = false;
			var studentIndex = $scope.classroom.students.indexOf(student);
			//remove student from students array
			$scope.classroom.students.splice(studentIndex, 1);
			for (var index = 0; index < $scope.classroom.students.length; index++) {
				$scope.classroom.students[index].queuing_number = index + 1;

			}
			//update students in localstorage
			var classroomIndex = $rootScope.classrooms_view.indexOf($scope.classroom);
			$rootScope.classrooms_view[classroomIndex] = $scope.classroom
			$window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);

			//update students in db
			hdrdbx.removeStudentFromClassroom(student, $scope.classroom)
				.then(function () {
					$rootScope.isDBchanged = true;
				})

		}



		$scope.upStudentinList = function (student) {

			var studentIndex = $scope.classroom.students.indexOf(student);

			var studentBefore = $scope.classroom.students[studentIndex - 1];
			$scope.classroom.students[studentIndex - 1] = $scope.classroom.students[studentIndex];
			$scope.classroom.students[studentIndex] = studentBefore;

			$scope.classroom.students[studentIndex].queuing_number += 1;
			$scope.classroom.students[studentIndex - 1].queuing_number -= 1;


			if (studentIndex == 1) {
				$scope.isFirstStudent = true;
			} else {
				$scope.isFirstStudent = false;
			}
			if (studentIndex == $scope.classroom.students.length - 2) {
				$scope.isLastStudent = true;
			}
			else {
				$scope.isLastStudent = false;
			}

			if (ionic.Platform.isWebView()) {

				hdrdbx.updateStudentsQNinStudentof($scope.classroom)
					.then(function () {
						$rootScope.isDBchanged = true;
					})
			}

			var classroomIndex = $rootScope.classrooms_view.indexOf($scope.classroom);
			$rootScope.classrooms_view[classroomIndex] = $scope.classroom
			$window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);


		}

		$scope.downStudentinList = function (student) {
			var studentIndex = $scope.classroom.students.indexOf(student);

			var studentAfter = $scope.classroom.students[studentIndex + 1];
			$scope.classroom.students[studentIndex + 1] = $scope.classroom.students[studentIndex];
			$scope.classroom.students[studentIndex] = studentAfter;

			$scope.classroom.students[studentIndex].queuing_number -= 1;
			$scope.classroom.students[studentIndex + 1].queuing_number += 1;


			if (studentIndex == 0) {
				$scope.isFirstStudent = true;
			} else {
				$scope.isFirstStudent = false;
			}

			if (studentIndex == $scope.classroom.students.length - 2) {
				$scope.isLastStudent = true;
			}
			else {
				$scope.isLastStudent = false;
			}

			if (studentIndex == 1) {
				$scope.isFirstStudent = true;
			} else {
				$scope.isFirstStudent = false;
			}

			if (ionic.Platform.isWebView()) {

				hdrdbx.updateStudentsQNinStudentof($scope.classroom)
					.then(function () {
						$rootScope.isDBchanged = true;
					})
			}

			var classroomIndex = $rootScope.classrooms_view.indexOf($scope.classroom);
			$rootScope.classrooms_view[classroomIndex] = $scope.classroom
			$window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);

		}

		$scope.student = {
			id: null,
			full_name: "",
			registration_number: "",
			massar_number: '',
			birth_date: "",
			queuing_number: "",
			observation: "",
			id_classroom: null
		};


		var toMassarFormat = function (dateObj) {
			var str = "";
			if (dateObj) {

				var dd = parseInt(dateObj.getDate());
				var mm = parseInt(dateObj.getMonth() + 1);
				var yyyy = dateObj.getFullYear();

				if (dd <= 9)
					dd = "0" + dd;

				if (mm <= 9)
					mm = "0" + mm;

				str = dd + "/" + mm + "/" + yyyy;

			}
			return str;
		}

		$scope.addStudent = function (revenantStudentFlag) {

			//new student
			if (revenantStudentFlag == false) {
				var student = {
					id: null,
					full_name: $scope.student.full_name,
					registration_number: "",
					massar_number: '',
					birth_date: toMassarFormat($scope.student.birth_date),
					queuing_number: $scope.classroom.students.length + 1,
					observation: $scope.student.observation,
					isBarred: 0,
					id_classroom: $scope.classroom.id
				};


				if (student.full_name.length > 3) {
					//if full_name contain more thant 3 caracters

					if (ionic.Platform.isWebView()) {


						console.log(student);

						hdrdbx.insertRow('student', student)
							.then(function (insertedStudent) {
								var newStudent = insertedStudent;
								newStudent.massar_number = insertedStudent.id;

								console.log("new Student");
								console.log(newStudent);

								hdrdbx.updateStudent(insertedStudent, newStudent)
									.then(function () {
										alert("تمت إضافة التلميذ بنجاح.");
										$rootScope.isDBchanged = true;
										//push newStudent to $scope.classroom.students
										$scope.classroom.students.push(newStudent);

										var classroomIndex = $rootScope.classrooms_view.indexOf($scope.classroom);
										$rootScope.classrooms_view[classroomIndex] = $scope.classroom
										$window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);

										//update queuing_number in absenceline table by the new value
										//hdrdbx.updateAbsenceLine("queuing_number", insertedStudent.queuing_number, " massar_number ='" + student.massar_number + "'");

										$scope.closeModal();
										document.getElementById("hdr-add-student-name").value = "";

										$ionicScrollDelegate.scrollBottom(true);

										$timeout(function () {
											$scope.selectElement(insertedStudent);
										}, 250);

									}, function (err) {
										console.log(err);
									});
							}, function (err) { });

					}

				}
				else {
					alert("الإسم غير كامل..");
				}
			}
			// student revenant
			else {
				var revenantStudent = $scope.selectedStudent;
				revenantStudent.id_classroom = $scope.classroom.id;
				revenantStudent.queuing_number = parseInt($scope.classroom.students.length + 1);
				hdrdbx.updateStudent($scope.selectedStudent, revenantStudent)
					.then(function (count) {

						$rootScope.isDBchanged=true;
						$scope.classroom.students.push(revenantStudent);
						var classroomIndex = $rootScope.classrooms_view.indexOf($scope.classroom);
						$rootScope.classrooms_view[classroomIndex] = $scope.classroom
						$window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);

						$scope.closeModal();
						$ionicScrollDelegate.scrollBottom(true);

						$timeout(function () {
							$scope.selectElement(revenantStudent);
						}, 250);

						console.log("student has been updated succefully..")
					}, function (err) {
						console.log("Error while updating student")
						console.log(err);
					});
			}
		}

		//model for add a new student
		$ionicModal.fromTemplateUrl('addstudentmodal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modal = modal;
		});

		$scope.openModal = function () {
			$scope.modal.show();


			hdrdbx.selectRows('student', 'id_classroom is null')
				.then(function (students) {
					console.log("Removed students :");
					console.log(students);
					$scope.removedStudents = students;
				}, function (err) {
					console.log(err);
				});

			$scope.selectElement($scope.selectedStudent);
		};

		$scope.closeModal = function () {
			$scope.modal.hide();
			$scope.selectElement($scope.selectedStudent);
		};

		$scope.showHelpPopup = function () {
			var template = "";
			template = "<img src='img/hdr-classroomhelp.png' style='width:100%' />";

			var helpPopup = $ionicPopup.show({
				/* templateUrl: "views/sessionshistory/helpsessionshistoryview.html", */
				template: template,
				title: '<h3 class="title assertive-bg padding light" >دليل الإستخدام</h3>',
				subTitle: '',
				scope: $scope,
				buttons: [
					{
						text: 'رجوع',
						type: 'button',
						onTap: function (e) {
							//e.preventDefault();-
						}
					}
				]
			});
		};



		if (ionic.Platform.isWebView()) {
			$scope.classroom = $filter('filter')($rootScope.classrooms_view, $stateParams.classroom_title)[0];

			hdrdbx.getStudentsAbsencesCount($scope.classroom.title)
				.then(function (arr) {
					console.log(arr);
					for (var i = 0; i < arr.length; i++) {
						$scope.classroom.students[arr[i].queuing_number - 1].times = new Array(arr[i].absences_count);
					}


				}, function (err) {
					console.log(err);
				});


		}
		else {
			//console.log(" controller  " + $scope.classroom.title);

			$scope.classroom = $filter('filter')($rootScope.classrooms_view, $stateParams.classroom_title)[0];
			$scope.removedStudents = $scope.classroom.students;
		}
	})