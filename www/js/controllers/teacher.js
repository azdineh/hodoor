angular.module('hdrApp')
    .controller('TeacherController', function ($scope, hdrlocalstorage, hdrFileSystem, $rootScope, $ionicViewService, $ionicScrollDelegate,
        $window, $ionicPopup, azdutils, $filter) {




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
            //var number = "212653540286";
            //var message = " that is a *test*\n New line";
            //cordova.InAppBrowser.open("https://api.whatsapp.com/send?phone=" + number + "&text=" + message, '_system');
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
            /*             var options = {
                            message: 'تطبيق رائع، يستعمل كأداة مساعدة للأستاذ(ة) في بعض ممارساته الصفية..', // not supported on some apps (Facebook, Instagram)
                            subject: '', // fi. for email
                            files: ['www/img/hodoor_pic.jpg'], // an array of filenames either locally or remotely
                            url: 'https://goo.gl/Fzo544',
                            chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
                            appPackageName: 'com.whatsapp', // Android only, you can provide id of the App you want to share with
                            iPadCoordinates: '0,0,0,0' //IOS only iPadCoordinates for where the popover should be point.  Format with x,y,width,height
                        };
            
                        var onSuccess = function (result) {
                            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                            console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
                        };
            
                        var onError = function (msg) {
                            console.log("Sharing failed with message: " + msg);
                        };
            
                        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError); */

            //message, image and link
            window.plugins.socialsharing.share('تطبيق رائع، يستعمل كأداة مساعدة للأستاذ(ة) في الممارسة الصفية..', null,
                'www/img/hodoor_pic.jpg',
                'https://goo.gl/Fzo544');
        }


        $scope.exportAbsences = function () {
            /**
             * Save Excel files in user device, that contain absence students history.
             *
             */

            //clasess : object contains classrom and its sessions

            var clasess_array = [];

            //filters sessions by classroom and fill in clasess_array.
            hdrlocalstorage.classrooms.forEach(classroom => {

                var clasess = {
                    classroom: {},
                    sessions: []
                }

                clasess.classroom = classroom;
                clasess.sessions = $filter('filter')(hdrlocalstorage.sessions, { classroom_title: classroom.title });
                clasess_array.push(clasess)
            });





            var sheets_array = [];
            var sheets_names_array = [];

            //for each sheet
            clasess_array.forEach(clasess => {

                var absencebook = [];
                /* Initial row */


                var initail_row = XLSX.utils.json_to_sheet([
                    { A: "----", B: "----", C: "-----", D: "----", E: "----" }
                ], { header: ["A", "B", "C", "D", "E"], skipHeader: true, origin: "A1" });

                XLSX.utils.sheet_add_json(initail_row, [{ A: "بيانات التمدرس الصفي" }], { skipHeader: true, origin: "A2" });
                XLSX.utils.sheet_add_json(initail_row, [{ A: "القسم", B: "المستوى" }], { skipHeader: true, origin: "A3" });
                XLSX.utils.sheet_add_json(initail_row, [{ A: clasess.classroom.title, B: clasess.classroom.level }], { skipHeader: true, origin: "A4" });
                XLSX.utils.sheet_add_json(initail_row, [{ A: "رقم مسار", B: "الرقم الترتيبي", C: "الإسم الكامل", D: "تاريخ الإزدياد", E: "مجموع حصص الغياب", F: "مجموع نقاط الكافآت الصفية", G: "ملاحظات حول التلميذ" }], { skipHeader: true, origin: "A6" });



                /*            absencebook.push({ "classroom": clasess.classroom.title })
                           absencebook.push({ "mostawa": clasess.classroom.level }) */
                //absencebook.push({"mostawa":clasess.classroom.level})

                clasess.classroom.students.forEach(student => {

                    var studentline = {};

                    studentline.A = student.massar_number;
                    studentline.B = student.queuing_number;
                    studentline.C = student.full_name;
                    studentline.D = student.birth_date;
                    var absences = [];
                    if (student.absentSessions)
                        absences = $filter('filter')(student.absentSessions, { 'is_student_fix_problem': 0 });
                    studentline.E = absences.length;
                    var sumMarks = azdutils.sumMarks(student);
                    studentline.F = sumMarks > 0 ? sumMarks : '';
                    studentline.G = student.observation;


                    absencebook.push(studentline);
                })
                /* Write data starting at E2 */
                XLSX.utils.sheet_add_json(initail_row, absencebook, { skipHeader: true, origin: "A7" });


                //var ws = XLSX.utils.json_to_sheet(absencebook, { header: [, ", ", "", "ذ"], skipHeader: false, origin: -1 });
                sheets_array.push(initail_row);
                sheets_names_array.push(clasess.classroom.title);

            });

            azdutils.createNewExcelFile(sheets_array, sheets_names_array);

            /*             var ws = XLSX.utils.json_to_sheet([
                            { S: 1, h: 2, e: 3, e_1: 4, t: 5, J: 6, S_1: 7 },
                            { S: 2, h: 3, e: 4, e_1: 5, t: 6, J: 7, S_1: 8 }
                        ], { header: ["S", "h", "e", "e_1", "t", "J", "S_1"] }); */



            //iterate clasess_array, and write in Excel file


            //save Exel file as classroom name
        }

    });