angular.module('hdrApp')
    .factory('smartxlsreader', function ($q, hdrFileSystem) {
        // Service logic
        // ...
        var fct = function () {
            var that = {};

            that.currentWorkbook = null;
            that.currentSheet = null;

            that.init = function (workbook, sheet_index) {
                that.currentWorkbook = workbook;
                that.currentSheet = workbook.Sheets[workbook.SheetNames[sheet_index]];
            }

            that.getCellValue = function (coord) {
                return that.currentSheet[coord].v;
            }

            that.removesHamza = function (str) {
                var str0 = str.replace("أ", "ا");
                str0 = str0.replace("إ", "ا");
                return str0;
            }

            that.removesAllSpaces = function (str) {
                return str.replace(/\s+/g, '');

            }

            that.isEqual = function (str1, str2) {
                var str10 = that.removesHamza(str1);
                str10 = that.removesAllSpaces(str10);

                var str20 = that.removesHamza(str2)
                str20 = that.removesAllSpaces(str20);

                return str10 === str20;
            }

            /**
             * return cell ref as string like 'B12'
             */
            that.searchCellByContent = function (str) {
                var cells = that.currentSheet;
                var celTarget = "";
                for (var x in cells) {
                    /* all keys that do not begin with "!" correspond to cell addresses */
                    //console.log(cel);
                    if (x[0] === '!') continue;
                    if (cells[x].t !== 's') continue;
                    //console.log(cells[x]);
                    if (that.isEqual(str, "" + cells[x].v)) {
                        celTarget = cells[x];
                        break;
                    }

                }
                return celTarget;
            }


            that.nextCell = function (cell, direction) {
                var direction = direction || 'under';
                var nextcell = cell;

                if (direction == 'under') {

                    decoded_cell = XLSX.utils.decode_cell(cell);
                    //console.log("decoded_cell :"+decoded_cell);
                    decoded_cell.r++;
                    nextcell = XLSX.utils.encode_cell(decoded_cell)
                    return nextcell;

                }

            };

            that.nextCellObj = function (cell, direction) {
                var cel = that.nextCell(cell, direction);
                return that.currentSheet[cel];

            }


            /**
             * retrurn cell coord as string like 'B5' or 'C13'
             */
            that.locateCell = function () {



                var isit = true;

                var cellToVerify = 'D16';
                var sheet = workbook.Sheets[workbook.SheetNames[0]];
                var str1 = 'إسم التلميذ'.replace(/\s+/g, '');
                if (str0 == str1) {
                    isit = true;
                }
                else {
                    isit = false;
                }

                return isit;
            }



            return that;
        };



        return fct();
    });