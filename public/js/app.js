var KobeMono = angular.module('KobeMono',['ngRoute', 'ngFileUpload', 'ngImgCrop','angularFileUpload', 'ngMaterial']);

KobeMono
    .controller('HomeController', function ($scope) {
        $scope.message = "bbbbbb";
    })
    .controller('MainCtrl', function ($scope) {
        $scope.showSide = false;
        $scope.showModal = false;
        $scope.addNewPost = function () {
            $scope.showSide = !$scope.showSide;
        };
        $scope.addSubItem = function () {
            $scope.showModal = !$scope.showModal;
        };
        $scope.myImage='';
        $scope.myCroppedImage='';

        $scope.tag = '';
        $scope.sub_files = [];
        $scope.AddNewPost = function () {

        };
        $scope.addPhoto = function () {
            var data = {file: dataURItoBlob($scope.croppedDataUrl, 'image/png')};

            var blobToBase64 = function(blob, cb) {
                var reader = new FileReader();
                reader.onload = function() {
                    var dataUrl = reader.result;
                    if(dataUrl == undefined){
                        console.log('error');
                    }
                    var base64 = dataUrl.split(',')[1];
                    cb(base64);
                };
                reader.readAsDataURL(blob);
            };

            blobToBase64(data.file, function(base64){ // encode
                var update = {'blob': base64, 'tag': $scope.tag};
                $http.post('/api/new/photo', update)
                    .success(function(new_recording) {
                        console.log("success");
                    });
            });
        };


        var dataURItoBlob = function(dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var array = [];
            for(var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: mimeString});
        };
    });


KobeMono.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/home.html',
            controller: 'HomeController'
        })
        .when('/new_post',{
            templateUrl: '/views/newPost.html',
            controller:'NewPostCtrl'
        });
});

KobeMono.directive('modal', function () {
    return {
        template: '<div class="modal fade">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '<h4 class="modal-title">sub_file upload</h4>' +
        '</div>' +
        '<div class="modal-body" ng-transclude></div>' +
        '</div>' +
        '</div>' +
        '</div>',
        restrict: 'E',
        transclude: true,
        replace:true,
        scope:true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function(value){
                if(value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});
