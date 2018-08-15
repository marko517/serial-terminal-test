var app = angular.module('BLE App', ['ngMaterial', 'LocalStorageModule', 'btford.socket-io']);

app.service('SocketService', ['socketFactory', function SocketService(socketFactory) {
    return socketFactory({
        ioSocket: io.connect('http://localhost:3000')
    });
}]);

app.controller('homeController', function ($scope, localStorageService, SocketService) {

    $scope.array = [];
    $scope.selectedPort;
    $scope.messages = ["asd", "dddd"];

    $scope.connect = function () {
        // TODO: Add Connect Functionality
    }

    $scope.getPorts = function () {
        SocketService.emit('getPorts');
    }

    $scope.addMessage = function () {
        $scope.messages.push($scope.description);
    }

    SocketService.on('ports', function (portList) {
        $scope.array = portList;
    })

})