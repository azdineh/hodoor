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

### Configuring Cordova for Android Development on Linux
see : 
https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#requirements-and-support
https://codeburst.io/configuring-cordova-for-android-development-on-linux-6ee4a28cd432

### Documentation
classrooms_view is an array of classroom_view object ==>  [{classroom_view},...]
classroom_view object ==> 
``` javascript
    {
        id: number,     //classroom id
        title: string,  //classroom name like : TCS4, 1BacSM...
        level: string,  //classroom level
        color : string, //hexadecimal value present the color of classroom label
        students: []    // array of classroom students
    }
```
