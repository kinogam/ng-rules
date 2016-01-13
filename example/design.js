function DemoController($scope, $rules){
    $scope.passengers = [
        {
            pType: 0,
            firstName: 'tesr',
            middleName: 'eve',
            lastName: 'kinogam',
            nationality: {
                id: "CN",
                EN: "China",
                ZH: "中国大陆"
            },
            cType: 0,
            cNumber: '123',
            gender: 'Male',
            birthDay: '19830823',
            expDay: '20160823',
            ffType: 'xxx',
            ffNumber: 123
        },
        {
            pType: 0,
            firstName: 'tesr',
            middleName: 'eve',
            lastName: 'kinogam',
            nationality: {
                id: "CN",
                EN: "China",
                ZH: "中国大陆"
            },
            cType: 0,
            cNumber: '123',
            gender: 'Male',
            birthDay: '19830823',
            expDay: '20160823',
            ffType: 'xxx',
            ffNumber: 123
        }
    ];

    $scope.myForm = $rules({
        '*': 'required',
        '$group.firstName+$group.middleName+$group.lastName': '!same',
        'Name$': 'maxLength:5',
        'birthDay': 'number|maxLength:5|custom'
    });



}