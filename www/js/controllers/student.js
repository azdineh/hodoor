angular.module('hdrApp')
    .controller('StudentController', function ($scope, $rootScope, $stateParams, $rootScope, $window, $timeout, $ionicScrollDelegate, $filter, hdrdbx) {


        $scope.classroom = $filter('filter')($rootScope.classrooms_view, $stateParams.classroom)[0];
        $scope.student = $stateParams.student;

        var currentStudent = $filter('filter')($scope.classroom.students, { massar_number: $stateParams.student.massar_number })[0];

        var studentIndex = $scope.classroom.students.indexOf(currentStudent);
        var classroomIndex = $rootScope.classrooms_view.indexOf($scope.classroom);

        console.log(" student index :" + studentIndex)
        console.log(" classromm index :" + classroomIndex)


        $scope.observationUpdateMode = false;

        $scope.switchObservationUpateMode = function () {

            if ($scope.observationUpdateMode == true)
                $scope.observationUpdateMode = false
            else {
                $scope.observationUpdateMode = true;
                setTimeout(function () {
                    document.getElementById('hdr-textarea-observation').focus();
                }, 40);
            }

            $ionicScrollDelegate.resize();
        }

        $scope.updateStudent = function () {

            hdrdbx.updateStudent($scope.student, $scope.student)
                .then(function (res) {

                    // update localStorage here


                    //$scope.student.isBarred = $scope.student.isBarred;

                    //if ($rootScope.absentStudents.indexOf($scope.student) >= 0)
                    //$rootScope.absentStudents[$rootScope.absentStudents.indexOf($scope.student)].observation = $scope.student.observation;

                    $rootScope.classrooms_view[classroomIndex].students[studentIndex].observation = $scope.student.observation;
                    $rootScope.classrooms_view[classroomIndex].students[studentIndex].isBarred = $scope.student.isBarred;


                    $window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);
                    //localstorage ends
                    $scope.switchObservationUpateMode();

                }, function (err) {
                    console.log(err);
                });
        }

        $scope.$on('$ionicView.enter', function () {
            if (ionic.Platform.isWebView()) {

                hdrdbx.selectRows('student', "massar_number='" + $scope.student.massar_number + "'")
                    .then(function (students) {
                        $scope.student = students[0];

                        hdrdbx.selectStudentAbsences($scope.student.massar_number)
                            .then(function (arr) {
                                $timeout(function () {
                                    /*  $scope.student_absences = arr; */
                                    console.log(arr);
                                    $scope.absences = $filter('filter')(arr, { 'is_student_fix_problem': 0 });
                                    $scope.delays = $filter('filter')(arr, { 'is_student_fix_problem': 1 });
                                }, 100)
                            }, function (err) {
                                console.log('Error while getting student absences');
                                console.log(err);
                            });
                    });


            }
            else {
                $timeout(function () {
                    $scope.student = {};
                    $scope.classroom = {};
                    $scope.student.massar_number = "S9865452151";
                    $scope.student.queuing_number = "17";
                    $scope.student.birth_date = "04/06/2003";
                    $scope.student.full_name = "فاطمة الزهراء العمراوي";
                    $scope.student.observation = "توكل ثم توكل تم توكل صمةعامل فاعمل شس شسينتشسي ";
                    $scope.classroom.title = "TCLSH-1";

                    $scope.absences = [
                        { id: '1', unix_time: '1520027361941', title: "10-11" },
                        { id: '1', unix_time: '1520027361941', title: "10-11" },
                        { id: '1', unix_time: '1520027361941', title: "10-11" }
                    ];

                    $scope.delays = [
                        { id: '1', unix_time: '1520027361941', title: "10-11" },
                        { id: '1', unix_time: '1520027361941', title: "10-11" }
                    ];
                }, 100)
            }
        })



    });