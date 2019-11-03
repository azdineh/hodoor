angular.module('hdrApp')
    .controller('StudentController', function ($scope, hdrlocalstorage, $stateParams, $rootScope, $window,
        $timeout, $ionicScrollDelegate, $filter) {


        if (ionic.Platform.isWebView()) {

            $scope.student = $stateParams.student;
            $scope.classroom = hdrlocalstorage.getStudentClassroom($scope.student);
        }


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


                $scope.absences = $filter('filter')($scope.student.absentSessions, { 'is_student_fix_problem': 0 });
                $scope.delays = $filter('filter')($scope.student.absentSessions, { 'is_student_fix_problem': 1 });



            }
            else {
                $timeout(function () {
                    $scope.student = {};
                    $scope.student.massar_number = "S9865452151";
                    $scope.student.queuing_number = "17";
                    $scope.student.id_classroom = "TCSLH-3";
                    $scope.student.birth_date = "04/06/2003";
                    $scope.student.full_name = "فاطمة الزهراء العمراوي";
                    $scope.student.observation = "توكل ثم توكل تم توكل صمةعامل فاعمل شس شسينتشسي ";


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
                }, 100)
            }
        })



    });