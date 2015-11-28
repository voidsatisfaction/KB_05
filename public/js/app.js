var KobeMono = angular.module('KobeMono',['ngRoute', 'ngFileUpload', 'ngImgCrop','angularFileUpload']);

KobeMono
    .controller('HomeController', function ($scope) {
        $scope.message = "bbbbbb";
    })
    .controller('MainCtrl', function ($scope) {
        $scope.main = "main";
    })
    .controller('NewPostCtrl', function ($scope, FileUploader) {
        $scope.myImage='';
        $scope.myCroppedImage='';


        $scope.sub_files = [];
        $scope.AddNewPost = function () {


        };
        $scope.addPhoto = function () {
            $scope.sub_files.push({src : $scope.croppedDataUrl,
                                    blob : dataURItoBlob($scope.croppedDataUrl, 'image/png')});
            console.log($scope.sub_files);
        };



        var dataURItoBlob =  function (dataURI, type) {
            // convert base64 to raw binary data held in a string
            console.log(dataURI);
            var byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // write the ArrayBuffer to a blob, and you're done
            var bb = new Blob([ab], { type: type });
            return bb;
        }
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
