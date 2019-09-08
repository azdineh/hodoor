
angular.module('hdrApp')
    .controller('SessionshistoryController', function ($scope, $rootScope, hdrdbx, $ionicLoading, $timeout, $window, $ionicScrollDelegate, $state, $ionicPopup) {

        //$state.go($state.current, $stateParams, {reload: true, inherit: false});
        //$watch

        //$rootScope.daies = [];

        $rootScope.isDBchanged = true;
        $rootScope.lastday = true;

        var deselectAll = function () {
            var hdr_cards = document.getElementsByClassName("card hdr-card");
            if (hdr_cards.length > 0) {


                for (var i = 0; i < hdr_cards.length; i++) {
                    var element = hdr_cards[i];
                    element.classList.remove("hdr-card-session");

                }

                $scope.sessionsSelected = [];
            }
        }


        $scope.$on('$ionicView.enter', function () {
            //$scope.isDBchanged = $window.localStorage('hdr.isDBchanged') ? angular.fromJson($window.localStorage('hdr.isDBchanged')) : false;


            if (ionic.Platform.isWebView()) {

                if ($rootScope.isDBchanged == true) {
                    deselectAll();
                    $scope.selectSessionsHistory(0);
                    $rootScope.isDBchanged = false;
                }

            } else {



                $rootScope.daies = [
                    {
                        date: '1254876321545454',
                        sessions_view: [
                            {
                                session: {
                                    id: '1',
                                    unix_time: '9876543210',
                                    title: '10-11',
                                    students_count: 50,
                                    parity: 'odd',
                                    isExamSession: 1,
                                    observation: "حصة امتحان<br/>kjkljkljl <br/>:;j;,kljkl"

                                },
                                classroom: {
                                    title: 'TCS-3'
                                },
                                students: [
                                    {
                                        full_name: 'الرياحي منير',
                                        queuing_number: '15',
                                        is_student_fix_problem: 0
                                    },
                                    {
                                        full_name: 'كوثر قيلالي',
                                        queuing_number: '19',
                                        is_student_fix_problem: 1
                                    },
                                    {
                                        full_name: 'كمال مضعيف',
                                        queuing_number: '33',
                                        is_student_fix_problem: 0
                                    },
                                    {
                                        full_name: 'كمال مضعيف',
                                        queuing_number: '33',
                                        is_student_fix_problem: 0
                                    },
                                    {
                                        full_name: 'كمال مضعيف',
                                        queuing_number: '33',
                                        is_student_fix_problem: 0
                                    },
                                    {
                                        full_name: 'كمال مضعيف',
                                        queuing_number: '33',
                                        is_student_fix_problem: 0
                                    },
                                    {
                                        full_name: 'كمال مضعيف',
                                        queuing_number: '33',
                                        is_student_fix_problem: 1
                                    },
                                    {
                                        full_name: 'كمال مضعيف',
                                        queuing_number: '33',
                                        is_student_fix_problem: 0
                                    },
                                    {
                                        full_name: 'كمال مضعيف',
                                        queuing_number: '33',
                                        is_student_fix_problem: 0
                                    },
                                    {
                                        full_name: 'كمال مضعيف',
                                        queuing_number: '33',
                                        is_student_fix_problem: 1
                                    }
                                ]
                            },
                            {
                                session: {
                                    id: '2',
                                    unix_time: '9876543210',
                                    title: '10-11',
                                    students_count: 50,
                                    parity: 'even',
                                    isExamSession: 0,
                                    observation: "حصة امتحان"

                                },
                                classroom: {
                                    title: 'TCS-2'
                                },
                                students: [
                                    {
                                        full_name: 'الرياحي منير',
                                        queuing_number: '15'
                                    },
                                    {
                                        full_name: 'كوثر الغيابة',
                                        queuing_number: '19'
                                    },
                                    {
                                        full_name: 'كمال الأجسام',
                                        queuing_number: '33'
                                    }
                                ]
                            }
                        ]
                    }
                    ,
                    {
                        date: '125487878845454',
                        sessions_view: [
                            {
                                session: {
                                    id: '3',
                                    unix_time: '9876543210',
                                    title: '10-11',
                                    students_count: 50,
                                    parity: 'all',
                                    isExamSession: 0,
                                    observation: "حصة امتحان"

                                },
                                classroom: {
                                    title: 'TCS-5'
                                },
                                students: [
                                    {
                                        full_name: 'الرياحي منير',
                                        queuing_number: '15'
                                    },
                                    {
                                        full_name: 'كوثر الغيابة',
                                        queuing_number: '19'
                                    },
                                    {
                                        full_name: 'كمال الأجسام',
                                        queuing_number: '33'
                                    }
                                ]
                            }
                        ]
                    }

                ];

            }
        });




        $scope.selectSessionsHistory = function (offset) {

            if ($rootScope.classrooms_view.length > 0)
                $ionicLoading.show({});

            var subquery = "select date(substr(unix_time,1,length(unix_time)-3), 'unixepoch') as sdate from session group by sdate order by sdate desc limit 3 offset " + offset;

            hdrdbx.selectRows('session', "date(substr(unix_time,1,length(unix_time)-3), 'unixepoch') in ( " + subquery + " ) order by unix_time desc")
                .then(function (sessions_arr) {

                    if (sessions_arr.length == 0) {
                        $timeout(function () {
                            //$scope.spinnershown = false;
                            $ionicLoading.hide({});
                            $rootScope.daies = [];
                        }, 50);
                    }

                    hdrdbx.daies_arr = [];
                    //var start_index = hdrdbx.sessions_view_obj_arr.length > 0 ? hdrdbx.sessions_view_obj_arr.length - 1 : 0;
                    hdrdbx.selectSessionsView2(sessions_arr, 0, sessions_arr.length,
                        function () {

                            $timeout(function () {
                                //$scope.spinnershown = false;
                                $ionicLoading.hide({});

                                if (offset == 0)
                                    $rootScope.daies = hdrdbx.daies_arr;
                                else {
                                    $rootScope.daies = $rootScope.daies.concat(hdrdbx.daies_arr);

                                    $ionicScrollDelegate.resize();
                                }

                                hdrdbx.selectDaies()
                                    .then(function (daies) {
                                        if (daies.length == $rootScope.daies.length) {
                                            $rootScope.lastday = true;
                                        }
                                        else {
                                            $rootScope.lastday = false;
                                        }

                                    }, function (err) {
                                        console.log(err);
                                    })

                            }, 10);



                        });
                }, function (err) {
                    console.log(err);
                })
        }

        $scope.more = function () {

            $scope.offsetStep += 3;
            $scope.selectSessionsHistory($scope.offsetStep);



        }

        $scope.offsetStep = 0;

        $scope.goToSessionAlter = function () {
            $state.go("tab.sessionalter", { 'session_view': $scope.sessionsSelected[0] });
        }


        $scope.sessionsSelected = [];
        $scope.selectElement = function (session_view) {

            var elem = document.getElementById('hdr-session-card' + session_view.session.id);

            if (elem.classList.contains('hdr-card-session')) {
                elem.classList.remove("hdr-card-session");
                $scope.sessionsSelected.splice($scope.sessionsSelected.indexOf(session_view), 1);
            }
            else {
                elem.classList.add("hdr-card-session");
                $scope.ItemSelected = true;
                $scope.sessionsSelected.push(session_view);
            }
        }

        /*         $scope.removeSession = function (session) {
        
                    hdrdbx.removeSession(session.id)
                        .then(function (res) {
                            $state.go('tab.sessionshistory');
                        }, function (err) {
        
                        })
                } */






        $scope.removeSeveralSessions = function (arr_of_session_view) {

            hdrdbx.removeSeveralSessions(arr_of_session_view)
                .then(function (res) {
                    $rootScope.isDBchanged = true;

                    /*                     $scope.sessionsSelected.forEach(function (element) {
                                            var elm = document.getElementById('hdr-session-card' + element.session.id);
                                            elm.classList.remove("hdr-card-session");
                    
                                        }, this); */

                    deselectAll();


                    $state.go($state.current, {}, { reload: true });
                }, function (err) {

                })
        }


        $scope.showConfirm = function () {
            var template = "";
            if ($scope.sessionsSelected.length > 1) {
                template = '<p dir="rtl">هل أنت متأكد من حذف الحصص المحددة من سجل التغيبات ؟</p>';
            }
            else {
                template = '<p dir="rtl">هل أنت متأكد من حذف هذه الحصة من سجل التغيبات ؟</p>';
            }
            var confirmPopup = $ionicPopup.confirm({
                title: 'تأكيد',
                template: template,
                cancelText: 'إلغاء الأمر',
                okText: 'نعم'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                    $scope.removeSeveralSessions($scope.sessionsSelected);
                } else {
                    console.log('You are not sure');
                }
            });
        };

        $scope.showHelpPopup = function (arr) {
            var template = "";

            if (arr != null) {
                var number = arr.length
                if (number == 0)
                    template = '<p dir="rtl">السجل فارغ.. </p>';
                else
                    template = '<p dir="rtl">لتحرير أو حذف حصة ما من السجل، قم بالنقر عليها مرتين ثم اختر الأمر المناسب قي القائمة أعلاه.</p>';
            }
            else {
                template = '<p dir="rtl">السجل فارغ.. </p>';
            }

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
                            //e.preventDefault();
                        }
                    }
                ]
            });
        };

    });
