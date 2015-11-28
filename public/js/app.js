var KobeMono = angular.module('KobeMono',['ngRoute', 'ngFileUpload', 'ngImgCrop','angularFileUpload', 'ngMaterial']);

KobeMono
    .service('img_data', function () {
        var img;
        return {
            set_img: function (item) {
                img = item;
            },
            get_img: function () {
                return img;
            }
        }
    })
    .controller('HomeController', function ($scope) {
        $scope.posts = [{title: 'test', context:'wow,test', image:'./../uploads/bWqfKCq2Fj'},
            {title: 'test', context:'wow,test', image:'./../uploads/bWqfKCq2Fj', sub_images: [{tag: 'hat', image: './../uplaods/bWqfKCq2Fj'}]},
            {title: 'test', context:'wow,test', image:'./../uploads/bWqfKCq2Fj'},
            {title: 'test', context:'wow,test', image:'./../uploads/bWqfKCq2Fj'},
            {title: 'test', context:'wow,test', image:'./../uploads/bWqfKCq2Fj'},
            {title: 'test', context:'wow,test', image:'./../uploads/bWqfKCq2Fj'},
            {title: 'test', context:'wow,test', image:'./../uploads/bWqfKCq2Fj'},
            {title: 'test', context:'wow,test', image:'./../uploads/bWqfKCq2Fj'},
            {title: 'test', context:'wow,test', image:'./../uploads/bWqfKCq2Fj'},
            {title: 'test', context:'wow,test', image:'./../uploads/bWqfKCq2Fj'},
            {title: 'test', context:'wow,test', image:'./../uploads/bWqfKCq2Fj'}];
    })
    .controller('MainCtrl', function ($scope, $mdDialog, $mdMedia, $timeout, $mdSidenav, $log, img_data) {
        $scope.toggleLeft = buildToggler('left');
        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildToggler(navID) {
            return function() {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }
        }




    }).controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
        };
    })
    .controller('NewPostCtrl', function ($scope, $timeout, $mdDialog, $log, img_data, $mdMedia) {

        $scope.showModal = false;
        $scope.addSubItem = function () {
            $scope.showModal = !$scope.showModal;
        };
        $scope.myImage='';
        $scope.myCroppedImage='';

        $scope.tag = '';
        $scope.sub_files = [];

        $scope.AddNewPost = function(ev) {
            img_data.set_img($scope.photo);
            console.log($scope.photo);
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'views/newSubPhoto.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $mdMedia('sm') && $scope.customFullscreen
            })
                .then(function(answer) {
                    $scope.sub_files.push(answer);
                    console.log($scope.sub_files);
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            $scope.$watch(function() {
                return $mdMedia('sm');
            }, function(sm) {
                $scope.customFullscreen = (sm === true);
            });
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

function DialogController($scope, $mdDialog, $http, img_data) {
    $scope.photo = img_data.get_img();
    console.log($scope.photo);
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
    $scope.Addd = function () {
        $scope.addPhoto();
        var Item = {'src': $scope.croppedDataUrl, 'tag': $scope.tag};
        $mdDialog.hide(Item);
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
                .success(function(res) {
                    $scope.file_name = res;
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
}
