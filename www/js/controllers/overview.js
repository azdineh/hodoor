angular.module('hdrApp')
    .controller('OverviewController', function ($scope, azdutils, $rootScope, hdrlocalstorage, $stateParams, $ionicPlatform) {
        $scope.page = "معلومات عامة";
        $scope.rubric = $stateParams.rubric ? $stateParams.rubric : "غير محدد";
        $scope.rubricCategorie = "student" //or session

        $scope.rubricItems = [];

        var allStudents = azdutils.mergeAllStudentInOneArray(hdrlocalstorage.classrooms);

        switch ($scope.rubric) {
            case $rootScope.rubrics.most_absent_students:
                $scope.rubricCategorie = "student";
                $scope.rubricItems = allStudents.filter(function (student) {

                    if (student.absentSessions) {
                        return student.absentSessions.length > 0
                    }
                    else
                        return false
                })

                $scope.rubricItems.sort(function (a, b) {
                    return b.absentSessions.length - a.absentSessions.length;
                })

                break;
            case $rootScope.rubrics.remarked_students:
                $scope.rubricCategorie = "student";
                //var allStudents = azdutils.mergeAllStudentInOneArray(hdrlocalstorage.classrooms);
                $scope.rubricItems = allStudents.filter(function (student) {

                    if (student.observation) {
                        return student.observation != "";
                    }
                    else
                        return false
                })

                $scope.rubricItems.sort(function (a, b) {
                    if (!a.marks) a.marks = [];
                    if (!b.marks) b.marks = [];
                    return b.marks.length - a.marks.length;
                })


                break;
            case $rootScope.rubrics.rewarded_students:
                $scope.rubricCategorie = "student";
                $scope.rubricItems = allStudents.filter(function (student) {

                    if (student.marks) {
                        return student.marks.length > 0;
                    }
                    else
                        return false
                })

                $scope.rubricItems.sort(function (a, b) {
                    return b.marks.length - a.marks.length;
                });
                ; break;


            case $rootScope.rubrics.remarked_sessions:
                $scope.rubricCategorie = "session";
                $scope.rubricItems = hdrlocalstorage.sessions.filter(function (session) {

                    if (session.observation) {
                        return session.observation.length > 0
                    }
                    else
                        return false
                })
                ; break;
        }


        if (ionic.Platform.isWebView()) {

        }
        else {

        }
    });