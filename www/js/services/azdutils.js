angular.module('hdrApp')
    .factory('azdutils', function () {
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



            return that;
        };



        return fct();
    });