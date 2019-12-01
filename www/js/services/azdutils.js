angular.module('hdrApp')
    .factory('azdutils', function ($q) {
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
                                q.resolve(1);
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


            /* that.openFile = function (filename) {
                var q = $q.defer();
                if (filename) {
                    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dir) {
                        dir.getFile(filename, { create: false }, function (fileEntry) {
                            //data.7dr exist
                            fileEntry.file(function (file) {
                                var reader = new FileReader();

                                reader.onloadend = function () {
                                    //console.log("Successful file read: " + this.result);
                                    console.log("Successful read loca file " + filename);

                                };

                                reader.readAsText(file);


                            }, function (err) {
                                console.log("error while reading file..")
                                alert("Error while reading file..")
                            });

                        }, function (err) {
                            console.log("data33.7dr is not exist.. show menu to import data from excel files");
                        });


                    });
                }
                else {
                    console.log('file name is empty')
                }
            } */


            return that;
        };



        return fct();
    });