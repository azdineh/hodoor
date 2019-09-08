angular.module('hdrApp')
	.controller('AppealController', function ($scope, $window, $stateParams, $rootScope, $filter, $ionicPopup, $ionicActionSheet,
		$ionicModal, hdrdbx, $timeout, $state) {

		//$rootScope.today already defined in home controller
		//$scope.classroom = $stateParams.classroom;
		console.log($stateParams.classroom);
		$scope.classroom = $filter('filter')($rootScope.classrooms_view, { 'title': $stateParams.classroom.title })[0];
		$scope.classroom.students = $filter('orderBy')($scope.classroom.students, "queuing_number");
		//$scope.classroom presnet classroom_view


		$scope.choiceIndexOfFastCase = $stateParams.index;


		$scope.isFirstSlide = true;
		$scope.isLastSlide = false;

		$scope.numOfSlides = 0;
		$scope.catchedSessions = [];
		$rootScope.absentStudents = [];
		/** @param this param is for be allimented in dr-student-card-appeal directive*/
		$scope.hdriterator = "all";
		$scope.pagename = $scope.choiceIndexOfFastCase == '-1' ? "نداء القسم" : "القسم";

		$scope.studentsByGroup = [];

		$scope.helpPopupShown = $window.localStorage['hdr.helpPopupShown'] ? angular.fromJson($window.localStorage['hdr.helpPopupShown']) : 0;

		/**
		* @description return session title array like 14-15, 15-16
		* it catch the session according to the current system time.
		* @return array session title [4-3 , 4-2] or [9-8,10-9]
		*/


		//$scope.currentUnixtTime = 0;
		//$scope.currentUnixtTime = Date.now();
		$scope.catchSessionBegin = function () {
			var h = new String($filter('date')(Date.now(), 'HH'));
			var dt = new Date();
			dt.setHours(h);
			dt.setMinutes(0);
			$scope.currentUnixtTime = dt.getTime();
			//console.log("current short time :" + shortTime);
		}

		$scope.upCurrentTimeUnixBy_30minutes = function () {
			$scope.currentUnixtTime += 1000 * 60 * 30;
		}
		$scope.downCurrentTimeUnixBy_30minutes = function () {
			$scope.currentUnixtTime -= 1000 * 60 * 30;
		}



		$scope.groups = ["all", "odd", "even"];
		$scope.currentGroup = "all";

		$scope.nextGroup = function () {
			var currentIndex = $scope.groups.indexOf($scope.currentGroup);

			if (currentIndex == $scope.groups.length - 1) {
				$scope.currentGroup = $scope.groups[0];
			} else {
				$scope.currentGroup = $scope.groups[currentIndex + 1];
			}


			$rootScope.absentStudents = [];

			$timeout(function () {
				var itmes = document.getElementsByClassName("hdr-slider-item");
				var lastItem = itmes[itmes.length - 1];
				console.log(lastItem);
				console.log("Left of last Item :" + lastItem.offsetLeft);

				$scope.leftOfLastItem = lastItem.offsetLeft;
			}, 250)


		};

		$scope.byGroupfilter = function (input, index) {
			var flag = false;

			if ($scope.currentGroup == 'even') {
				flag = (index + 1) % 2 === 0
			}
			if ($scope.currentGroup == 'odd') {
				flag = (index + 1) % 2 === 1
			}
			if ($scope.currentGroup == 'all') {
				flag = true;
			}

			return flag;
		}


		var getOffsetLeft = function (id) {
			var elm = document.getElementById(id);
			return elm.offsetLeft;
		}

		$scope.swipeRight = function () {

			if (!$scope.isLastSlide) {
				var hdrslider = document.getElementById("hdr-slider-container");


				hdrslider.style.left = hdrslider.offsetLeft + hdrslider.clientWidth - 22 + "px";

				var str_tmp = new String(hdrslider.style.left);
				var leftasInt = Math.abs(parseInt(str_tmp.substr(0, str_tmp.length - 2)));

				$scope.isFirstSlide = false;

				if (leftasInt >= Math.abs($scope.leftOfLastItem)) {
					$scope.isLastSlide = true;
				}
				else {
					$scope.isLastSlide = false;
				}
				console.log("Left :" + leftasInt);
			}

		}

		$scope.swipeLeft = function () {
			if (!$scope.isFirstSlide) {
				var hdrslider = document.getElementById("hdr-slider-container");
				/* var slideritem=document.getElementsByClassName("hdr-slider-item").item(0); */
				hdrslider.style.left = hdrslider.offsetLeft - hdrslider.clientWidth + 22 + "px";
				console.log("Swipe left");

				var str_tmp = new String(hdrslider.style.left);
				var leftasInt = parseInt(str_tmp.substr(0, str_tmp.length - 2));

				$scope.isLastSlide = false;

				if (leftasInt == 0) {
					$scope.isFirstSlide = true;
				}
				else {
					$scope.isFirstSlide = false;
				}
				console.log("Left :" + leftasInt);

			}
			//var slideritem = document.getElementsByClassName("hdr-slider-item")[0];
		}

		$scope.$on('$ionicView.enter', function () {

			var itmes = document.getElementsByClassName("hdr-slider-item");
			var lastItem = itmes[itmes.length - 1];
			console.log(lastItem);
			console.log("Left of last Item :" + lastItem.offsetLeft);

			$scope.leftOfLastItem = lastItem.offsetLeft;
		});

		if (ionic.Platform.isWebView()) {

			$scope.$on('$ionicView.beforeEnter', function () {
			})


		} else {
			$scope.classroom.students = [];
			$scope.classroom.students.push({ id: '1', full_name: 'ن ننننن ننن ننن كريم فيلالي', registration_number: '159986', massar_number: "S12345687", birth_date: "12/01/2000", queuing_number: '1' });
			$scope.classroom.students.push({ id: '2', full_name: 'مريم يعقوبي', registration_number: '159986', massar_number: "S12345687", birth_date: "12/02/2000", queuing_number: '2' });
			$scope.classroom.students.push({ id: '3', full_name: 'عزيز ملوكي', registration_number: '159986', massar_number: "S12345687", birth_date: "04/08/1986", queuing_number: '3' });
			$scope.classroom.students.push({ id: '4', full_name: 'سناء عكرود', registration_number: '159986', massar_number: "S12345687", birth_date: "12/04/2000", queuing_number: '4' });
			$scope.classroom.students.push({ id: '5', full_name: 'لحبيب نظيف', registration_number: '159986', massar_number: "S12345687", birth_date: "12/05/2000", queuing_number: '5', observation: 'حماسي..' });
			$scope.classroom.students.push({ id: '6', full_name: 'كبور سميرس', registration_number: '159986', massar_number: "S12345687", birth_date: "12/06/2000", queuing_number: '6' });
			$scope.classroom.students.push({ id: '7', full_name: 'بوكيمون لزعر', registration_number: '159986', massar_number: "S12345687", birth_date: "12/07/2000", queuing_number: '7' });
			$scope.classroom.students.push({ id: '8', full_name: 'عبدو فريد', registration_number: '159986', massar_number: "S12345687", birth_date: "12/08/2000", queuing_number: '8' });
			$scope.classroom.students.push({ id: '9', full_name: 'يسرى منال', registration_number: '159986', massar_number: "S12345687", birth_date: "12/09/2000", queuing_number: '9' });
			$scope.classroom.students.push({ id: '10', full_name: 'خولة لحمر', registration_number: '159986', massar_number: "S12345687", birth_date: "15/10/1998", queuing_number: '10' });
			$scope.classroom.students.push({ id: '11', full_name: 'مريم يعقوبي', registration_number: '159986', massar_number: "S12345687", birth_date: "12/02/2000", queuing_number: '11' });
			$scope.classroom.students.push({ id: '12', full_name: 'عزيز ملوكي', registration_number: '159986', massar_number: "S12345687", birth_date: "04/08/1986", queuing_number: '12' });
			$scope.classroom.students.push({ id: '13', full_name: 'سناء عكرود', registration_number: '159986', massar_number: "S12345687", birth_date: "12/04/2000", queuing_number: '13' });
			$scope.classroom.students.push({ id: '14', full_name: 'لحبيب نظيف', registration_number: '159986', massar_number: "S12345687", birth_date: "12/05/2000", queuing_number: '14' });
			$scope.classroom.students.push({ id: '15', full_name: 'كبور سميرس', registration_number: '159986', massar_number: "S12345687", birth_date: "12/06/2000", queuing_number: '15' });
			$scope.classroom.students.push({ id: '16', full_name: 'بوكيمون لزعر', registration_number: '159986', massar_number: "S12345687", birth_date: "12/07/2000", queuing_number: '16' });
			$scope.classroom.students.push({ id: '17', full_name: 'عبدو فريد', registration_number: '159986', massar_number: "S12345687", birth_date: "12/08/2000", queuing_number: '17' });
			$scope.classroom.students.push({ id: '18', full_name: 'يسرى منال', registration_number: '159986', massar_number: "S12345687", birth_date: "12/09/2000", queuing_number: '18' });
			$scope.classroom.students.push({ id: '19', full_name: 'يسرى منال', registration_number: '159986', massar_number: "S12345687", birth_date: "12/09/2000", queuing_number: '18' });
			$scope.classroom.students.push({ id: '20', full_name: 'يسرى منال', registration_number: '159986', massar_number: "S12345687", birth_date: "12/09/2000", queuing_number: '18' });
			$scope.classroom.students.push({ id: '21', full_name: 'يسرى منال', registration_number: '159986', massar_number: "S12345687", birth_date: "12/09/2000", queuing_number: '18' });

		}


		$scope.even = function (input, index) { return (input.queuing_number) % 2 === 0 };
		$scope.odd = function (input, index) { return (input.queuing_number) % 2 === 1 };
		//$scope.all = function (input, index) { return true };

		$scope.showPopup = function (index) {

			$scope.catchSessionBegin();
			$scope.data = {
				choice: $scope.catchedSessions[0]
			};

			// An elaborate, custom popup
			var appealPopup = $ionicPopup.show({
				templateUrl: "views/classrooms/appeal/absentstudentsview.html",
				title: 'التلاميذ المتغيبون : ' + $scope.classroom.title,
				/* subTitle: $rootScope.today, */
				subTitle: $filter('date')($rootScope.today, 'fullDate'),
				scope: $scope,
				buttons: [
					{
						text: 'رجوع',
						type: 'button',
						onTap: function (e) {
							if (index == -1) {
							}
							else {
								$state.go('tab.classrooms');
							}
							//e.preventDefault();
						}
					},
					{
						text: 'حفظ',
						type: 'button-assertive',
						onTap: function (e) {
							//console.log($scope.data.choice);

							// all students are absents
							if (index == 1) {
								if ($scope.currentGroup == "all") {
									$rootScope.absentStudents = $scope.classroom.students;
								}
								// impairs
								if ($scope.currentGroup == "odd") {
									$rootScope.absentStudents = $scope.classroom.students.filter($scope.odd);
								}
								//pairs
								if ($scope.currentGroup == "even") {
									$rootScope.absentStudents = $scope.classroom.students.filter($scope.even);
								}
							}

							$scope.saveSession(function () {
								$rootScope.isDBchanged = true;
								$state.go('tab.classrooms');
							});
							//e.preventDefault();
						}
					}
				]
			});
			$timeout(function () {
				$scope.selectSessionDuration("1");
			}, 50);
		};

		$scope.showActionSheet = function (student) {

			var shoteba_btn = "تشطيب";
			if (student.isBarred == 1) {
				shoteba_btn = "إزالة التشطيب";
			}
			// Show the action sheet
			var hideSheet = $ionicActionSheet.show({
				buttons: [
					{ text: '<div class="list"><a class="item hdr-to-right" href="#">' + shoteba_btn + '</a></div>' },
					{ text: '<div class="list"><a class="item hdr-to-right" href="#">حذف</a></div>' },
					{ text: '<div class="list"><a class="item hdr-to-right" href="#">إضافة تلميذ بعد</a></div>' },
					{ text: '<div class="list"><a class="item hdr-to-right" href="#">تغيير الترتيب</a></div>' },
					{ text: '<div class="list"><a class="item hdr-to-right" href="#">إطلاع على البطاقة</a></div>' }
				],
				titleText: '<div><div class="hdr-to-right positive hdr-main-text"> التلميذ : ' + student.full_name + '<b> رقم : ' + $filter('hdrnumber')(student.queuing_number) + '</b></div><div class="hdr-to-right hdr-sub-text">: حدد العملية للإنجاز </div></div>',
				buttonClicked: function (index) {
					//$scope.startAttendanceCall(classroom, index);
					//shoteba
					if (index == 0) {
						//update students in localstorage
						var studentIndex = $scope.classroom.students.indexOf(student);

						if (student.isBarred == 1) {
							$scope.classroom.students[studentIndex].isBarred = 0;
							hdrdbx.updateStudentIsBarred(student, 0);
						}
						else {
							$scope.classroom.students[studentIndex].isBarred = 1;
							hdrdbx.updateStudentIsBarred(student, 1);
						}
						var classroomIndex = $rootScope.classrooms_view.indexOf($scope.classroom);
						$rootScope.classrooms_view[classroomIndex] = $scope.classroom
						$window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);
					}
					//removed
					if (index == 1) {
						$scope.showConfirm_for_removeStudent(student);
					}
					//add after
					if (index == 2) {
						$scope.index_of_selected_student = $scope.classroom.students.indexOf(student);
						$scope.openModal_for_addStudent(student);
					}
					//move it
					if (index == 3) {
						$scope.index_of_selected_student = $scope.classroom.students.indexOf(student);
						$scope.afterInsertEffectAnim($scope.classroom.students[$scope.index_of_selected_student]);
						$scope.showUpDwonControll();
					}
					//to student information
					if (index == 4) {
						//$scope.index_of_selected_student = $scope.classroom.students.indexOf(student);
						$state.go('tab.student', { 'student': student, 'classroom': { 'title': $scope.classroom.title } });
					}
					return true;
				}
			});


		};

		$scope.showHelpPopup = function () {
			var helpPopup = $ionicPopup.show({
				templateUrl: "views/classrooms/appeal/helpappealview.html",
				title: '<h3 class="title assertive-bg padding light" >دليل الإستخدام</h3>',
				subTitle: '',
				scope: $scope,
				buttons: [
					{
						text: 'رجوع للنداء',
						type: 'button',
						onTap: function (e) {
							//e.preventDefault();
						}
					}
				]
			});
		};


		//confirm for remove student
		$scope.showConfirm_for_removeStudent = function (student) {
			var template = "";
			//template = '<p dir="rtl"><b>' + student.full_name + '</b></p><p dir="rtl">هل أنت متأكد من حذف التلميذ(ة) ؟</p>';
			template = '<div><div class="hdr-to-right positive hdr-main-text"> التلميذ : ' + student.full_name + '<b> رقم : ' + $filter('hdrnumber')(student.queuing_number) + '</b></div><div class="hdr-to-right hdr-sub-text">: حدد العملية للإنجاز </div></div>';

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

			/* document.getElementById('hdr-student-item' + student.id).classList.add("ng-hide");
			$scope.itemSelected = false; */
			var studentIndex = $scope.classroom.students.indexOf(student);
			//remove student from students array
			$scope.classroom.students.splice(studentIndex, 1);

			//if marked as absent, remove from absentStudents
			$rootScope.absentStudents.splice($rootScope.absentStudents.indexOf(student), 1);

			//recalculate queuing_numbers
			for (var index = 0; index < $scope.classroom.students.length; index++) {
				$scope.classroom.students[index].queuing_number = index + 1;

			}
			//update students in localstorage
			var classroomIndex = $rootScope.classrooms_view.indexOf($scope.classroom);
			$rootScope.classrooms_view[classroomIndex] = $scope.classroom
			$window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);

			//update students in db
			if (ionic.Platform.isWebView()) {
				hdrdbx.removeStudentFromClassroom(student, $scope.classroom)
					.then(function () {
						$rootScope.isDBchanged = true;
					})

			}

			//removing student provoks --> recalculate width of slider
			$timeout(function () {
				var itmes = document.getElementsByClassName("hdr-slider-item");
				var lastItem = itmes[itmes.length - 1];
				console.log(lastItem);
				console.log("Left of last Item :" + lastItem.offsetLeft);

				$scope.leftOfLastItem = lastItem.offsetLeft;
			}, 250)


		}

		$scope.afterInsertEffectAnim = function (student) {
			document.getElementById("student-item-card-" + student.id).classList.add("insertEffect");
			$timeout(function () {
				document.getElementById("student-item-card-" + student.id).classList.remove("insertEffect");
			}, 500)
		}

		$scope.updownControlshwon = false;
		$scope.hideUpDwonControll = function () {
			$scope.updownControlshwon = false;
		}
		$scope.showUpDwonControll = function () {
			$scope.updownControlshwon = true;

			if ($scope.index_of_selected_student == 0) {
				$scope.isFirstStudent = true;
			} else {
				$scope.isFirstStudent = false;
			}

			if ($scope.index_of_selected_student == $scope.classroom.students.length - 1) {
				$scope.isLastStudent = true;
			}
		}

		$scope.upStudentinList = function () {

			var studentBefore = $scope.classroom.students[$scope.index_of_selected_student - 1];
			$scope.classroom.students[$scope.index_of_selected_student - 1] = $scope.classroom.students[$scope.index_of_selected_student];
			$scope.classroom.students[$scope.index_of_selected_student] = studentBefore;

			$scope.classroom.students[$scope.index_of_selected_student].queuing_number++;
			$scope.classroom.students[$scope.index_of_selected_student - 1].queuing_number--;


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

			if (ionic.Platform.isWebView()) {

				hdrdbx.updateStudentsQNinStudentof($scope.classroom)
					.then(function () {
						$rootScope.isDBchanged = true;
					})
			}

			var classroomIndex = $rootScope.classrooms_view.indexOf($scope.classroom);
			$rootScope.classrooms_view[classroomIndex] = $scope.classroom
			$window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);

			$scope.index_of_selected_student--;
			$scope.afterInsertEffectAnim($scope.classroom.students[$scope.index_of_selected_student]);

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

		$scope.downStudentinList = function () {

			var studentAfter = $scope.classroom.students[$scope.index_of_selected_student + 1];
			$scope.classroom.students[$scope.index_of_selected_student + 1] = $scope.classroom.students[$scope.index_of_selected_student];
			$scope.classroom.students[$scope.index_of_selected_student] = studentAfter;

			$scope.classroom.students[$scope.index_of_selected_student].queuing_number--;
			$scope.classroom.students[$scope.index_of_selected_student + 1].queuing_number++;


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

			if (ionic.Platform.isWebView()) {

				hdrdbx.updateStudentsQNinStudentof($scope.classroom)
					.then(function () {
						$rootScope.isDBchanged = true;
					})
			}

			var classroomIndex = $rootScope.classrooms_view.indexOf($scope.classroom);
			$rootScope.classrooms_view[classroomIndex] = $scope.classroom
			$window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);

			$scope.index_of_selected_student++;
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

			$scope.afterInsertEffectAnim($scope.classroom.students[$scope.index_of_selected_student]);

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

		$scope.addStudent = function (revenantStudentFlag, addPosition) {

			//new student
			if (revenantStudentFlag == false) {

				var student = {
					id: null,
					full_name: $scope.student.full_name,
					registration_number: "",
					massar_number: '',
					birth_date: toMassarFormat($scope.student.birth_date),
					queuing_number: '',
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
										//$scope.classroom.students.push(newStudent);
										if (addPosition == "after") {
											//insert new student in the given position
											$scope.classroom.students.splice($scope.index_of_selected_student + 1, 0, newStudent);

											//recalculate the queuing_numbers
											$scope.classroom.students.forEach(function (student, index) {
												student.queuing_number = index + 1;
											}, this);

											// recalculate slider width
											$timeout(function () {
												var itmes = document.getElementsByClassName("hdr-slider-item");
												var lastItem = itmes[itmes.length - 1];
												console.log(lastItem);
												console.log("Left of last Item :" + lastItem.offsetLeft);

												$scope.leftOfLastItem = lastItem.offsetLeft;
											}, 250)

										}

										var classroomIndex = $rootScope.classrooms_view.indexOf($scope.classroom);
										$rootScope.classrooms_view[classroomIndex] = $scope.classroom
										$window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);

										//upadte queuing_number in db
										hdrdbx.updateStudentsQNinStudentof($scope.classroom)
											.then(function (res) {

												//hdrdbx.updateAbsenceLine("queuing_number", 0, " massar_number ='" + student.massar_number + "'");
												$scope.closeModal();
												document.getElementById("hdr-add-student-name").value = "";

												$timeout(function () {
													$scope.afterInsertEffectAnim(insertedStudent);
												}, 250);

											})

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

				// set the queuing_number to the student for save it in the db
				revenantStudent.queuing_number = parseInt($scope.index_of_selected_student + 1 + 1);
				hdrdbx.updateStudent($scope.selectedStudent, revenantStudent)
					.then(function (count) {

						$rootScope.isDBchanged = true;
						if (addPosition == "after") {
							//insert new student in the given position
							$scope.classroom.students.splice($scope.index_of_selected_student + 1, 0, revenantStudent);

							//recalculate the queuing_numbers for the classroom.students
							$scope.classroom.students.forEach(function (student, index) {
								student.queuing_number = index + 1;
							}, this);

						}

						var classroomIndex = $rootScope.classrooms_view.indexOf($scope.classroom);
						$rootScope.classrooms_view[classroomIndex] = $scope.classroom
						$window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);


						$scope.closeModal();

						$timeout(function () {
							$scope.afterInsertEffectAnim(revenantStudent);
						}, 250);

						// recalculate slider width
						$timeout(function () {
							var itmes = document.getElementsByClassName("hdr-slider-item");
							var lastItem = itmes[itmes.length - 1];
							console.log(lastItem);
							console.log("Left of last Item :" + lastItem.offsetLeft);

							$scope.leftOfLastItem = lastItem.offsetLeft;
						}, 250)

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

		$scope.openModal_for_addStudent = function (student) {
			$scope.modal.show();


			hdrdbx.selectRows('student', 'id_classroom is null')
				.then(function (students) {
					console.log("Removed students :");
					console.log(students);
					$scope.removedStudents = students;
				}, function (err) {
					console.log(err);
				});

			//$scope.selectElement($scope.selectedStudent);
		};

		$scope.closeModal = function () {
			$scope.modal.hide();
			//$scope.selectElement($scope.selectedStudent);
		};

		$scope.isFirstStudent = false;
		$scope.isLastStudent = false;
		$scope.isNewStudent = true;
		$scope.selectedStudent = {};

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


		$scope.$on('$ionicView.afterEnter', function () {



			if ($scope.choiceIndexOfFastCase == '-1') {

				if ($scope.helpPopupShown <= 1) {
					$timeout(function () {
						$scope.showHelpPopup();
					}, 50);



					$scope.helpPopupShown += 1;
					$window.localStorage['hdr.helpPopupShown'] = angular.toJson($scope.helpPopupShown);
				}

			}
			else {
				$scope.showPopup($scope.choiceIndexOfFastCase);

				$timeout(function () {
					$scope.selectSessionParity("all");

				}, 50);

			}



		});


		$scope.saveSession = function (callback) {
			var session = {
				id: null,
				id_classroom: $scope.classroom.id,
				classroom_title: $scope.classroom.title,
				id_teacher: 1,
				unix_time: Date.now(),
				title: $scope.sessionDurationSelected = $filter('date')($scope.currentUnixtTime + 1000 * 60 * 60 * $scope.sessionDurationSelected, 'HH:mm') + "-" + $filter('date')($scope.currentUnixtTime, 'HH:mm'),
				students_count: $scope.classroom.students.length,
				parity: $scope.currentGroup,
				isExamSession: 0,
				observation: ""

			}

			console.log('session : ' + session.title);
			session.isExamSession = $scope.data.isExamSession == true ? 1 : 0;

			console.log("Current parity: " + session.parity);

			/* 			if ($rootScope.absentStudents.length == 0) {
							session.observation = "لم يتغيب أحد.";
						}
						if ($rootScope.absentStudents.length == $scope.classroom.students.length) {
							session.observation = "غياب جماعي.";
						} */


			hdrdbx.saveAbsentStudents(session, $rootScope.absentStudents)
				.then(function (count) {
					console.log('save ' + count + ' absent students is done');
					//$rootScope.absentStudents = [];
					//$scope.data.isExamSession = false;
					alert("تم تسجيل الحصة بنجاح.");
					callback();
				}, function (err) {
					console.log(err);
				});
		}

		$scope.selectSessionParity = function (id) {
			if (id == "all") {
				document.getElementById("hdr-parity-odd").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-parity-even").style.backgroundColor = "rgb(212, 223, 206)";
				$scope.currentGroup = "all";
			}
			if (id == "odd") {
				document.getElementById("hdr-parity-all").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-parity-even").style.backgroundColor = "rgb(212, 223, 206)";
				$scope.currentGroup = "odd";
			}
			if (id == "even") {
				document.getElementById("hdr-parity-all").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-parity-odd").style.backgroundColor = "rgb(212, 223, 206)";
				$scope.currentGroup = "even";
			}

			var elm = document.getElementById("hdr-parity-" + id);
			var initbgColor = elm.style.backgroundColor;
			elm.style.backgroundColor = "rgb(114, 241, 41)";

			/* if (elm.style.backgroundColor == "rgb(114, 241, 41)") {
			}
			else {
				elm.style.backgroundColor = "rgb(114, 241, 41)";
			} */

		}

		$scope.selectSessionDuration = function (id) {
			if (id == "1") {
				document.getElementById("hdr-session-duration-2").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-session-duration-3").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-session-duration-4").style.backgroundColor = "rgb(212, 223, 206)";
				$scope.sessionDurationSelected = 1;
			}
			if (id == "2") {
				document.getElementById("hdr-session-duration-1").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-session-duration-3").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-session-duration-4").style.backgroundColor = "rgb(212, 223, 206)";
				$scope.sessionDurationSelected = 2;
			}
			if (id == "3") {
				document.getElementById("hdr-session-duration-1").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-session-duration-2").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-session-duration-4").style.backgroundColor = "rgb(212, 223, 206)";
				$scope.sessionDurationSelected = 3;
			}
			if (id == "4") {
				document.getElementById("hdr-session-duration-1").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-session-duration-2").style.backgroundColor = "rgb(212, 223, 206)";
				document.getElementById("hdr-session-duration-3").style.backgroundColor = "rgb(212, 223, 206)";
				$scope.sessionDurationSelected = 4;
			}

			var elm = document.getElementById("hdr-session-duration-" + id);
			var initbgColor = elm.style.backgroundColor;
			elm.style.backgroundColor = "rgb(114, 241, 41)";


		}





	});