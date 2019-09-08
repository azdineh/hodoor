angular.module('hdrApp')
    .controller('TeacherController', function ($scope, $rootScope, $ionicViewService, $ionicScrollDelegate, $window, hdrdbx, $ionicPopup) {




        if (ionic.Platform.isWebView()) {

            $scope.$on('$ionicView.enter', function () {

                $scope.teacher_view = $window.localStorage['hdr.teacher_view'] ? angular.fromJson($window.localStorage['hdr.teacher_view']) : null;

                $scope.removeAllFlag = {
                    status: false
                };

                if ($scope.teacher_view == null) {

                    hdrdbx.selectRows('teacher', '')
                        .then(function (arr) {
                            $scope.teacher_view = {};
                            $scope.teacher_view.teacher = arr[0];
                            hdrdbx.selectRows('school', '')
                                .then(function (arr) {
                                    $scope.teacher_view.school = arr[0];
                                    hdrdbx.selectRows('rd', '')
                                        .then(function (arr) {
                                            $scope.teacher_view.rd = arr[0];
                                            hdrdbx.selectRows('academy', '')
                                                .then(function (arr) {
                                                    $scope.teacher_view.academy = arr[0];
                                                    $window.localStorage['hdr.teacher_view'] = angular.toJson($scope.teacher_view);
                                                });
                                        });
                                });
                        }, function (err) {

                        });
                }
            });



        } else {
            $scope.teacher_view = {
                teacher: {
                    full_name: 'عبد الرزاق شقرون',
                    subject: 'الفيزياء و الكمياء'
                },
                school: {
                    title: 'ثانوية الحسن الداخل'
                },
                rd: {
                    title: 'إقليم : جرسيف'
                },
                academy: {
                    title: 'الشرق'
                }
            };


        }

        $scope.goToForms = function () {
            cordova.InAppBrowser.open("https://goo.gl/forms/qBJw6Jdi0sjGlF1E2", '_system');
        }

        $scope.clearStorage = function (flag) {

            //hdrdbx.hdrdbtest();

            $window.localStorage.removeItem("hdr.classrooms_view");
            $window.localStorage.removeItem("hdr.students_count_global");
            $window.localStorage.removeItem("hdr.teacher_view");
            $window.localStorage.removeItem("hdr.helpPopupShown");

            /*             $window.localStorage['hdr.classrooms_view'] = angular.toJson([]);
                        $window.localStorage['hdr.students_count_global'] = angular.toJson(0);
                        $window.localStorage['hdr.teacher_view'] = angular.toJson(null);
                        $window.localStorage['hdr.helpPopupShown'] = angular.toJson(0); */

            $rootScope.classrooms_view = [];
            $rootScope.daies = [];
            $rootScope.students_view = [];
            $scope.teacher_view = null;


            $ionicViewService.clearHistory();
        };


        /*         $scope.showFlaf = function () {
                    console.log("flag status :" + $scope.removeAllFlag.status);
                } */

        $scope.showConfirm = function () {

            template = '<p dir="rtl">هل أنت متأكد ؟</p>';
            /*             if ($scope.removeAllFlag.status == true) {
                        }
                        else {
                            template = '<p dir="rtl">هل أنت متأكد من مسح لوائح التلاميذ الحالية ؟</p>';
                        } */
            var confirmPopup = $ionicPopup.confirm({
                title: 'تأكيد',
                template: template,
                cancelText: 'إلغاء الأمر',
                okText: 'نعم'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    hdrdbx.wipeDB(function () {
                        $scope.clearStorage();
                        $ionicScrollDelegate.resize();
                    });


                    //ionic.Platform.exitApp();
                } else {
                    console.log('You are not sure');
                }
            });
        };

        $scope.share = function () {
            //message, image and link
            window.plugins.socialsharing.share('تطبيق رائع، يستعمل كأداة مساعدة للأستاذ(ة) في بعض ممارساته الصفية..', null,
                'www/img/hodoor_pic.png',
                'https://goo.gl/Fzo544');
        }

    });