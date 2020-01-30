angular.module('hdrApp')
    .controller('StudentController', function ($scope, hdrlocalstorage, $stateParams, $timeout, $ionicScrollDelegate, $filter, $ionicModal) {

        $scope.sumMarks = function () {
            var sum = 0;
            $scope.student.marks.forEach(function (mark) {
                sum += mark.value;
            });
            return sum;
        }

        if (ionic.Platform.isWebView()) {

            $scope.student = $stateParams.student;
            if (!$scope.student.marks) {
                $scope.student.marks = [];
            }
            else {
                $scope.totalmarks = $scope.sumMarks();
            }
            $scope.classroom = hdrlocalstorage.getStudentClassroom($scope.student);
        }

        $scope.newMark = {
            id: "1",
            number: 0,
            value: 0,
            unix_time: Date.now(),
            title: '',
            observation: ''
        }



        $scope.observationUpdateMode = false;

        $scope.switchObservationUpateMode = function () {

            if ($scope.observationUpdateMode == true)
                $scope.observationUpdateMode = false
            else {
                $scope.observationUpdateMode = true;
                $ionicScrollDelegate.resize();
                //$ionicScrollDelegate.scrollTop(true);
                /*                 setTimeout(function () {
                                    //document.getElementById('hdr-textarea-observation').focus();
                                }, 40); */
            }


        }

        $scope.updateStudent = function () {

            hdrlocalstorage.updateStudent($scope.student);

            $scope.switchObservationUpateMode();
        }

        $scope.addMark = function () {

            switch ($scope.newMark.id) {
                case "1":
                    $scope.newMark.title = "مشاركة: إجابة عن سؤال"
                    break;
                case "2":
                    $scope.newMark.title = "مشاركة: طرح سؤال مهم"
                    break;
                case "3":
                    $scope.newMark.title = "مشاركة أخرى"
                    break;

                default:
                    break;
            }

            if ($scope.editMarkMode == true) {

                var ind = $scope.student.marks.findIndex(function(mark){
                    return mark.number==$scope.selectedMark.number;
                })

                if (ind >= 0)
                    $scope.student.marks[ind] = angular.copy($scope.newMark);
                else
                    console.log("mark not found");

                if (ionic.Platform.isWebView()) {
                    hdrlocalstorage.updateStudent($scope.student);
                }
                //console.log(ind);   
            }
            else {

                if ($scope.student.marks.length == 0) {
                    $scope.newMark.number = 1;
                }
                else {
                    $scope.newMark.number = $scope.student.marks[$scope.student.marks.length - 1].number + 1;
                }



                $scope.student.marks.push(angular.copy($scope.newMark))
                if (ionic.Platform.isWebView()) {
                    hdrlocalstorage.updateStudent($scope.student);
                }
            }

            console.log($scope.student.marks);
            $scope.totalmarks = $scope.sumMarks();
            $scope.closeModal()
            $timeout(function () {
                $scope.selectMark($scope.newMark, false)
            }, 250)
        }





        //model for add a new student
        $ionicModal.fromTemplateUrl('addstudentmarkmodal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal_for_addStudentMark = function (flag) {

            if (flag) {
                $scope.editMarkMode = true
                $scope.newMark = $scope.selectedMark;
            }
            else {
                $scope.editMarkMode = false
                $scope.newMark = {
                    id: "1",
                    number: 0,
                    value: 0,
                    unix_time: Date.now(),
                    title: '',
                    observation: ''
                }

            }

            $scope.modal.show();

            //$scope.selectElement($scope.selectedStudent);
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.observationUpdateMode = false;
            //$scope.selectElement($scope.selectedStudent);
        };

        $scope.selectAll = function (id) {
            var elm = document.getElementById(id);

            $timeout(function () {
                elm.select()
            }, 50)
        }

        $scope.minusPoint = function () {
            if ($scope.newMark.value > 0)
                $scope.newMark.value--;
        }
        $scope.plusPoint = function () {
            $scope.newMark.value++;
        }
        $scope.removeMark = function () {


            var mark = $scope.selectedMark;
            //$scope.newMark = mark;
            var ind = $scope.student.marks.findIndex(function (item) {
                return item.number == mark.number;
            });

            if (ind >= 0) {
                //$scope.selectMark(mark);
                $scope.student.marks.splice(ind, 1);
                $scope.totalmarks = $scope.sumMarks();
                if (ionic.Platform.isWebView()) {
                    hdrlocalstorage.updateStudent($scope.student);
                }
            }

            $scope.closeModal()
        }

        $scope.editMark = function (mark) {
            $scope.newMark = mark;
            $scope.openModal_for_addStudentMark(true)
        }


        $scope.selectedMark = { number: null };
        $scope.selectMark = function (mark, flag = true) {

            var id = 'hdr-mark-' + mark.number;

            if ($scope.selectedMark.number != mark.number) {
                $scope.selectedMark = mark;

                var x = document.getElementsByClassName("hdr-mark");
                if (x) {

                    angular.forEach(x, function (item) {
                        item.style.backgroundColor = "transparent";
                    })
                }
                var elm = document.getElementById(id);
                if (elm)
                    elm.style.backgroundColor = "rgba(236, 217, 92, 0.46)"

                if (flag) {
                    $timeout(function () {
                        $scope.openModal_for_addStudentMark(true);
                    }, 250)
                }
            }
            else {
                var elm = document.getElementById(id);
                if (elm) {

                    elm.style.backgroundColor = "transparent";
                    $scope.selectedMark = { number: null };
                }
            }


        }



        $scope.$on('$ionicView.enter', function () {
            if (ionic.Platform.isWebView()) {


                $scope.absences = $filter('filter')($scope.student.absentSessions, { 'is_student_fix_problem': 0 });
                $scope.delays = $filter('filter')($scope.student.absentSessions, { 'is_student_fix_problem': 1 });
                //$scope.marks = $filter('filter')($scope.student.absentSessions, { 'is_student_fix_problem': 1 });

                if (!$scope.absences) $scope.absences = []
                if (!$scope.delays) $scope.delays = []
                if (!$scope.marks) $scope.marks = []



            }
            else {
                $timeout(function () {
                    $scope.student = {};
                    $scope.student.massar_number = "S9865452151";
                    $scope.student.queuing_number = "17";
                    $scope.student.id_classroom = "TCSLH-3";
                    $scope.student.birth_date = "04/06/2003";
                    $scope.student.full_name = "فاطمة الزهراء العمراوي";
                    $scope.student.observation = "توكل ثم توكل \nتم ت\nوكل\n صمةعامل \nفاعمل\n شس شسينتشسي ";


                    $scope.classroom = { level: "جدع مشنرك أدبي" }

                    $scope.absences = [
                        { id: '1', unix_time: '1520027361941', title: "10-11" },
                        { id: '1', unix_time: '1520027361941', title: "10-11" },
                        { id: '1', unix_time: '1520027361941', title: "10-11" }
                    ];

                    $scope.delays = [
                        { id: '1', unix_time: '1520027361941', title: "10-11" },
                        { id: '1', unix_time: '1520027361941', title: "10-11" }
                    ];

                    $scope.student.marks = [
                        { id: '1', number: 1, unix_time: '1520027361941', value: 2, title: 'azeaze sqdqsd', observation: 'سشيحخضصحث ضحثخن ضضصح ض ثخث  ضصخث ض ث ضث  \n سيبشسي ' },
                        { id: '2', number: 2, unix_time: '1520027361941', value: 20, title: '', observation: '' },
                        { id: '3', number: 3, unix_time: '1520027361941', value: 1, title: '', observation: '' }
                    ]
                    $scope.totalmarks = $scope.sumMarks();
                }, 100)
            }
        })



    });