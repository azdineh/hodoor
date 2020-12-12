
angular.module('hdrApp')
    .controller('SessionshistoryController', function ($scope, $rootScope, hdrlocalstorage, $filter, $timeout, $interval,
        $ionicScrollDelegate, $state, $ionicPopup) {

        //$state.go($state.current, $stateParams, {reload: true, inherit: false});
        //$watch

        $rootScope.sessions_view = [];

        var sesseions_view_initial = hdrlocalstorage.sessions.slice();
        //copy drlocalstorage.session array
        //sesseions_view_initial = hdrlocalstorage.sessions.slice();

        $scope.settings = {
            classroomsfilteredBy: 'all', //'TCS-3 ...
            sessionsfiltredBy: 'all' //examOnly
        };

        $scope.$watch('settings', function (newSettings, oldSettings) {

            if ((newSettings.classroomsfilteredBy != oldSettings.classroomsfilteredBy) || newSettings.sessionsfiltredBy != oldSettings.sessionsfiltredBy) {
                $rootScope.sessions_view = [];


                $ionicScrollDelegate.scrollTop(true);
                //switch sessions array in hdrlocalstorage
                if (newSettings.classroomsfilteredBy != "all") {

                    sesseions_view_initial = $filter('filter')(hdrlocalstorage.sessions, { classroom_title: newSettings.classroomsfilteredBy });
                    //console.log('sessions array length: ' + sesseions_view_initial.length);
                }
                else {

                    //copy hdrlocalstorage.sessions array
                    sesseions_view_initial = hdrlocalstorage.sessions.slice();
                }

                if (newSettings.sessionsfiltredBy != 'all') {
                    sesseions_view_initial = $filter('filter')(sesseions_view_initial, { isExamSession: newSettings.sessionsfiltredBy });
                }
                else {
                }


                firstShow();
            }

            console.log("Current settings : " + newSettings.classroomsfilteredBy + " et " + newSettings.sessionsfiltredBy);

        }, true);

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

        $scope.list_iterator = 0;
        // apres la 1ere consultation
        $scope.getMore = function () {
            //var j;

            var promise = $interval(function () {
                if ($scope.list_iterator > sesseions_view_initial.length - 1) {
                    $interval.cancel(promise);

                }
                else {

                    var sessioni = sesseions_view_initial[$scope.list_iterator];
                    sessioni.absents_students.forEach(function (student, index, arr) {
                        student = hdrlocalstorage.getRecentStudent_forSessionView(student);
                        arr[index] = student;
                    })

                    $rootScope.sessions_view.push(sessioni);
                    $scope.list_iterator++;
                }

                $ionicScrollDelegate.scrollBottom(true);

            }, 310, 3);


            /*             $timeout(function () {
                            var currentPos = $ionicScrollDelegate.getScrollPosition();
                            var currTop = currentPos.top;
                            $ionicScrollDelegate.scrollTo(currentPos.left, currTop + 200, true);
                            console.log("move it...");
                            //$ionicScrollDelegate.resize();
            
                        }, 200); */

        }

        $scope.refresh = function () {
            $ionicScrollDelegate.scrollTop(true);
            $rootScope.sessions_view = [];
            $scope.settings.classroomsfilteredBy = "all";
            $scope.settings.sessionsfiltredBy = "all";
            sesseions_view_initial = hdrlocalstorage.sessions.slice();
            firstShow();
        }

        var firstShow = function () {

            $scope.sessions_initial_count = sesseions_view_initial.length;
            $scope.list_iterator = 0;

            if ($rootScope.sessions_view.length == 0) {
                if (sesseions_view_initial.length > 0) {

                    var session0 = sesseions_view_initial[$scope.list_iterator];
                    session0.absents_students.forEach(function (student, index, arr) {
                        student = hdrlocalstorage.getRecentStudent_forSessionView(student);
                        arr[index] = student;
                    })

                    $rootScope.sessions_view.push(session0);
                    $scope.list_iterator++;

                    var promise = $interval(function () {

                        if ($scope.list_iterator > sesseions_view_initial.length - 1) {
                            $interval.cancel(promise);
                        }
                        else {
                            var sessioni = sesseions_view_initial[$scope.list_iterator];
                            sessioni.absents_students.forEach(function (student, index, arr) {
                                student = hdrlocalstorage.getRecentStudent_forSessionView(student);
                                arr[index] = student;
                            })

                            $rootScope.sessions_view.push(sessioni);
                            $scope.list_iterator++;
                        }
                    }, 380, 2);
                }

            }
        }

        if (ionic.Platform.isWebView()) {
            // pour afficher les sesions de maniere progressive..

            //premiere affichage..
            //firstShow();
            $scope.refresh();


            $scope.$on('$ionicView.enter', function () {
                $timeout(function () {
                    deselectAll();
                }, 200)
            })



            //browsre platform
        } else {

            $rootScope.classrooms_view = [
                { title: "TCS-3" },
                { title: "TCS-2" },
                { title: "TCSHL-7" }
            ]
            $rootScope.sessions_view = [
                {
                    id: 1,
                    classroom_title: "2BACSH-1",
                    unix_time: 1569149296002,
                    title: "14-18",
                    absents_students: [{ id: '1', full_name: "عمر فيلالي", queuing_number: "10" }, { id: '2', full_name: "كريم زرهوني", queuing_number: "12" }, { id: '3', full_name: "سفياني بدر", queuing_number: "22" }],
                    parity: "all",
                    students_count: 32,
                    isExamSession: 0,
                    observation: "سشي شسي محجمق فقخحلنتبي سنسيتبنسيعي ينبتي نيتبهيتب ثهعبيو نتيبمهيب نيتب"

                },
                {
                    id: 2,
                    classroom_title: "TCS-9",
                    unix_time: 1569149296002,
                    title: "08-09",
                    absents_students: [{ id: '3', full_name: "سفياني بدر", queuing_number: "22" }],
                    parity: "odd",
                    students_count: 22,
                    isExamSession: 1,
                    observation: "انقطاع خارجي للكهرباء.."

                },
                {
                    id: 3,
                    classroom_title: "TCL-5",
                    unix_time: 1569559398002,
                    title: "08-09",
                    absents_students: [],
                    parity: "odd",
                    students_count: 22,
                    isExamSession: 1,
                    observation: ""

                }
            ]

        }


        $scope.offsetStep = 0;

        $scope.goToSessionAlter = function () {
            $state.go("tab.sessionalter", { 'session_view': $scope.sessionsSelected[0] });
        }


        $scope.sessionsSelected = [];
        $scope.selectElement = function (session_view) {

            var elem = document.getElementById('hdr-session-card' + session_view.id);

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


        $scope.removeSeveralSessions = function (arr_of_session_view) {

            arr_of_session_view.forEach(function (session) {

                var ind = $rootScope.sessions_view.findIndex(function (item) {
                    return item.id == session.id
                })

                /*                 console.log("sesseions view selected :");
                                console.log(arr_of_session_view);
                                console.log("index :", ind); */

                if (ind >= 0) {

                    deselectAll();

                    $rootScope.sessions_view.splice(ind, 1);
                    sesseions_view_initial.splice(ind, 1);
                    $scope.sessions_initial_count--;

                    hdrlocalstorage.removeSession(session);
                    $scope.list_iterator--;
                    $ionicScrollDelegate.scrollBottom(true);
                    if ($rootScope.sessions_view.length == 0)
                        if (sesseions_view_initial.length > 0) $scope.getMore();
                }

            });


            //$state.go($state.current, {}, { reload: true });
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


        $scope.share = function (session_view) {
            /* 
                        id: 1,
                        classroom_title: "TCS-2",
                        unix_time: 1569149296002,
                        title: "14-18",
                        absents_students: [{ id: '1', full_name: "عمر فيلالي", queuing_number: "10" }, { id: '2', full_name: "كريم زرهوني", queuing_number: "12" }, { id: '3', full_name: "سفياني بدر", queuing_number: "22" }],
                        parity: "all",
                        students_count: 32,
                        isExamSession: 0,
                        observation: "سشي شسي محجمق فقخحلنتبي سنسيتبنسيعي ينبتي نيتبهيتب ثهعبيو نتيبمهيب نيتب" */

            if (ionic.Platform.isWebView()) {

                var number = "212653540286";
                var classname = "القسم :" + session_view.classroom_title;
                var sessionname = "الحصة :" + session_view.title;
                var sdate = $filter('date')(session_view.unix_time, "fullDate");
                var absentstudents = "";
                if (session_view.absents_students.length > 0) {

                    session_view.absents_students.forEach(student => {
                        absentstudents += student.full_name + " " + student.queuing_number + "\n";
                    });
                }
                else {
                    absentstudents = "لا يوجد غياب";
                }
               

                var message = "*" + classname + "*" + "\n" + sessionname + "\n" + sdate + "\n" + "*المتغيبون*" + "\n" + absentstudents;


                cordova.InAppBrowser.open("https://api.whatsapp.com/send?&text=" + encodeURIComponent(message), '_system');
            }
            else {
                alert("it is good")
            }

        }

        $scope.shareSession=function(){
            //var ItemSelected=
            $scope.share($scope.sessionsSelected[0]);
        }

        $scope.shareWithStudent=function(session_view){
            
            if (ionic.Platform.isWebView()) {

                var number = "212653540286";
                var classname = "القسم :" + session_view.classroom_title;
                var sessionname = "الحصة :" + session_view.title;
                var sdate = $filter('date')(session_view.unix_time, "fullDate");

                var observation = session_view.observation == "" ? "" : "*مرفقات الحصة:*" + "\n" + session_view.observation;

                var message = "*" + classname + "*" + "\n" + sessionname + "\n" + sdate + "\n" + observation;


                //cordova.InAppBrowser.open("https://api.whatsapp.com/send?phone=" + number + "&text=" + encodeURIComponent(message), '_system');
                cordova.InAppBrowser.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(message), '_system');
            }
            else {
                alert("Share to students...")
            }
        }

    });
