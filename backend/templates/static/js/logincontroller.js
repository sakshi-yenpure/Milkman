app.controller('LoginController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
    $scope.login = function() {
        $scope.error = null;
        AuthService.login($scope.email, $scope.password)
            .then(function() {
                $location.path('/staff');
            })
            .catch(function(err) {
                $scope.error = err.data.detail || 'Login failed';
            });
    };
}]);
