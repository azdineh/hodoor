# hodoor
Application pour les enseignants aidant à marquer et garder l'historique des absences des élèves. 


### Links
In google play : https://goo.gl/z33iyN

### Quick Setup

    npm install -g ionic
    npm install -g cordova
    git clone https://github.com/azdineh/hodoor.git
    cd hodoor
    sudo bower --allow-root install
    mv -T bower_components www/lib
    cordova platform add android
    cordova run android

### Firebase configuration
    Don't forget to add google-services.json firebase configuration file to the project
    
### Configuring Cordova for Android Development on Linux
see : 
https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#requirements-and-support
https://codeburst.io/configuring-cordova-for-android-development-on-linux-6ee4a28cd432

### Documentation
classrooms is an array of classroom object  [{classroom},...]
<br>
classroom object
``` javascript
    classroom : {
        id: number,     //classroom id
        title: string,  //classroom name like : TCS4, 1BacSM...
        level: string,  //classroom level
        color : string, //hexadecimal value presents the color of classroom label
        school: {
            name: kissm.school,
            rd: kissm.rd,
            academy:kissm.academy
        },
        teacher: {
            name: kissm.teachername,
            subject: kissm.teachersubject
        },
        students: []    // array of classroom students object
    }
```
student object
``` javascript
    student :{
        id: number, // student id
        birth_date: string, //date as string format : "25-08-2001"
        full_name: string, // student full name like "مخلوفي إلهام"
        id_classroom: number, // student classroom id
        isBarred: 0, //  0 or 1 value for markin is student is barred from the list or not
        massar_number: string, // student id in massar database, value like "S135061522"
        observation: string, // observation written by teacher over student
        queuing_number: number // student number in classroom, it mmight be changed in any time by teacher(user)
        registration_number: string // student id in school register like "7216523"
    }
```
<br>
Les ensignants peuvent enregistrer des sessions in sessions[{session},...].
<br>
l'objet session contient :

``` javascript
    session:{
        id: number,
        classroom_title:string, // classroom title used as an identifcator of the classroom instead od classroom.id
        unix_time: number, //time when the session was added = Date.now()
        title: string, // session duration like 10-12
        absents_students: [] // array of absents students
        students_count : number  // le nombre des élèves peut changer,ce champ permet de garder le nombre total à l'instant d'enregistrment d'une session 
        parity: string, // session parity is all classroom attend or just by group, tree values are possibles : all,odd or even .
        isExamSession: numbre, // is a isExamSession session : 0 non, 1 yes.
        observation: ""
}
``` 
Pour chaque élève absent, on ajoute un champs suplémentaire (is_student_fix_problem) pour désigner si il a justifié son absnece et être accepté par le prof(élève entre dans la salle, et le prof le marquer comme en retard)
<br>

removed_students est un array où on garde les élèves supprimés pour une éventuelle utilisation ultérieure..

<br>
