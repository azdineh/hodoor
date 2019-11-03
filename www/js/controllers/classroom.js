angular.module('hdrApp')
	.controller('ClassroomController', function ($scope, $ionicPopup, $ionicScrollDelegate,
		$ionicModal, $stateParams, $timeout, hdrlocalstorage) {



		$scope.itemSelected = false;
		$scope.isFirstStudent = false;
		$scope.isLastStudent = false;
		$scope.selectedStudent = {};

		$scope.countStudent = 0;



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



			//var studentIndex = $scope.classroom.students.indexOf(student);
			var studentIndex = student.queuing_number - 1;
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

			$scope.countStudent--;
			$scope.header_title = "<span>قسم</span> : " + "<span>" + $scope.classroom.title + "</span>" + " <sub>" + $scope.countStudent + "</sub>";

			hdrlocalstorage.removeStudent($scope.classroom.students[studentIndex]);

		}



		$scope.upStudentinList = function (student) {

			var studentBefore = $scope.classroom.students[$scope.classroom.students.indexOf(student) - 1];

			var currentStudentIndex = $scope.classroom.students.indexOf(student);

			student.queuing_number--;
			$scope.classroom.students[currentStudentIndex - 1] = student;
			hdrlocalstorage.updateStudent(student);

			studentBefore.queuing_number++;
			$scope.classroom.students[currentStudentIndex] = studentBefore;
			hdrlocalstorage.updateStudent(studentBefore);


			if ($scope.index_of_selected_student == 0) {
				$scope.isFirstStudent = true;
			} else {
				$scope.isFirstStudent = false;
			}
			if ($scope.index_of_selected_student == $scope.classroom.students.length - 1) {
				$scope.isLastStudent = true;
			}
			else {
				$scope.isLastStudent = false;
			}

		}

		$scope.downStudentinList = function (student) {

			var studentAfter = $scope.classroom.students[$scope.classroom.students.indexOf(student) + 1];
			var currentStudentIndex = student.queuing_number - 1;

			student.queuing_number++;
			$scope.classroom.students[currentStudentIndex + 1] = student;
			hdrlocalstorage.updateStudent(student);

			studentAfter.queuing_number--;
			$scope.classroom.students[currentStudentIndex] = studentAfter;
			hdrlocalstorage.updateStudent(studentAfter);


			if ($scope.index_of_selected_student == 0) {
				$scope.isFirstStudent = true;
			} else {
				$scope.isFirstStudent = false;
			}

			if ($scope.index_of_selected_student == $scope.classroom.students.length - 1) {
				$scope.isLastStudent = true;
			}
			else {
				$scope.isLastStudent = false;
			}

			if ($scope.index_of_selected_student == 0) {
				$scope.isFirstStudent = true;
			} else {
				$scope.isFirstStudent = false;
			}


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
					id: Date.now(),  //use like a unique number
					full_name: $scope.student.full_name,
					registration_number: "",
					massar_number: 0,
					birth_date: toMassarFormat($scope.student.birth_date),
					queuing_number: $scope.classroom.students.length,
					observation: $scope.student.observation,
					isBarred: 0,
					id_classroom: $scope.classroom.title
				};
				student.massar_number = student.id; // id and massar_number are the same


				if (student.full_name.length > 3) {
					//if full_name contain more thant 3 caracters


					hdrlocalstorage.addStudent(student, $scope.classroom.students.length);

					$scope.countStudent++;
					$scope.header_title = "<span>قسم</span> : " + "<span>" + $scope.classroom.title + "</span>" + " <sub>" + $scope.countStudent + "</sub>";
					$timeout(function () {
						alert("تمت إضافة التلميذ بنجاح.");

						$scope.closeModal();
						document.getElementById("hdr-add-student-name").value = "";

						$ionicScrollDelegate.scrollBottom(true);

						$timeout(function () {
							$scope.selectElement(student);
						}, 250);
					}, 50)


				}
				else {
					alert("الإسم غير كامل..");
				}
			}
			// student revenant
			else {
				var revenantStudent = $scope.selectedStudent;
				revenantStudent.id_classroom = $scope.classroom.title;
				revenantStudent.queuing_number = $scope.classroom.students.length;
				//revenantStudent.birth_date="2000-01-01";

				//insert new student in the last

				hdrlocalstorage.addStudent(revenantStudent, $scope.classroom.students.length);

				$scope.closeModal();

				$ionicScrollDelegate.scrollBottom(true);

				$timeout(function () {
					$scope.selectElement(revenantStudent);
				}, 250);




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
			$scope.removedStudents = hdrlocalstorage.removed_students;

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
			$scope.classroom = hdrlocalstorage.getStudentClassroom({ id_classroom: $stateParams.classroom_title });
			//$scope.classroom = $filter('filter')($rootScope.classrooms_view, $stateParams.classroom_title)[0];
			$scope.countStudent = $scope.classroom.students.length;
			$scope.header_title = "<span>قسم</span> : " + "<span>" + $scope.classroom.title + "</span>" + " <sub>" + $scope.countStudent + "</sub>";

		}
		else {
			//console.log(" controller  " + $scope.classroom.title);
			$scope.classroom = {
				id: "1",
				color: "",
				title: "TCS4",
				level: "جذع مشترك علمي",
				students: [{ id: '1', full_name: "عمر فيلالي", queuing_number: "10" }, { id: '2', full_name: "كريم زرهوني", queuing_number: "12" }, { id: '3', full_name: "سفياني بدر", queuing_number: "22" }]
			}

			$scope.header_title = "<span>قسم</span> : " + "<span>" + $scope.classroom.title + "</span>" + " <sub>" + $scope.classroom.students.length + "</sub>";

			$scope.removedStudents = $scope.classroom.students;
		}
	})