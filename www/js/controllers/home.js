angular.module('hdrApp')
    .controller('HomeController', function ($scope, hdrlocalstorage, $rootScope,
        $window, $ionicPlatform) {

        $scope.page = "home";

        hdrlocalstorage.init();

        //$rootScope.currentVersionCode = $window.localStorage['hdr.currentVersionCode'] ? angular.fromJson($window.localStorage['hdr.currentVersionCode']) : 0;
        $rootScope.daies = [];


        $rootScope.hideTab = false;
        $scope.thereAreSessions = false;
        $scope.isthereNewVersion = false;
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
        })
        $scope.$on('$ionicView.afterEnter', function () {

        })
        /* 
                $rootScope.academy = $window.localStorage['hdr.academy'] ? angular.fromJson($window.localStorage['hdr.academy']) : {};
                $rootScope.rd = $window.localStorage['hdr.rd'] ? angular.fromJson($window.localStorage['hdr.rd']) : {};
                $rootScope.school = $window.localStorage['hdr.school'] ? angular.fromJson($window.localStorage['hdr.school']) : {};
                $rootScope.teacher = $window.localStorage['hdr.teacher'] ? angular.fromJson($window.localStorage['hdr.teacher']) : {}; */

        $scope.isthereAreAbsent = false;
        $scope.isthereAreRemarkableStudents = false;

        var wind;


        $scope.btnWind = function () {
            console.log(wind);
        }

        if (ionic.Platform.isWebView()) {
            $ionicPlatform.ready(function () {

                /*                 document.addEventListener("pause", function () {
                                    console.log("App is in pause state");
                                }, false); */



                cordova.getAppVersion.getVersionCode(function (currentVersionCode) {
                    //console.log(version);
                    $rootScope.nextVersionCode = $window.localStorage['hdr.nextVersionCode'] ? angular.fromJson($window.localStorage['hdr.nextVersionCode']) : currentVersionCode;
                    console.log("current version code " + currentVersionCode);

                    console.log("next version " + $rootScope.nextVersionCode);

                    if ($rootScope.nextVersionCode != currentVersionCode) {
                        $scope.isthereNewVersion = true;
                    }
                    else {
                        $scope.isthereNewVersion = false;
                    }
                });


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
            cordova.InAppBrowser.open("http://7odoor.blogspot.com/", '_system');
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
            var ageMonth = ageDate.getUTCMonth();

            if (ageMonth <= 6) {
                age = ageYear + " عام ";
            }
            else {
                age = ageYear + " عام ونصف";
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
            } else if (input == 'even') {
                hdrparity = 'زوجيين';
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