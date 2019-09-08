angular.module('hdrApp').controller('ClassroomsController',
    function ($scope, $rootScope, hdrFileSystem, $filter, $window, $state, $ionicLoading, hdrdbx, $ionicActionSheet, $interval, $cordovaFile, $ionicPopup) {

        $scope.page = "Classrooms";
        $rootScope.classrooms_view = $window.localStorage['hdr.classrooms_view'] ? angular.fromJson($window.localStorage['hdr.classrooms_view']) : [];
        $rootScope.students_count_global = $window.localStorage['hdr.students_count_global'] ? angular.fromJson($window.localStorage['hdr.students_count_global']) : 0;

        var classrooms_colors = ['#66d9e8', '#ffd43b', '#e66824', '#a9e34b', '#b197fc', '#c7bfb0', '#faa2c1', '#57e69a', '#e6a857', '#bfb4a6'];
        // see http://linkbroker.hu/stuff/kolorwheel.js/
        //$scope.tapped = false;

        /**
         * go to the appel page with the classroom and choice index of rappid call
         */
        $scope.startAttendanceCall = function (classroom, index) {

            if (index == '-1') {
                var elm = document.getElementById(classroom.id);
                elm.className += ' hdr-btn';
            }

            $state.go("tab.appeal", { 'classroom': classroom, 'index': index });

            /*             if (ionic.Platform.isWebView()) {
                            $state.go("tab.appeal", { 'classroom_title': classroom.title, 'index': index });
                        }
                        else {
                        } */

        }


        $scope.show = function () {
            //template: '<ion-spinner icon="lines"></ion-spinner><br/><span dir="rtl">' + crntmsg + '</span>'
            $ionicLoading.show({

            });
        };
        $scope.hide = function () {
            $ionicLoading.hide();
        };

        var importDataFromFile = function () {
            $scope.show();
            if (!$window.localStorage['hdr.classrooms_view']) {
                window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dir) {
                    dir.getFile("data.7dr", { create: false }, function (fileEntry) {
                        //data.7dr exist
                        fileEntry.file(function (file) {
                            var reader = new FileReader();

                            reader.onloadend = function () {
                                //console.log("Successful file read: " + this.result);
                                console.log("Successful read loca file data.7dr");
                                hdrdbx.importSqlToDb(this.result)
                                    .then(function (res) {
                                        //save in localStorage
                                        hdrdbx.selectClassrooms()
                                            .then(function (classrooms) {
                                                hdrdbx.addStudentsToClassrooms(classrooms, 0, function () {

                                                    var itecolor = 0;
                                                    //$rootScope.classrooms_view = hdrdbx.classrooms_view;
                                                    $interval(function () {
                                                        var shifted = hdrdbx.classrooms_view.shift();


                                                        if (shifted.students.length > 0) {

                                                            shifted.color = classrooms_colors[itecolor];

                                                            //for garanty colors for all classrooms
                                                            if (itecolor == 9) {
                                                                itecolor = 0;
                                                            }
                                                            else {
                                                                itecolor++;
                                                            }

                                                            $rootScope.classrooms_view.push(shifted);
                                                            $rootScope.students_count_global += shifted.students.length;
                                                        }

                                                        if (hdrdbx.classrooms_view.length == 0) {

                                                            $window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);
                                                            $window.localStorage['hdr.students_count_global'] = angular.toJson($rootScope.students_count_global);
                                                            $scope.hide();
                                                        }
                                                    }, 450, hdrdbx.classrooms_view.length);

                                                    //hdrdbx.classrooms_view = [];


                                                });

                                                $scope.hide();
                                                hdrFileSystem.classrooms = [];
                                            }, function (err) {
                                                console.log(err);
                                            });

                                    }, function (err) {
                                        console.log(JSON.stringify(err));
                                    })
                            };
                            reader.readAsText(file);


                        }, function (err) {
                            console.log("error while reading file..")
                            alert("Error while reading file..")
                        });

                    }, function (err) {
                        $scope.hide();
                        $scope.isDataFileExist = false;
                        console.log("data.7dr is not exist.. show menu to import data from excel files");
                    });


                });
            }
            else {
                $scope.hide();
            }
        }

        if (ionic.Platform.isWebView()) {
            $scope.isDataFileExist = true;
        } else {
            $scope.isDataFileExist = false;
        }

        $scope.checkFile = function () {
            // importDataFromFile();
        }

        $scope.$on('$ionicView.enter', function () {
            if ($rootScope.classrooms_view.length == 0) {
                importDataFromFile();
            }
        })

        $scope.goToStudentsView = function (classroom) {
            if (classroom.students.length == 0) {
                alert("يبدو أن اللوائح المصدرة من موقع مسار فارغة من أسماء التلاميذ..");
            }
            else {
                $state.go('tab.classroom', { 'classroom_title': classroom.title });
            }
        }

        $scope.importSimulatedClassrooms = function () {

            ionic.Platform.ready(function () {
                hdrdbx.initDB();
                $scope.show();
                window.resolveLocalFileSystemURL("file:///android_asset/www/hodoor-classrooms-simulation", function (directoryentry) {


                    hdrFileSystem.readHdrFiles(directoryentry,
                        function () {
                            console.log("call back success..");
                            console.log(hdrFileSystem.classrooms);

                            hdrdbx.fillDB(hdrFileSystem.classrooms, 0, function () {

                                hdrdbx.selectClassrooms()
                                    .then(function (classrooms) {
                                        hdrdbx.addStudentsToClassrooms(classrooms, 0, function () {

                                            var itecolor = 0;
                                            //$rootScope.classrooms_view = hdrdbx.classrooms_view;
                                            $interval(function () {
                                                var shifted = hdrdbx.classrooms_view.shift();

                                                shifted.color = classrooms_colors[itecolor];
                                                //for garanty colors for all classrooms
                                                if (itecolor == 9) {
                                                    itecolor = 0;
                                                }
                                                else {
                                                    itecolor++;
                                                }

                                                if (shifted.students.length > 0) {
                                                    $rootScope.classrooms_view.push(shifted);
                                                    $rootScope.students_count_global += shifted.students.length;
                                                }

                                                if (hdrdbx.classrooms_view.length == 0) {

                                                    $window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);
                                                    $window.localStorage['hdr.students_count_global'] = angular.toJson($rootScope.students_count_global);
                                                }
                                            }, 450, hdrdbx.classrooms_view.length);

                                            //hdrdbx.classrooms_view = [];


                                        });

                                        $scope.hide();
                                        hdrFileSystem.classrooms = [];
                                    }, function (err) {
                                        console.log(err);
                                    });


                            });



                        })



                }, function (error) {
                    alert("problem with resolve local files system");
                })

            });
        };

        $scope.importClassroomsOld = function () {

            if (ionic.Platform.isWebView()) {
                ionic.Platform.ready(function () {
                    //var hfs = new hdrFileSystem();
                    hdrdbx.initDB();
                    $scope.show();
                    hdrFileSystem.getFileSystem('0').then(function (fs) {
                        hdrFileSystem.isHdrDirectoryExist(fs).then(function (directory) {
                            //alert(" The " + directory.name + " is found in internal storage , now checking out the Masar files..");
                            hdrFileSystem.readHdrFiles(directory,
                                function () {
                                    console.log("call back success..");
                                    console.log(hdrFileSystem.classrooms);

                                    hdrdbx.fillDB(hdrFileSystem.classrooms, 0, function () {

                                        hdrdbx.selectClassrooms()
                                            .then(function (classrooms) {
                                                hdrdbx.addStudentsToClassrooms(classrooms, 0, function () {


                                                    //$rootScope.classrooms_view = hdrdbx.classrooms_view;
                                                    $interval(function () {
                                                        var shifted = hdrdbx.classrooms_view.shift();
                                                        $rootScope.classrooms_view.push(shifted);
                                                        $rootScope.students_count_global += shifted.students.length;

                                                        if (hdrdbx.classrooms_view.length == 0) {

                                                            $window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);
                                                            $window.localStorage['hdr.students_count_global'] = angular.toJson($rootScope.students_count_global);
                                                        }
                                                    }, 290, hdrdbx.classrooms_view.length);

                                                    //hdrdbx.classrooms_view = [];



                                                });

                                                hdrdbx.selectRows('academy')
                                                    .then(function (res) {

                                                        $rootScope.academy = res.rows.item(0);
                                                        $window.localStorage['hdr.academy'] = angular.toJson($rootScope.academy);
                                                    }, function (err) {
                                                        console.log(err);
                                                    });
                                                hdrdbx.selectRows('rd')
                                                    .then(function (res) {
                                                        $rootScope.rd = res.rows.item(0);
                                                        $window.localStorage['hdr.rd'] = angular.toJson($rootScope.rd);
                                                    }, function (err) {
                                                        console.log(err);
                                                    });
                                                hdrdbx.selectRows('school')
                                                    .then(function (res) {
                                                        $rootScope.school = res.rows.item(0);
                                                        $window.localStorage['hdr.school'] = angular.toJson($rootScope.school);
                                                    }, function (err) {
                                                        console.log(err);
                                                    });
                                                hdrdbx.selectRows('teacher')
                                                    .then(function (res) {
                                                        $rootScope.teacher = res.rows.item(0);
                                                        $window.localStorage['hdr.teacher'] = angular.toJson($rootScope.teacher);
                                                    }, function (err) {
                                                        console.log(err);
                                                    });

                                                $scope.hide();
                                                hdrFileSystem.classrooms = [];
                                            }, function (err) {
                                                console.log(err);
                                            });


                                    });



                                })



                        }, function (error) {
                            //alert("The hodoor-classrooms Directory doesn't exist..");
                            alert("الملف hodoor-classrooms غير موجود");
                        });
                    }, function (error) {
                        // error with FileSystem
                    });
                });
            } else {
                // actions for computer platforms
                console.log("classrooms page");
                $rootScope.classrooms_view.push({ id: "1", color: classrooms_colors[1], title: "TCS4", level: "جذع مشترك علمي", 'students': [{ id: '1', full_name: "عمر فيلالي", queuing_number: "10" }, { id: '2', full_name: "كريم زرهوني", queuing_number: "12" }, { id: '3', full_name: "سفياني بدر", queuing_number: "22" }] });
                $rootScope.classrooms_view.push({ id: "2", color: classrooms_colors[2], title: "TCLSH2", level: "جذع مشترك أداب و علوم إنسانية", 'students': [{ full_name: "زيد فيلالي", queuing_number: "17" }, { full_name: "كريم جلول", queuing_number: "33" }, { full_name: "سفياني حنان", queuing_number: "5" }] });
                $rootScope.classrooms_view.push({ id: "3", color: classrooms_colors[3], title: "1BacSM4", level: "أولى باك علوم رياضية", 'students': [{ full_name: "زيد فيلالي", queuing_number: "17" }, { full_name: "كريم جلول", queuing_number: "33" }, { full_name: "سفياني حنان", queuing_number: "5" }] });
                $rootScope.classrooms_view.push({ id: "4", color: classrooms_colors[4], title: "2BacSP3", level: "ثانية علوم فيزيائية", 'students': [{ full_name: "زيد فيلالي", queuing_number: "17" }, { full_name: "كريم جلول", queuing_number: "33" }, { full_name: "سفياني حنان", queuing_number: "5" }] });
                $rootScope.classrooms_view.push({ id: "5", color: classrooms_colors[5], title: "TCPS1", level: "جذع مشترك خدماتي", 'students': [{ full_name: "زيد فيلالي", queuing_number: "17" }, { full_name: "كريم جلول", queuing_number: "33" }, { full_name: "سفياني حنان", queuing_number: "5" }] });
                $rootScope.classrooms_view.push({ id: "6", color: classrooms_colors[6], title: "TCSH7", level: "جذع مشترك خدماتي", 'students': [{ full_name: "زيد فيلالي", queuing_number: "17" }, { full_name: "كريم جلول", queuing_number: "33" }, { full_name: "سفياني حنان", queuing_number: "5" }] });

                $rootScope.classrooms_view.forEach(function (classroom) {
                    $rootScope.students_count_global += classroom.students.length;
                }, this);

                $window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);
                $window.localStorage['hdr.students_count_global'] = angular.toJson($rootScope.students_count_global);
            }
        };



        $scope.importClassrooms = function () {

            ionic.Platform.ready(function () {
                hdrdbx.initDB();
                $scope.show();
                var pathDist = cordova.file.cacheDirectory;
                var path = pathDist + "/hodoor-classrooms";
                console.log(path);
                window.resolveLocalFileSystemURL(path, function (directoryentry) {

                    var directoryReader = directoryentry.createReader();
                    directoryReader.readEntries(
                        function (entries) {
                            if (entries.length > 0) {
                                console.log(entries);
                            }
                            else {
                                console.log("home directiry is empty..");
                            }
                        },
                        function (err) {

                        }
                    );
                    hdrFileSystem.readHdrFiles(directoryentry,
                        function () {
                            console.log("call back success..");
                            console.log(hdrFileSystem.classrooms);

                            hdrdbx.fillDB(hdrFileSystem.classrooms, 0, function () {

                                hdrdbx.selectClassrooms()
                                    .then(function (classrooms) {
                                        hdrdbx.addStudentsToClassrooms(classrooms, 0, function () {

                                            var itecolor = 0;
                                            //$rootScope.classrooms_view = hdrdbx.classrooms_view;
                                            $interval(function () {

                                                var shifted = hdrdbx.classrooms_view.shift();

                                                shifted.color = classrooms_colors[itecolor];
                                                //for garanty colors for all classrooms
                                                if (itecolor == 9) {
                                                    itecolor = 0;
                                                }
                                                else {
                                                    itecolor++;
                                                }

                                                $rootScope.classrooms_view.push(shifted);
                                                $rootScope.students_count_global += shifted.students.length;

                                                if (hdrdbx.classrooms_view.length == 0) {

                                                    $window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);
                                                    $window.localStorage['hdr.students_count_global'] = angular.toJson($rootScope.students_count_global);
                                                }
                                            }, 290, hdrdbx.classrooms_view.length);

                                            //hdrdbx.classrooms_view = [];


                                        });

                                        window.resolveLocalFileSystemURL(cordova.file.cacheDirectory + "/hodoor-classrooms",
                                            function (direntry) {
                                                direntry.removeRecursively(function () {
                                                    console.log("Remove Recursively Succeeded");
                                                }, function (err) {
                                                    alert("Failed to remove directory or it's contents: " + error.code);
                                                });
                                            }, function (err) {

                                            });

                                        $scope.hide();
                                        hdrFileSystem.classrooms = [];
                                    }, function (err) {
                                        console.log(err);
                                    });


                            });



                        })



                }, function (error) {
                    alert("problem with resolve local files system");
                });

            });
        };


        $scope.showActionSheet = function (classroom) {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: '<div class="list"><a class="item hdr-to-right" href="#">حضر الجميع</a></div>' },/* 
                    { text: '<div class="list"><a class="item hdr-to-right" href="#">حضر الجميع إلا</a></div>' },
 */                    { text: '<div class="list"><a class="item hdr-to-right" href="#">تغيب الجميع</a></div>' },
                    /*                     { text: '<div class="list"><a class="item hdr-to-right" href="#">تغيب الجميع إلا</a></div>' }, */
                ],
                titleText: '<div><div class="hdr-to-right positive hdr-main-text">' + classroom.title + ' : القسم </div><div class="hdr-to-right hdr-sub-text">: تحديد المتغيبين بطريقة مختصرة حسب الحالات التالية </div></div>',
                buttonClicked: function (index) {
                    $scope.startAttendanceCall(classroom, index);
                    return true;
                }
            });


        };

        $scope.zipFilesAndImportClassrooms = function () {
            if (ionic.Platform.isWebView()) {
                var pathDist = cordova.file.cacheDirectory;
                fileChooser.open(function (uripath) {

                    //alert('file chooser uripath :' + uripath)
                    window.FilePath.resolveNativePath(uripath, successNative, failNative);
                    function successNative(finalpath) {
                        //alert("url of file is " + finalpath);
                        console.log("url of file is " + finalpath);

                        zip.unzip(finalpath, pathDist + "hodoor-classrooms/", function (arg) {
                            console.log("dist : " + pathDist);
                            if (arg == 0) {
                                //alert("unzipping is done");
                                console.log("unzipping is done");
                                $cordovaFile.createDir(pathDist, "hodoor-classrooms", false);
                                $scope.importClassrooms();

                            } else {
                                alert('يبدو أن الملف المحدد غير مناسب..');
                                console.log('errore while unzipping');
                            }
                        });

                    }

                    function failNative(err) {
                        alert('code :' + err.code + " message : " + err.message);
                        console.log("error while resolving native file path");
                    }
                });
            } else {
                console.log("classrooms page");
                $rootScope.classrooms_view.push({ id: "1", color: classrooms_colors[0], title: "TCS4", level: "جذع مشترك علمي", 'students': [{ id: '1', full_name: "عمر فيلالي", queuing_number: "10" }, { id: '2', full_name: "كريم زرهوني", queuing_number: "12" }, { id: '3', full_name: "سفياني بدر", queuing_number: "22" }] });
                $rootScope.classrooms_view.push({ id: "2", color: classrooms_colors[1], title: "TCLSH2", level: "جذع مشترك أداب و علوم إنسانية", 'students': [{ full_name: "زيد فيلالي", queuing_number: "17" }, { full_name: "كريم جلول", queuing_number: "33" }, { full_name: "سفياني حنان", queuing_number: "5" }] });
                $rootScope.classrooms_view.push({ id: "3", color: classrooms_colors[2], title: "1BacSM4", level: "أولى باك علوم رياضية", 'students': [{ full_name: "زيد فيلالي", queuing_number: "17" }, { full_name: "كريم جلول", queuing_number: "33" }, { full_name: "سفياني حنان", queuing_number: "5" }] });
                $rootScope.classrooms_view.push({ id: "4", color: classrooms_colors[3], title: "2BacSP3", level: "ثانية علوم فيزيائية", 'students': [{ full_name: "زيد فيلالي", queuing_number: "17" }, { full_name: "كريم جلول", queuing_number: "33" }, { full_name: "سفياني حنان", queuing_number: "5" }] });
                $rootScope.classrooms_view.push({ id: "5", color: classrooms_colors[4], title: "TCPS1", level: "جذع مشترك خدماتي", 'students': [{ full_name: "زيد فيلالي", queuing_number: "17" }, { full_name: "كريم جلول", queuing_number: "33" }, { full_name: "سفياني حنان", queuing_number: "5" }] });
                $rootScope.classrooms_view.push({ id: "6", color: classrooms_colors[5], title: "TCSH7", level: "جذع مشترك خدماتي", 'students': [{ full_name: "زيد فيلالي", queuing_number: "17" }, { full_name: "كريم جلول", queuing_number: "33" }, { full_name: "سفياني حنان", queuing_number: "5" }] });

                $rootScope.classrooms_view.forEach(function (classroom) {
                    $rootScope.students_count_global += classroom.students.length;
                }, this);

                $window.localStorage['hdr.classrooms_view'] = angular.toJson($rootScope.classrooms_view);
                $window.localStorage['hdr.students_count_global'] = angular.toJson($rootScope.students_count_global);
            }


        }


        $scope.showHelpPopup = function () {
            var helpPopup = $ionicPopup.show({
                templateUrl: "views/classrooms/helpclassroomsview.html",
                title: '<h3 class="title positive-bg padding light" >دليل استعمال</h3>',
                subTitle: '',
                scope: $scope,
                buttons: [
                    {
                        text: 'رجوع ',
                        type: 'button',
                        onTap: function (e) {
                            //e.preventDefault();
                        }
                    }
                ]
            });
        };


    });


