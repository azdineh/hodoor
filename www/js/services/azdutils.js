angular.module('hdrApp')
    .factory('azdutils', function ($q, $ionicPopup, $timeout) {
        // Service logic
        // ...
        var fct = function () {
            var that = {};

            /**
             * @param date_string as 04/06/2003
             * @returns Date object
             */
            that.dateTo_ISO8601 = function (date_string) {
                var str = date_string.trim();
                var dd = parseInt(str.substr(0, 2));
                var mm = parseInt(str.substr(3, 2)) - 1; // JS counts months from 0 to 11;
                var yyyy = parseInt(str.substr(6, 4));

                return new Date(yyyy, mm, dd);
            }

            that.mergeAllStudentInOneArray = function (classrooms) {
                var array_result = [];
                classrooms.forEach(function (classroom, index) {
                    array_result = array_result.concat(classroom.students);
                });
                return array_result;
            }

            /**
             * data in text
             * and reslove file URL
             */
            that.saveInFile = function (filename, dataAsText) {
                var q = $q.defer();

                //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dirEntry) {

                    //externalRootDirectory : /

                    // Creates a new file or returns the file if it already exists.
                    //console.log(dirEntry);
                    dirEntry.getFile(filename, { create: true, exclusive: false }, function (fileEntry) {

                        //console.log("fileEntry is file?" + fileEntry.isFile.toString());
                        //console.log(fileEntry);
                        // fileEntry.name == 'someFile.txt'
                        // fileEntry.fullPath == '/someFile.txt'
                        fileEntry.createWriter(function (fileWriter) {

                            fileWriter.onwriteend = function () {
                                //console.log("Successful file write...");
                                console.log("Data has saved in  : " + filename)
                                q.resolve(fileEntry.toURL());
                            };

                            fileWriter.onerror = function (e) {
                                console.log("Failed file write: " + e.toString());
                                q.reject(e);
                            };


                            if (filename && dataAsText) {
                                fileWriter.write(dataAsText);
                            }

                        });

                    }, function (err) {
                        console.log("error while create file")
                        console.log(err);
                        q.reject(err);
                    });
                }, function (err) {
                    console.log('error while request of file system');
                    console.log(err);
                    q.reject(err);
                });


                return q.promise;

            }
            that.saveAndOpen = function (filename, data, mimeType) {
                var blob = new Blob([data], { type: mimeType });
                that.saveInFile(filename, blob)
                    .then(function (fileurl) {
                        //open file
                        cordova.plugins.fileOpener2.open(fileurl, mimeType, {
                            error: function error(err) {
                                console.error(err);
                                alert("Unable to download file");
                            },
                            success: function success() {
                                console.log("success with opening the file");
                            }
                        });

                    }, function (err) {
                        console.log(err)
                    });

            }

            that.createNewExcelFile = function (sheets_array, sheets_names_aray) {
                //var tbl = document.getElementById(ws id_table);
                //var sheet = XLSX.utils.table_to_sheet(tbl);

                var wb = XLSX.utils.book_new();

                //right to left orientation
                if (!wb.Workbook) wb.Workbook = {};
                if (!wb.Workbook.Views) wb.Workbook.Views = [];
                if (!wb.Workbook.Views[0]) wb.Workbook.Views[0] = {};
                wb.Workbook.Views[0].RTL = true;


                sheets_array.forEach(function (sheet, index) {
                    XLSX.utils.book_append_sheet(wb, sheet, sheets_names_aray[index]);
                })


                /* XLSX.write(wb, 'out.xls'); */

                /* bookType can be 'xlsx' or 'xlsm' or 'xlsb' */
                var wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };

                var wbout = XLSX.write(wb, wopts);

                function s2ab(s) {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
                data = s2ab(wbout);
                mimetype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";


                that.saveAndOpen("test.xlsx", data, mimetype);

            }

            that.removeFile = function (filename) {
                var q = $q.defer();

                window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dir) {

                    dir.getFile(filename, { create: false }, function (fileEntry) {
                        fileEntry.remove(function (file) {
                            console.log(filename + "file removed!");
                            q.resolve(file);
                        }, function (error) {
                            console.log("error occurred: " + error.code);
                            q.reject(err);
                        }, function () {
                            alert("file does not exist");
                            q.reject(err);
                        });
                    });

                });

                return q.promise;

            }

            that.isBirthday = function (date_string) {
                var flag = false;

                var str = date_string.trim();
                var dd = parseInt(str.substr(0, 2));
                var mm = parseInt(str.substr(3, 2)) - 1; // JS counts months from 0 to 11;
                /*               var yyyy = parseInt(str.substr(6, 4)); */

                var today = new Date(Date.now());
                if (dd == today.getDate() && mm == today.getMonth()) {
                    flag = true;
                }

                return flag;
            }


            /**
             * return classroom abject via its title if it exists
             */
            that.findClassroomViaTitle = function (classrooms_array, classroom_name) {
                return classroom = classrooms_array.find(function (classroom) {
                    return classroom_name == classroom.title;
                })
            }


            that.showConfirmation = function (callback, message) {
                var template = "";
                template = '<p dir="rtl">' + message + '</p>';


                var confirmPopup = $ionicPopup.confirm({
                    title: 'تأكيد',
                    template: template,
                    cancelText: 'إلغاء',
                    okText: 'نعم'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        console.log('You are sure');
                        //$scope.removeSeveralSessions($scope.sessionsSelected);
                        $timeout(function () {
                            callback();
                        }, 350)
                    } else {
                        console.log('You are not sure');
                    }
                });
            }

            that.sumMarks = function (student) {
                var sum = 0;
                if (student.marks) {
                    student.marks.forEach(function (mark) {
                        sum += mark.value;
                    });
                }
                else {
                    sum = 0;
                }
                return sum;
            }


            return that;
        };



        return fct();
    });