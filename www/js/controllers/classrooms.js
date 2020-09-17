angular.module('hdrApp').controller('ClassroomsController',
    function ($scope, $rootScope, hdrFileSystem, $window, $state, $ionicLoading, $ionicScrollDelegate,
        hdrlocalstorage, $ionicActionSheet, $interval, $cordovaFile, $ionicPopup, smartxlsreader, azdutils) {

        $scope.page = "Classrooms";
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
            if (!$window.localStorage['hdr.classrooms']) {
                window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dir) {
                    dir.getFile(hdrlocalstorage.filename, { create: false }, function (fileEntry) {
                        //data.7dr exist

                        fileEntry.file(function (file) {
                            var reader = new FileReader();

                            reader.onloadend = function () {
                                //console.log("Successful file read: " + this.result);
                                hdrlocalstorage.loadFromJSONText(this.result);
                                console.log("Successful read loca file " + hdrlocalstorage.filename);
                                $scope.isDataFileExist = true;
                                $scope.hide();
                            };
                            reader.readAsText(file);


                        }, function (err) {
                            console.log("error while reading file..")
                            alert("Error while reading file..")
                        });

                    }, function (err) {
                        $scope.hide();
                        $scope.isDataFileExist = false;
                        console.log(hdrlocalstorage.filename + " is not exist.. show menu to import data from excel files");
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
            importDataFromFile();
        }

        $scope.$on('$ionicView.enter', function () {
            if (ionic.Platform.isWebView()) {
                if ($rootScope.classrooms_view.length == 0) {
                    importDataFromFile();
                }
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


        $scope.extarctClassroomFromExcel = function () {
            window.resolveLocalFileSystemURL("file:///android_asset/www/hodoor-classrooms-simulation/TCS-3.xlsx", function (entry) {
                hdrFileSystem.getWorkbook(entry)
                    .then(function (workbook) {
                        smartxlsreader.init(workbook, 0);

                        //var sellred = smartxlsreader.searchCellByContent(" اسم  التلميذ ");
                        //console.log(sellred);

                        //console.log(XLSX.utils.sheet_to_json(smartxlsreader.currentSheet))

                        //console.log(smartxlsreader.currentSheet[{c:3,r:15}])
                        //var ccel = "D16";
                        //var nextccel = smartxlsreader.nextCell(ccel);
                        //console.log("Next cell :"+nextccel);
                        //console.log(smartxlsreader.getCellValue(nextccel));
                        var nextccel = smartxlsreader.nextCell('D16');
                        console.log(nextccel + "  " + smartxlsreader.getCellValue(nextccel))


                    }, function (err) {
                        alert(err);
                    })

            })
        }

        $scope.importSimulatedClassrooms = function () {

            ionic.Platform.ready(function () {
                $scope.show();
                window.resolveLocalFileSystemURL("file:///android_asset/www/hodoor-classrooms-simulation", function (directoryentry) {


                    hdrFileSystem.readHdrFiles(directoryentry,
                        function () {
                            console.log("call back success..");
                            console.log(hdrFileSystem.classrooms);


                            var itecolor = 0;
                            //$rootScope.classrooms_view = hdrdbx.classrooms_view;
                            $interval(function () {
                                var shifted = hdrFileSystem.classrooms.shift();
                                shifted.color = classrooms_colors[itecolor];

                                //for to garanty colors for all classrooms
                                if (itecolor == 9) {
                                    itecolor = 0;
                                }
                                else {
                                    itecolor++;
                                }

                                hdrlocalstorage.classrooms.push(shifted);
                                $rootScope.students_count_global += shifted.students.length;


                                if (hdrFileSystem.classrooms.length == 0) {
                                    hdrlocalstorage.save('classrooms', null);
                                    $ionicScrollDelegate.scrollTop();
                                    $scope.hide();

                                }
                            }, 450, hdrFileSystem.classrooms.length);


                        })



                }, function (error) {
                    alert("problem with resolve local files system");
                    $scope.hide();
                })

            });
        };




        $scope.importClassrooms = function () {

            ionic.Platform.ready(function () {
                $scope.show();
                var pathDist = cordova.file.cacheDirectory;
                var path = pathDist + "/hodoor-classrooms";
                //console.log(path);
                window.resolveLocalFileSystemURL(path, function (directoryentry) {

                    var counter = 0;

                    var directoryReader = directoryentry.createReader();
                    directoryReader.readEntries(
                        function (entries) {

                            console.log(entries);

                            entries.forEach(function (entry) {

                                if (entry.isFile) {

                                    var indexOflastDot = entry.name.lastIndexOf(".")
                                    var extension = entry.name.substring(indexOflastDot + 1, entry.name.length)
                                    console.log(extension)

                                    if (extension == "xls" || extension == "xlsx") {
                                        counter++;
                                    }
                                }

                            });

                            if (entries.length > 0) {
                                console.log(entries);
                            }
                            else {
                                $scope.hide();
                                alert("يبدو أن الملف فارغ..")
                                // remove ecxel file imported in cache
                                window.resolveLocalFileSystemURL(cordova.file.cacheDirectory + "/hodoor-classrooms",
                                    function (direntry) {
                                        direntry.removeRecursively(function () {
                                            console.log("Remove Recursively Succeeded");
                                            $scope.hide();
                                        }, function (err) {
                                            alert("Failed to remove directory or it's contents: " + error.code);
                                        });
                                    }, function (err) {

                                    });
                                console.log("home directiry is empty..");
                            }

                            if (counter == entries.length) {
                                hdrFileSystem.readHdrFiles(directoryentry,
                                    function () {
                                        //hdrFileSystem.classrooms are available in this scope
                                        //console.log("call back success..");
                                        //console.log(hdrFileSystem.classrooms);

                                        //set classrooms colors

                                        var itecolor = 0;
                                        //$rootScope.classrooms_view = hdrdbx.classrooms_view;
                                        $interval(function () {
                                            var shifted = hdrFileSystem.classrooms.shift();
                                            shifted.color = classrooms_colors[itecolor];

                                            //for to garanty colors for all classrooms
                                            if (itecolor == 9) {
                                                itecolor = 0;
                                            }
                                            else {
                                                itecolor++;
                                            }

                                            hdrlocalstorage.classrooms.push(shifted);
                                            $rootScope.students_count_global += shifted.students.length;

                                            if (hdrFileSystem.classrooms.length == 0) {
                                                hdrlocalstorage.save('classrooms', null);

                                                // remove ecxel file imported in cache
                                                window.resolveLocalFileSystemURL(cordova.file.cacheDirectory + "/hodoor-classrooms",
                                                    function (direntry) {
                                                        direntry.removeRecursively(function () {
                                                            console.log("Remove Recursively Succeeded");
                                                            $scope.hide();
                                                        }, function (err) {
                                                            alert("Failed to remove directory or it's contents: " + error.code);
                                                        });
                                                    }, function (err) {

                                                    });
                                            }
                                        }, 450, hdrFileSystem.classrooms.length);


                                    }, function (err) {
                                        $scope.hide();
                                        alert(err)
                                    })
                            }
                            else {
                                $scope.hide();
                                alert("ليس هذا هو الملف المنتظر..");
                                // remove ecxel file imported in cache
                                window.resolveLocalFileSystemURL(cordova.file.cacheDirectory + "/hodoor-classrooms",
                                    function (direntry) {
                                        direntry.removeRecursively(function () {
                                            console.log("Remove Recursively Succeeded");
                                            $scope.hide();
                                        }, function (err) {
                                            alert("Failed to remove directory or it's contents: " + error.code);
                                        });
                                    }, function (err) {

                                    });
                            }

                        },
                        function (err) {

                        }
                    );





                }, function (error) {
                    alert("problem with resolve local files system");
                    $scope.hide();
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

        //launch selectExcelFiles filechooser
        $scope.selectExcelFiles = function () {

            console.log("selectExcelFiles")

            
            if(ionic.Platform.isWebView()){
                filehandler = shaggy.filehandler;
                function success(files) {
                    $scope.show()
                    console.log(files);
                    uris = files.uris; //array of selected uris   
                    //You can now work with the uris, to access the selected files.
                    var j = 0;
                    $interval(function () {
    
                        window.resolveLocalFileSystemURL(uris[j], function (entry) {
                            console.log(entry)
                            hdrFileSystem.isHdrFile(entry)
                                .then(function (workbook) {
                                    console.log("workbook is ready")
                                    //add classroom to hdrFileSystem.classrooms
                                    hdrFileSystem.addClassroom(workbook);
                                    var new_classroom = hdrFileSystem.classrooms.shift()
                                    if (azdutils.findClassroomViaTitle(hdrlocalstorage.classrooms, new_classroom.title)) {
                                        $scope.hide();
                                        var msg = new_classroom.title + "\n" + "قد أُدرج هذا الملف السابقا..";
                                        alert(msg)
                                    }
                                    else {
    
                                        //set classrooms colors
    
                                        var itecolor = hdrlocalstorage.classrooms.length;
    
                                        //for to garanty colors for all classrooms
                                        if (itecolor >= 9) {
                                            itecolor = (itecolor % 9) + 1;
                                        }
                                        else {
                                            itecolor++;
                                        }
    
                                        //$rootScope.classrooms_view = hdrdbx.classrooms_view;
                                        new_classroom.color = classrooms_colors[itecolor - 1];
    
                                        hdrlocalstorage.classrooms.push(new_classroom);
                                        $rootScope.students_count_global += new_classroom.students.length;
    
                                        hdrlocalstorage.save('classrooms', null);
                                        if (j == uris.length){
                                            $scope.hide();
                                            $ionicScrollDelegate.scrollBottom(true);
                                        }
                                    }
    
    
    
                                }, function (error) {
                                    $scope.hide();
                                    alert(error);
                                })
                        }, function (error) {
                            $scope.hide();
                            console.log("resolveLocalFileSystemURL error :");
                            console.log(error);
                        });
    
                        j++;
                    }, 250, uris.length)
    
                }
    
                function error(message) {
                    console.log("Got the following error: " + message);
                    $scope.hide();
                }
    
                options =
                {
                    types: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"], //array of strings
                    num: 0, // 0 (unlimited) and 1 supported
                    persistent: false, //Not yet supported
                    title: "Choose files(s)"
                };
                filehandler.choose(success, error, options);
            }else{
                //browser view
                console.log("classrooms page");
                $rootScope.classrooms_view=[];
                $rootScope.classrooms_view.push({ id: "1", color: classrooms_colors[0], title: "TCS4", level: "جذع م fd dfdبيب يبيب شيشسي صثصث سؤؤشترك علمي  بيس ", 'students': [{ id: '1', full_name: "عمر فيلالي", queuing_number: "10" }, { id: '2', full_name: "كريم زرهوني", queuing_number: "12" }, { id: '3', full_name: "سفياني بدر", queuing_number: "22" }] });
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


        $scope.zipFilesAndImportClassrooms = function () {
            if (ionic.Platform.isWebView()) {
                var pathDist = cordova.file.cacheDirectory;
                fileChooser.open({ "mime": "application/zip" }, function (uripath) {

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
                        /*                         var msg = "An error here,while resolving native file path"
                                                alert('Access denied ' + '[OR]' + msg + 'code :' + err.code + " message : " + err.message); */
                        alert(err);
                        console.log(err);
                    }

                    //alert('file chooser uripath :' + uripath)
                    window.FilePath.resolveNativePath(uripath, successNative, failNative);

                }, function () { });
            } else {
                console.log("classrooms page");
                $rootScope.classrooms_view.push({ id: "1", color: classrooms_colors[0], title: "TCS4", level: "جذع م fd dfdبيب يبيب شيشسي صثصث سؤؤشترك علمي  بيس ", 'students': [{ id: '1', full_name: "عمر فيلالي", queuing_number: "10" }, { id: '2', full_name: "كريم زرهوني", queuing_number: "12" }, { id: '3', full_name: "سفياني بدر", queuing_number: "22" }] });
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


