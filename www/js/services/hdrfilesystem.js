angular.module('hdrApp')
    .factory('hdrFileSystem', function ($q, hdrKissm, $cordovaFile, azdutils) {

        var fct = function () {

            var HdrFileSystem = {};

            HdrFileSystem.hdrDirectory = "hodoor-classrooms";
            HdrFileSystem.readOptions = {
                type: 'binary'
            };

            HdrFileSystem.getFileSystem = function (type) {

                var deferred = $q.defer();

                var fstype;
                switch (type) {
                    case '0': fstype = LocalFileSystem.PERSISTENT; break;
                    case '1': fstype = LocalFileSystem.TEMPORARY; break;
                };

                window.requestFileSystem(fstype, 0, function (fs) {
                    deferred.resolve(fs);
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;

            };

            HdrFileSystem.isHdrDirectoryExist = function (fs) {
                var deferred = $q.defer();

                fs.root.getDirectory(HdrFileSystem.hdrDirectory, { create: false }, function (parent) {
                    deferred.resolve(parent);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;

            };

            /*             HdrFileSystem.rename=function(fs){
                            $cordovaFile.moveDir(path, directory, newPath, newDirectory);
                        } */

            /**
             * [getWorkbook return a Workbook object from an Excel file]
             * @param  {[FileEntry]} file [Excel file]
             * @return {[Workbook]}      [description]
             */
            HdrFileSystem.getWorkbook = function (fileentry) {
                var deferred = $q.defer();

                if (fileentry.isFile) {
                    fileentry.file(function (file) {
                        //console.log("file mime : "+file.type);
                        var reader = new FileReader();
                        reader.onloadend = function (evt) {
                            //the file resid in evt.target.result
                            try {
                                var workbook = XLSX.read(evt.target.result, HdrFileSystem.readOptions);
                                deferred.resolve(workbook);
                            }
                            catch (error) {
                                console.log(error)
                                deferred.reject("يبدو أن هناك مشكل مع الملف الجاري.. ربما يكون الملف الذي اخترته مجرد اختصار لملف سبق حذفه");
                            }
                        };

                        if (file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                            reader.readAsBinaryString(file);
                        } else {
                            //alert("A File is not an Excel file.");
                            console.log("يبدو أن الملف الجاري لا يمثل ملف إكسيل");
                            deferred.reject("يبدو أن الملف الجاري لا يمثل ملف إكسيل");
                        }

                    }, function (error) {
                        deferred.reject("fileentry.file() error :" + error);
                    });
                }

                return deferred.promise;
            };

            /**
             * [isHdrFile determins if the parameter is a conform massar file.]
             * @return {promise} [workbook if the file is conform to the HodoorApp criteria.]
             */
            HdrFileSystem.isHdrFile = function (fileentry) {
                var q = $q.defer();

                HdrFileSystem.getWorkbook(fileentry).then(function (workbook) {

                    if (hdrKissm.isMasarNotesCC(workbook)) {
                        q.resolve(workbook);
                    } else {
                        //alert("This Excel file is not conform to Masar file"); 
                        var msg = "يبدو أن ملف الإكسيل " + fileentry.name + " لا يتطابق مع بنية ملف مسار. المرجو التأكد من أن الملف يمثل وثيقة مسار الخاصة بنقط المراقبة المستمرة";
                        q.reject(msg);
                    };

                }, function (error) {
                    q.reject(error);
                });

                return q.promise;
            };

     


            /**
             * Reading entries of excel files
             * @param  {DirectoryEntry} directoryentry the directory to read its content
             * @return {array} array of classroom object.
             */
            HdrFileSystem.readHdrFiles = function (directoryentry, callBackSuccess, callBackError) {
                //var hdrFiles=[];
                //var q = $q.defer();


                var directoryreader = directoryentry.createReader();
                directoryreader.readEntries(function (entries) {
                    if (entries.length > 0) {

                        HdrFileSystem.areHdrFiles(entries, 0,

                            function () {
                                console.log("reponse of areHdrFiles");
                                callBackSuccess();
                            }, function () {
                                callBackError()
                            });

                    } else {
                        //var msgerror="The "+HdrFileSystem.hdrDirectory+" directory is empty..";
                        var msgerror = "يبدو أن الملف  " + HdrFileSystem.hdrDirectory + " فارغ";
                        console.log(msgerror)
                        callBackError(msgerror);
                        //q.reject(msgerror);
                    };

                }, function (error) {
                    //alert("Error when reading entries of the "+HdrFileSystem.hdrDirectory+" directory..");
                    alert("حدث خطأ خلال مراجعة ملفات الملف " + HdrFileSystem.hdrDirectory);
                    callBackError(error)
                    //q.reject();
                });


                //return q.promise;
            };

            HdrFileSystem.classrooms = [];
            HdrFileSystem.areHdrFiles = function (entries, index, callBack, callBackError) {
                //var q = $q.defer();

                HdrFileSystem.isHdrFile(entries[index])
                    .then(function (workbook) {
                        //var kissmservice = new hdrKissm();
                        var kissm = hdrKissm.getKissm(workbook);
                        HdrFileSystem.classrooms.push(hdrKissm.convertToClassroom(kissm));
                        console.log('*****' + index);

                        if (index + 1 < entries.length) {
                            HdrFileSystem.areHdrFiles(entries, index + 1, callBack, callBackError);
                        }
                        else {
                            console.log("*** resolve " + index);
                            callBack();
                            //q.resolve(HdrFileSystem.classrooms);
                        }

                    }, function (error) {
                        //q.reject(error);
                        callBackError(error)
                        //alert(error);
                        console.log(error);
                    });

                //return q.promise;
            }

            /**add hdr classroom to HdrFileSystem.classrooms */
            HdrFileSystem.addClassroom = function (workbook, callBack) {
                var kissm = hdrKissm.getKissm(workbook);

                HdrFileSystem.classrooms.push(hdrKissm.convertToClassroom(kissm));

            }

            /**
             * read classrooms data from FileSystem
             * @return {Object promise} array of classroom object
             */
            HdrFileSystem.readClassrooms = function () {
                var path = cordova.file.applicationStorageDirectory;
                var filename = "hdr-classrooms.hdr";
                var deferred = $q.defer();
                $cordovaFile.checkFile(path, filename)
                    .then(function (success) {
                        $cordovaFile.readAsText(path, filename)
                            .then(function (textdata) {
                                deferred.resolve(angular.fromJson(textdata));
                            }, function (error) {
                                deferred.reject("error with reading as text of a file " + error);
                            });
                    }, function (error) { })

                return deferred.promise;
            };

            HdrFileSystem.writeClassrooms = function (classroomsarray) {
                var path = cordova.file.applicationStorageDirectory;
                var filename = "hdr-classrooms.hdr";
                var deferred = $q.defer();
                $cordovaFile.writeFile(path, filename, angular.toJson(classroomsarray), true)
                    .then(function (success) {
                        deferred.resolve(true);
                    }, function (error) {
                        deferred.reject(false);
                    });

                return deferred.promise;
            };

            HdrFileSystem.saveExcelFile = function (name) {

            }


            return HdrFileSystem;
        };

        return fct();

    });