angular.module('hdrApp')
    .factory('hdrKissm', function () {
        // Service logic
        // ...
        var fct = function () {
            var that = {};
            /**
             * srlz is an object groups the zerialazable attributes of the parent objetc.
             * @type {Object}
             */
            that.kissm = function () { };
            that.kissm.prototype.issm = '';
            that.kissm.prototype.mostawa = '';
            that.kissm.prototype.academy = '';
            that.kissm.prototype.rd = '';
            that.kissm.prototype.school = '';
            that.kissm.prototype.teachername = '';
            that.kissm.prototype.teachersubject = '';
            //that.kissm.prototype.ostade = '';
            that.kissm.prototype.talaamiid = [];

            that.defaultSheet = '';
            that.tilmiid = function () {
                var thati = {};
                thati.ra9mTasjiil = 0; // student ID
                thati.ra9mMasar = 0;
                thati.issmKamel = '';
                thati.tari5Izdiad = '';
                return thati;
            };

            /**
             * [isMasarNotesCC verify if the current excel sheet presents Masar NotesCC]
             * @return {Boolean} [description]
             */
            that.isMasarNotesCC = function (workbook) {
                var isit = true;
                var cellToVerify = 'D16';
                var sheet = workbook.Sheets[workbook.SheetNames[0]];
                var str0 = sheet[cellToVerify].v.replace(/\s+/g, '');
                var str1 = 'إسم التلميذ'.replace(/\s+/g, '');
                if (str0 == str1) {
                    isit = true;
                }
                else {
                    isit = false;
                }

                return isit;
            };

            that.nextCell = function (cell, direction) {
                var directiont = direction || 'under';
                switch (directiont) {
                    case 'under':
                        cell = cell.charAt(0) + (parseInt(cell.substring(1, cell.lenght)) + 1);
                        return cell;
                }
            };
            // see the sheet as a array[][] of cells
            // and cells are the cordonnates colone and line example cell='D9'
            that.readIssm = function (sheet, cell) {
                var cell = cell || 'I9';
                var sheet = sheet || that.defaultSheet;
                return sheet[cell].v;
            };
            that.readMostawa = function (sheet, cell) {
                var cell = cell || 'D9';
                var sheet = sheet || that.defaultSheet;
                return sheet[cell].v;
            };
            that.readAcademy = function (sheet, cell) {
                var cell = cell || 'D7';
                var sheet = sheet || that.defaultSheet;
                return sheet[cell].v;
            };
            that.readRD = function (sheet, cell) {
                var cell = cell || 'I7';
                var sheet = sheet || that.defaultSheet;
                return sheet[cell].v;
            };
            that.readSchool = function (sheet, cell) {
                var cell = cell || 'O7';
                var sheet = sheet || that.defaultSheet;
                return sheet[cell].v;
            };
            that.readTeacherName = function (sheet, cell) {
                var cell = cell || 'O9';
                var sheet = sheet || that.defaultSheet;
                return sheet[cell].v;
            };
            that.readTeacherSubject = function (sheet, cell) {
                var cell = cell || 'O11';
                var sheet = sheet || that.defaultSheet;
                return sheet[cell].v;
            };
            that.readTalaamiid = function (sheett) {
                var talaamiid = [];
                // reading info from sheet vertically
                var sheet = sheett || that.defaultSheet;
                var crrHeadCell = '';
                var colsNames = {
                    ra9mTasjiil: 'B18',
                    ra9mMasar: 'C18',
                    issmKamel: 'D18',
                    tari5Izdiad: 'F18'
                };
                crrHeadCell = colsNames.ra9mTasjiil;
                var crrHeadCellValue = '';

                while (angular.isDefined(sheet[crrHeadCell]) && angular.isDefined(sheet[colsNames.ra9mMasar])) {
                    var attilmid = that.tilmiid();
                    //if (crrHeadCell ==='B80') break;
                    crrHeadCellValue = sheet[crrHeadCell].v;
                    attilmid.ra9mTasjiil = crrHeadCellValue;
                    attilmid.ra9mMasar = sheet[colsNames.ra9mMasar].v;
                    attilmid.issmKamel = sheet[colsNames.issmKamel].v;
                    attilmid.tari5Izdiad = sheet[colsNames.tari5Izdiad].v;
                    crrHeadCell = that.nextCell(crrHeadCell);
                    colsNames.ra9mMasar = that.nextCell(colsNames.ra9mMasar);
                    colsNames.issmKamel = that.nextCell(colsNames.issmKamel);
                    colsNames.tari5Izdiad = that.nextCell(colsNames.tari5Izdiad);
                    //console.log(crrHeadCell + " --- " + attilmid.issmKamel + " -- ");
                    talaamiid.push(attilmid);
                }


                return talaamiid;
            };
            that.getKissm = function (workbook) {
                var sheet = workbook.Sheets[workbook.SheetNames[0]];
                var kis = new that.kissm();
                kis.issm = that.readIssm(sheet);
                kis.mostawa = that.readMostawa(sheet);
                kis.academy = that.readAcademy(sheet);
                kis.rd = that.readRD(sheet);
                kis.school = that.readSchool(sheet);
                kis.teachername = that.readTeacherName(sheet);
                kis.teachersubject = that.readTeacherSubject(sheet);
                kis.talaamiid = that.readTalaamiid(sheet);
                return kis;
            };
            that.getAkssam = function (workbooks) {
                var akssamArray = [];
                angular.forEach(workbooks, function (workbook) {
                    //console.log('current sheet :'+workbook.Sheets[workbook.SheetNames[0]]['I9'].v);
                    akssamArray.push(that.getKissm(workbook));
                });
                return akssamArray;
            };
            that.isKissmExist = function (kissm, arrayOfKissm) {
                var whachkayn = false;
                angular.forEach(arrayOfKissm, function (value) {
                    if (value.issm === kissm.issm) {
                        whachkayn = true;
                    }
                });

                return whachkayn;
            };
            that.getAbsoulateArray = function (array1, array2) {
                var absarray = array1;
                angular.forEach(array2, function (value) {
                    if (!that.isKissmExist(value, absarray)) {
                        absarray.push(value);
                    };
                });
                return absarray;
            };




            return that;
        };



        return fct();
    });