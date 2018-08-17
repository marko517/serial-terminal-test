var app = angular.module('BLE App', ['ngMaterial', 'LocalStorageModule', 'btford.socket-io']);

app.service('SocketService', ['socketFactory', function SocketService(socketFactory) {
    return socketFactory({
        ioSocket: io.connect('http://localhost:3000')
    });
}]);

app.controller('homeController', function ($scope, localStorageService, SocketService) {

    $scope.array = [];
    $scope.selectedPort = null;
    $scope.messages = [];
    $scope.description;
    $scope.connectButtonText = "Connect";
    $scope.dropDownDisable = false;
    $scope.submitDisable = true;

    $scope.bitrate = "9600";
    $scope.dataBit = "8";
    $scope.Parity = "even";
    $scope.StopBit = "1";
    errElement = document.getElementById('errParagraph');

    var timeout;

    $scope.connectButton = function () {
        if ($scope.connectButtonText == "Connect") {
            connect();
        }
        else {
            disconnect();
        }
    }

    $scope.getPorts = function () {
        SocketService.emit('getPorts');
    }

    $scope.addMessage = function () {
        $scope.messages.push($scope.description);
        SocketService.emit('comSend', $scope.description + "\n");
    }

    SocketService.on('comReceive', function(str){
        $scope.messages.push(str);
    })

    SocketService.on('ports', function (portList) {
        $scope.array = portList;
    });

    SocketService.on('comConnectAccept', function () {
        clearInterval(timeout);
        errElement.innerHTML = "Connection established";
        $scope.connectButtonText = "Disconnect";
        $scope.dropDownDisable = true;
        $scope.submitDisable = false;
    });

    SocketService.on('comConnectRefuse', function () {
        clearInterval(timeout);
        errElement.innerHTML = "Connection refused";
        $scope.dropDownDisable = false;
    });

    SocketService.on('comDisconnect', function () {
        errElement.innerHTML = "Connection closed from other side";
        $scope.connectButtonText = "Connect";
        $scope.dropDownDisable = false;
        $scope.submitDisable = true;
    });

    function connect() {
        if ($scope.selectedPort != null) {
            if ($scope.bitrate != null) {
                if ($scope.dataBit != null) {
                    if ($scope.Parity != null) {
                        if ($scope.StopBit != null) {
                            var comConnection = {
                                "comName": $scope.selectedPort,
                                "baudRate": parseInt($scope.bitrate, 10),
                                "dataBits": parseInt($scope.dataBit, 10),
                                "parity": $scope.Parity,
                                "stopBits": parseInt($scope.StopBit, 10)
                            };
                            errElement.innerHTML = "Connecting...";
                            $scope.dropDownDisable = true;
                            SocketService.emit('comConnect', comConnection);
                            timeout = setInterval(comConnectTimeout, 5000);
                        }
                        else {
                            errElement.innerHTML = "You have not chosen stop bits";
                        }
                    }
                    else {
                        errElement.innerHTML = "You have not chosen parity";
                    }
                }
                else {
                    errElement.innerHTML = "You have not chosen data bits";
                }
            }
            else {
                errElement.innerHTML = "You have not chosen bitrate";
            }
        }
        else {
            errElement.innerHTML = "You have not chosen a port";
        }
    }

    function comConnectTimeout()
    {
        errElement.innerHTML = "Connection Timed Out";
        $scope.connectButtonText = "Connect";
        $scope.dropDownDisable = false;
        $scope.submitDisable = true;
        SocketService.emit('comDisconnect');
    }

    function disconnect() {
        SocketService.emit('comDisconnect');
        errElement.innerHTML = "Connection closed";
        $scope.connectButtonText = "Connect";
        $scope.dropDownDisable = false;
        $scope.submitDisable = true;
    }
})