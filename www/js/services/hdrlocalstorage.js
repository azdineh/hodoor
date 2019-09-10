angular.module('hdrApp')
    .factory('hdrlocalstorage', function ($window, $filter) {
        //this service must called only when ionicPlatfom is ready

        var classroom = {
            id: null,
            title: "",
            level: "",
            color: "",
            students: []
        }

        var student = {
            id: null,
            birth_date: "",
            full_name: "",
            id_classroom: null,
            isBarred: null,
            massar_number: "",
            observation: "",
            queuing_number: "",
            registration_number: ""
        }

        var session = {
            id: null,
            classroom_title: "",
            unix_time: null,
            title: "",
            absents_students: [],
            parity: "",
            isExamSession: null,
            observation: ""

        }

        var academy = {
            id: null,
            name: ""
        }
        
        var rd = {
            id: null,
            name: ""
        }

        var school = {
            id: null,
            name: ""
        }

        var teacher = {
            id: null,
            full_name: "",
            subject: ""
        }


        var hdrlocalstorage = function () {
            var vm = {};
            vm.classrooms = [];
            vm.sessions = [];



            return vm;
        };


        return hdrlocalstorage();
    });