/* $http({
    method: 'POST',
    crossDomain: true,
    url: 'https://massar.men.gov.ma/Account',
    data: { TypeEnseignement: '1', Cycle: '3A', Niveau: '3A31140000', Classe: '07f0611a-264c-4460-882e-bbd6ad876f4f', Matiere: '0030', Unite: '', IdSession: '1', IdControleContinu: '1', EleveSansNotes: 'false' }
}).then(function (response) {
    //console.log(response.data);
    var putedHere = document.getElementById('hdr-puthere');
    putedHere.innerHTML = response.data;
    var formSign = putedHere.getElementsByTagName('form')[0];
    console.log("====>" + formSign.action);
    formSign.action = "https://massar.men.gov.ma/Account";
    formSign.elements[1].value = "azzeddine.hlali@taalim.ma";
    formSign.elements[2].value = "1599688";

    var datatest = angular.element(formSign).serialize();
    console.log(datatest);

    //formSign.submit();
    //https://forum.ionicframework.com/t/solved-cors-with-ionic/7454

    $http({
        method: 'POST',
        url: 'https://massar.men.gov.ma/Account',
        crossDomain: true,
        data: datatest,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
        .then(function (res) {
            console.log(res.data);
        }, function (err) {
            console.log(err);
        })


}, function (err) {
    console.log("Error while retreving data from site");
    console.log(err);
});




// wind = window.open(", "kkk","width=200,height=100"); */