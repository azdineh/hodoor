angular.module('hdrApp')
    .controller('HomeController', function ($scope, $rootScope, hdrlocalstorage, $rootScope, $ionicScrollDelegate, $ionicPlatform, $state) {

        $scope.page = "home";
        $scope.isthereNewVersion = false;
        $scope.areThereSessions = false;
        $scope.observationUpdateMode = false;

        hdrlocalstorage.init();

        $scope.teacher = hdrlocalstorage.teacher;
        $scope.saveTeacherDiary = function () {
            hdrlocalstorage.updateTeaherDiary($scope.teacher.diary);
            $scope.switchObservationUpateMode();
        }

        $rootScope.rubrics = {
            'most_absent_students': "التلاميذ الأكثر تغيبا",
            'remarked_students': "التلاميذ المُلاحظ عليهم",
            'remarked_sessions': "الحصص المُلاحظ عليها",
            'rewarded_students': ' التلاميذ المكآفؤون'
        }

        $scope.goToOverview = function (rubric) {
            $state.go("tab.overview", { 'rubric': rubric });
        }

        var scrollposition = {};

        $scope.switchObservationUpateMode = function () {

            if ($scope.observationUpdateMode == true) {
                $scope.observationUpdateMode = false
                $ionicScrollDelegate.scrollTo(scrollposition.left, scrollposition.top, true);
            }
            else {
                $scope.observationUpdateMode = true;

                setTimeout(function () {
                    document.getElementById('hdr-textarea-observation').focus();
                    scrollposition = $ionicScrollDelegate.getScrollPosition()
                    //$ionicScrollDelegate.resize();
                    $ionicScrollDelegate.scrollTop(true);
                }, 20);

            }

        }




        if (ionic.Platform.isWebView()) {
            $ionicPlatform.ready(function () {

                var veersion_code = 0;
                cordova.getAppVersion.getVersionCode(function (versioncode) {
                    veersion_code = versioncode;
                    console.log("Version code :" + veersion_code);

                    window.FirebasePlugin.setConfigSettings({
                        // inisilize the newest_version_code by the current version
                        newest_version_code: veersion_code
                    });

                    window.FirebasePlugin.fetch(60 * 60 * 24, function () {
                        // success callback
                    }, function () {
                        // error callback
                    });

                    window.FirebasePlugin.activateFetched(function (activated) {
                        // activated will be true if there was a fetched config activated,
                        // or false if no fetched config was found, or the fetched config was already activated.
                        console.log(activated);

                    }, function (error) {
                        console.error(error);
                    });


                    window.FirebasePlugin.getValue("newest_version_code", function (newestversioncode) {
                        console.log("newest version code :" + newestversioncode);

                        if (newestversioncode == veersion_code) {
                            $scope.isthereNewVersion = false;
                        }
                        else {
                            $scope.isthereNewVersion = true;
                        }

                    }, function (error) {
                        console.error(error);
                    });
                });


                // cordova.plugin.http.get('https://ecommercebackendd.herokuapp.com/api/produits', {
                //     start: '2',
                //     count:  '6'
                // }, { Authorization: 'OAuth2: token' }, function (response) {
                //     console.log(response);
                // }, function (response) {
                //     console.error(response.error);
                // });


            })
        }



        //$rootScope.currentVersionCode = $window.localStorage['hdr.currentVersionCode'] ? angular.fromJson($window.localStorage['hdr.currentVersionCode']) : 0;
        $rootScope.daies = [];


        $rootScope.hideTab = false;
        // if($state.current.name==""

        window.addEventListener('keyboardDidShow', function (event) {


        });

        window.addEventListener('keyboardDidHide', function () {

        });

        window.addEventListener('keyboardWillShow', function () {

        });

        window.addEventListener('keyboardWillHide', function () {

        });

        /* $rootScope.today = moment().local('ar-ma').format('dddd Do MMMM YYYY'); */



        $scope.$on('$ionicView.enter', function () {
            $rootScope.today = Date.now();
            //$scope.areThereSessions=hdrlocalstorage.
        })
        $scope.$on('$ionicView.afterEnter', function () {

        })
        /* 
                $rootScope.academy = $window.localStorage['hdr.academy'] ? angular.fromJson($window.localStorage['hdr.academy']) : {};
                $rootScope.rd = $window.localStorage['hdr.rd'] ? angular.fromJson($window.localStorage['hdr.rd']) : {};
                $rootScope.school = $window.localStorage['hdr.school'] ? angular.fromJson($window.localStorage['hdr.school']) : {};
                $rootScope.teacher = $window.localStorage['hdr.teacher'] ? angular.fromJson($window.localStorage['hdr.teacher']) : {}; */

        $scope.isthereAreAbsent = true;
        $scope.remarkableStudents = [];

        var wind;


        $scope.btnWind = function () {
            console.log(wind);
        }

        if (ionic.Platform.isWebView()) {
            $ionicPlatform.ready(function () {


            });


        }
        else {// browser 


            $scope.colors = randomColor({
                count: 10,
                luminosity: "bright",
                format: 'rgba',
                alpha: 0.9
            });


            console.log(ionic.Platform.version());
            $scope.isthereAreAbsent = true;
            $scope.isthereNewVersion = true;
            $scope.mostabsentStudents = [
                {
                    full_name: 'الرياحي منير',
                    queuing_number: '15'
                },
                {
                    full_name: 'كوثر قيلالي',
                    queuing_number: '19',
                    observation: 'مشاغب لا يهتم..'
                },
                {
                    full_name: 'كمال مضعيف',
                    queuing_number: '33'

                },
                {
                    full_name: 'كمال مضعيف',
                    queuing_number: '33'

                },
                {
                    full_name: 'كمال مضعيف',
                    queuing_number: '33'

                },
                {
                    full_name: 'كمال مضعيف',
                    queuing_number: '33'

                }
            ]


        }

        $scope.goToBlog = function () {
            cordova.InAppBrowser.open("https://7odoor.blogspot.com/2020/01/blog-post_29.html", '_system');
        }
        $scope.goToPlayStore = function () {
            cordova.InAppBrowser.open("https://goo.gl/bZz1sD", '_system');
        }



    });

angular.module('hdrFilters', [])
    .filter('hdrage', function (azdutils) {



        /**
         * calculate the age from a simple string format of the date
         * @param  {string} dateSimpleStringFormat this param present a date with format : dd/mm/yyyy
         * @return {string} the age, Example: if the age=16.7 return 16.5,
         * if the age= 16.3 rerun 16.
     *  */
        var calculateAge = function (dateSimpleStringFormat) {
            var age = 0;
            var birthdate = azdutils.dateTo_ISO8601(dateSimpleStringFormat);

            var ageDifMs = Date.now() - birthdate.getTime();
            var ageDate = new Date(ageDifMs); // miliseconds from epoch
            var ageYear = Math.abs(ageDate.getUTCFullYear() - 1970);
            var ageMonth = ageDate.getUTCMonth() + 1;

            console.log(dateSimpleStringFormat + " :" + ageYear + "/" + ageMonth)

            if (azdutils.isBirthday(dateSimpleStringFormat)) {
                //age = ageYear + "سنة كاملة"
                age = ageYear + "عام";
            }
            else {
                if (ageMonth <= 6) {
                    age = ageYear + " عام ";
                }
                else {
                    age = ageYear + " عام ونصف ";
                }
            }
            return age;

        };

        return function (input) {
            if (input && input != "")
                return calculateAge(input);
            else
                return "العمر غير متوفر"
        };


    })
    .filter('hdrFullDate', function (azdutils, $filter) {
        return function (input) {

            if (input)
                return $filter('date')(azdutils.dateTo_ISO8601(input), 'fullDate');
            else
                return "تاريخ الأزدياد غير متوفر";
        }
    })
    .filter('hdrnumber', function () {
        return function (input) {
            var hdrnumber = '00';
            if (input <= 9) {
                hdrnumber = '0' + input;
            } else {
                hdrnumber = input;
            }
            return hdrnumber;
        }
    })
    .filter('hdrmassarnumber', function () {
        return function (input) {

            var str = new String(input);
            if (str.length > 5 && str.length <= 10) {
                return input
            }
            else
                return "--"
        }
    })
    .filter('hdrparity', function () {
        return function (input) {
            var hdrparity = '';
            if (input == 'odd') {
                hdrparity = 'فرديين';
            }
            if (input == 'even') {
                hdrparity = 'زوجيين';
            }
            if (input == 'groupe1') {
                hdrparity = 'فوج 1';
            }
            if (input == 'groupe2') {
                hdrparity = 'فوج 2';
            }

            return hdrparity;
        }
    })
    .filter('hdrsession', function () {
        return function (input) {
            var sess = "";
            if (input == 1)
                sess = "حصة واحدة";
            if (input == 2)
                sess = "حصتين";
            if (input == 3)
                sess = "ثلاث حصص";
            if (input == 4)
                sess = "أريع حصص";
            if (input == 5)
                sess = "خمس حصص";
            if (input > 5)
                sess = input + " حصص";

            return sess;
        }
    });