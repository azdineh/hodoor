angular.module('hdrApp')
    .controller('SearchController', function ($scope, $rootScope, hdrdbx, $ionicScrollDelegate, $window, $filter) {

        $rootScope.students_view = [1];

        $scope.$on('$ionicView.beforeEnter', function () {

            /*           $rootScope.classrooms_view = $rootScope.classrooms_view ? $rootScope.classrooms_view :
                      $window.localStorage['hdr.classrooms_view'] ? angular.fromJson($window.localStorage['hdr.classrooms_view']) : []; */




            if ($window.localStorage["hdr.classrooms_view"]) {
                $rootScope.students_view = [1];
                hdrdbx.getStudentsAbsencesCount("")
                    .then(function (arr) {
                        $rootScope.students_view = arr;
                        for (var i = 0; i < arr.length; i++) {
                            $rootScope.students_view = arr;
                        }
                    }, function (err) {
                        console.log(err)
                    })
            } else {
                $scope.clearText();
                $rootScope.students_view = [];
            }

        })

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
                $scope.foundStudents = $filter('filter')($rootScope.students_view, $scope.search);
            else
                $scope.foundStudents = [];
        }

        $scope.search = function (item, index, array) {
            if (item.full_name.includes($scope.textToSearch) || item.queuing_number == $rootScope.textToSearch)
                return true;
            else
                return false;
        }


        /*  $rootScope.students_view = [{ 'title': 'TCS88', 'full_name': 'Ahmed Ezzat', 'queuing_number': '17 ' }]; */

        $rootScope.textToSearch = "";

        $scope.clearText = function () {
            document.getElementById('hdr-search-text').value = '';
            $rootScope.textToSearch = "";
        }

        $scope.$watch('textToSearch', function (newvalue, oldvalue) {
            $ionicScrollDelegate.scrollTop();
        });


    });