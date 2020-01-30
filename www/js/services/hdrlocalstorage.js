angular.module('hdrApp')
    .factory('hdrlocalstorage', function ($window, azdutils, $rootScope) {
        //this service must called only when ionicPlatfom is ready

        var classroom = {
            id: null,
            title: "",
            level: "",
            color: "",
            school: {
                name: "",
                rd: "",
                academy: ""
            },
            teacher: {
                name: "",
                subject: ""
            },
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
            students_count: 0, // le nombre des élèves peut changer,ce champ permet de garder le nombre total à l'instant d'enregistrment d'une session
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
            vm.removed_students = [];
            //hdr.helpPopupShown

            vm.filename = "data.hdr"


            vm.init = function () {
                vm.classrooms = $window.localStorage['hdr.classrooms'] ? angular.fromJson($window.localStorage['hdr.classrooms']) : [];
                vm.sessions = $window.localStorage['hdr.sessions'] ? angular.fromJson($window.localStorage['hdr.sessions']) : [];
                vm.removed_students = $window.localStorage['hdr.removed_students'] ? angular.fromJson($window.localStorage['hdr.removed_students']) : [];

                $rootScope.classrooms_view = vm.classrooms; // classrooms_view point on hdrlocalstorage
                //$rootScope.sessions_view = []  //on affecte pas vm.sessions ms progressivement dans sessionhistory ctrl
                $rootScope.students_count_global = vm.calculateStudentsCount();
            }


            vm.clear = function () {
                $window.localStorage.removeItem("hdr.classrooms");
                $window.localStorage.removeItem("hdr.sessions");
                $window.localStorage.removeItem("hdr.removed_students");

                vm.removeFile();

                vm.init();

            }

            vm.updateStorage = function () {
                $window.localStorage['hdr.classrooms'] = angular.toJson(vm.classrooms);
                $window.localStorage['hdr.sessions'] = angular.toJson(vm.sessions);
                $window.localStorage['hdr.removed_students'] = angular.toJson(vm.removed_students);

                vm.saveInFile();
            }


            vm.save = function (object_name, val) {
                switch (object_name) {
                    case 'classrooms':
                        $window.localStorage['hdr.classrooms'] = angular.toJson(vm.classrooms);
                        break;

                    case 'session':
                        // val représente session

                        // affecte des Id aux sessions
                        if (vm.sessions.length == 0) {
                            val.id = 1;
                        }
                        else {
                            val.id = vm.sessions[0].id + 1;
                        }

                        vm.sessions.unshift(val)
                        $window.localStorage['hdr.sessions'] = angular.toJson(vm.sessions);

                        val.absents_students.forEach(function (absentStudent) {
                            vm.addAbsentSessionToStudent(val, absentStudent);
                        });


                        break;


                    default:
                        break;
                }

                //update object
                vm.init();
                vm.saveInFile();
                
            }



            //function add directly to absent students; their sessions which they were absents, in order to show them in student card, whitout using all process
            vm.addAbsentSessionToStudent = function (session, student) {

                var see_clone = { ...session };
                console.log(see_clone);

                var ind = see_clone.absents_students.findIndex(function (item) {
                    return item.id == student.id;
                })

                see_clone.is_student_fix_problem = session.absents_students[ind].is_student_fix_problem == true ? 1 : 0;
                delete see_clone.absents_students;
                delete see_clone.observation;
                delete see_clone.classroom_title;






                //find student in classrooms
                var i_classroom = vm.findIndexOf('classrooms', { id: student.id_classroom });
                var i_student = vm.findIndexOf('students', student);


                if (vm.classrooms[i_classroom].students[i_student].absentSessions)
                    vm.classrooms[i_classroom].students[i_student].absentSessions.push(see_clone);
                else
                    vm.classrooms[i_classroom].students[i_student].absentSessions = [see_clone];


                $window.localStorage['hdr.classrooms'] = angular.toJson(vm.classrooms);
                vm.init();

            }


            vm.getRecentStudent_forSessionView = function (student) {
                var i_classroom = vm.findIndexOf('classrooms', { id: student.id_classroom });
                var i_student = vm.findIndexOf('students', student);
                var recentstudent = angular.copy(vm.classrooms[i_classroom].students[i_student]);
                recentstudent.is_student_fix_problem = student.is_student_fix_problem;

                return angular.copy(recentstudent);

            }


            vm.findIndexOf = function (object_name, val) {
                var index = null;
                switch (object_name) {
                    case 'classrooms':
                        // val is classroom
                        index = vm.classrooms.findIndex(function (item, index, arr) {
                            return item.id == val.id;
                        });
                        break;
                    case 'sessions':
                        // val is session
                        index = vm.sessions.findIndex(function (item, index, arr) {
                            return item.id == val.id;
                        });
                        break;
                    case 'classrooms':
                        // val is classroom
                        index = vm.classrooms.findIndex(function (item, index, arr) {
                            return item.id == val.id;
                        });
                        break;
                    case 'students':
                        // val is student
                        var i = vm.findIndexOf('classrooms', { id: val.id_classroom });
                        index = vm.classrooms[i].students.findIndex(function (item, index, arr) {
                            return item.id == val.id;
                        });
                        break;
                    case 'removed_students':
                        // val is student
                        index = vm.removed_students.findIndex(function (item, index, arr) {
                            return item.id == val.id;
                        });
                        break;
                }

                return index;
            }
            vm.updateSessionObservation = function (session, obs) {
                //update in $scope
                session.observation = obs;

                //update in localstorage
                var ind = vm.findIndexOf('sessions', session);
                //console.log("index of current session :" + ind);
                vm.sessions[ind].observation = obs;

                vm.updateStorage();
            }

            vm.updateSession = function (session) {

                var ind = vm.findIndexOf('sessions', session);
                vm.sessions[ind] = session;
                vm.updateStorage();

            }

            vm.removeSession = function (session) {
                var ind = vm.findIndexOf('sessions', session);
                //console.log("index of current session :" + ind);
                vm.sessions.splice(ind, 1);

                //remove absentSessions related in student obj
                session.absents_students.forEach(function (absentStudent) {
                    vm.removeAbsentSession(session, absentStudent);
                })


                vm.updateStorage();
            }
            hdrlocalstorage
            vm.removeAbsentSession = function (session, student) {
                var i_classroom = vm.findIndexOf('classrooms', { id: student.id_classroom });
                var i_student = vm.findIndexOf('students', student);

                var arr = vm.classrooms[i_classroom].students[i_student].absentSessions;
                if (arr) {

                    var i_session = arr.findIndex(function (item) {
                        return item.id == session.id;
                    })
                    arr.splice(i_session, 1);
                }

                vm.updateStorage();
            }

            vm.updateAbsentSessionInfo = function (attrib, student, session) {
                var i_classroom = vm.findIndexOf('classrooms', { id: student.id_classroom });
                var i_student = vm.findIndexOf('students', student);

                var i_session = vm.classrooms[i_classroom].students[i_student].absentSessions.findIndex(function (item) {
                    return item.id == session.id
                })


                switch (attrib) {
                    case 'is_student_fix_problem':
                        vm.classrooms[i_classroom].students[i_student].absentSessions[i_session].is_student_fix_problem = student.is_student_fix_problem == true ? 1 : 0;
                        break;

                    case 'isExamSession':
                        vm.classrooms[i_classroom].students[i_student].absentSessions[i_session].isExamSession = session.isExamSession;
                        break;
                    case 'parity':
                        vm.classrooms[i_classroom].students[i_student].absentSessions[i_session].parity = session.parity;
                        break;
                    case 'title':
                        vm.classrooms[i_classroom].students[i_student].absentSessions[i_session].title = session.title;
                        break;

                    default:
                        break;
                }

                vm.updateStorage();
            }



            vm.updateStudent = function (student) {
                var ind_student = vm.findIndexOf('students', student);
                var ind_classroom = vm.findIndexOf('classrooms', { id: student.id_classroom });
                vm.classrooms[ind_classroom].students[ind_student] = student;

                vm.updateStorage();
            }

            vm.addStudent = function (student, index_where) {
                //var ind_student = vm.findIndexOf('students', student);
                var ind_classroom = vm.findIndexOf('classrooms', { id: student.id_classroom });
                vm.classrooms[ind_classroom].students.splice(index_where, 0, student);

                //recalculate queuing_numbers
                vm.classrooms[ind_classroom].students.forEach(function (item, index) {
                    item.queuing_number = index + 1;
                })

                // if the added student is a revenent student, we remove it from removed_students array
                var ind_removed_student = vm.findIndexOf('removed_students', student);
                if (ind_removed_student >= 0) {
                    vm.removed_students.splice(ind_removed_student, 1);
                }

                vm.updateStorage();
            }

            vm.removeStudent = function (student) {
                var ind_student = vm.findIndexOf('students', student);
                var ind_classroom = vm.findIndexOf('classrooms', { id: student.id_classroom });
                vm.classrooms[ind_classroom].students.splice(ind_student, 1);

                //keep removed student in removed_students array, for later user..
                vm.removed_students.push(student);

                //recalculate queuing_numbers
                vm.classrooms[ind_classroom].students.forEach(function (item, index) {
                    item.queuing_number = index + 1;
                })

                $rootScope.students_count_global = vm.calculateStudentsCount();

                vm.updateStorage();
            }

            // return classroom object
            vm.getStudentClassroom = function (student) {
                var classroom = null;
                var ind_of_classroom = vm.findIndexOf('classrooms', { id: student.id_classroom })
                classroom = vm.classrooms[ind_of_classroom];
                return classroom;
            }





            vm.calculateStudentsCount = function () {
                var count = 0;
                vm.classrooms.forEach(function (classroom) {
                    count += classroom.students.length;
                })
                return count;
            }

            //requise si on veut restaurer les informations après une désinstalation 
            vm.saveInFile = function () {

                var hdr = {
                    classrooms: $window.localStorage['hdr.classrooms'] ? angular.fromJson($window.localStorage['hdr.classrooms']) : [],
                    sessions: $window.localStorage['hdr.sessions'] ? angular.fromJson($window.localStorage['hdr.sessions']) : [],
                    removed_students: $window.localStorage['hdr.removed_students'] ? angular.fromJson($window.localStorage['hdr.removed_students']) : []

                }
                azdutils.saveInFile(vm.filename, angular.toJson(hdr));

            }

            vm.removeFile = function () {
                azdutils.removeFile(vm.filename);
            }

            vm.loadFromJSONText = function (dataAsText) {
                var hdr = angular.fromJson(dataAsText);
                vm.classrooms = hdr.classrooms;
                vm.sessions = hdr.sessions;
                vm.removed_students = hdr.removed_students;

                vm.updateStorage();
                vm.init();
            }


            return vm;
        };


        return hdrlocalstorage();
    });