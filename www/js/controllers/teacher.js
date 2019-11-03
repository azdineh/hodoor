angular.module('hdrApp')
    .controller('TeacherController', function ($scope, hdrlocalstorage, $rootScope, $ionicViewService, $ionicScrollDelegate,
         $window, $ionicPopup) {




        if (ionic.Platform.isWebView()) {

            $scope.$on('$ionicView.enter', function () {

                $scope.teacher_view = null;

                if ($rootScope.classrooms_view.length > 0) {
                    $scope.teacher_view = {
                        teacher: {
                            full_name: $rootScope.classrooms_view[0].teacher.name,
                            subject: $rootScope.classrooms_view[0].teacher.subject
                        },
                        school: {
                            title: $rootScope.classrooms_view[0].school.name
                        },
                        rd: {
                            title: $rootScope.classrooms_view[0].school.rd
                        },
                        academy: {
                            title: $rootScope.classrooms_view[0].school.academy
                        }
                    }
                }

                $scope.removeAllFlag = {
                    status: false
                };

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

            hdrlocalstorage.clear();
            $window.localStorage.removeItem("hdr.helpPopupShown");
            $rootScope.classrooms_view = [];
            $rootScope.sessions_view = [];
            $scope.teacher_view = null;
            
            $ionicViewService.clearHistory();
        };


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
                    $scope.clearStorage();
                    $ionicScrollDelegate.resize();

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