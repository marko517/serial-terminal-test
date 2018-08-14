var app = angular.module('BLE App', ['ngMaterial', 'LocalStorageModule', 'btford.socket-io']);

app.service('SocketService', ['socketFactory', function SocketService(socketFactory) {
    return socketFactory({
        ioSocket: io.connect('http://localhost:3000')
    });
}]);

app.controller('homeController', function($scope, localStorageService, SocketService) {

    $scope.array = [];

    $scope.connect = function() {
        // TODO: Add Connect Functionality
    }

    SocketService.on('ports', function(arr){
        console.log(arr);
        $scope.array = [];
        arr.forEach(element => {
            $scope.array.push({ name: element.comName, manufacturer: element.manufacturer});
        });
    })

})