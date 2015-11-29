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
    .controller('HomeController', function ($scope, $http) {
        /*
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
        */




    })
    .controller('MainCtrl', function ($scope, $mdDialog, $mdMedia, $timeout, $mdSidenav, $log, img_data, $http) {
        $scope.toggleLeft = buildToggler('left');
        $scope.find='';
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

        $scope.notLoggin = true;
        $http.get('/profile')
            .success(function (user) {
                console.log(user);
                $scope.user = user;
                $scope.notLoggin = false;
            });

        $http.get('/api/posts')
            .success(function (posts) {
                $scope.posts = posts;

            });

        $scope.gofind = function () {
            var findString = $scope.find;
            console.log(findString);
            var tags = findString.split("#");
            console.log(tags);
            $scope.posts = [];

            for(var i in tags){
                if(i!=0){
                    var tag = tags[i];
                    $http({
                        url: '/api/find/tag',
                        method: "GET",
                        params: {find: tag}
                    }).success(function (data) {
                        $scope.posts = $scope.posts.concat(data);
                    });
                }
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
    .controller('NewPostCtrl', function ($scope, $timeout, $mdDialog, $log, img_data, $mdMedia, $http, $window) {

        $http.get('/profile')
            .success(function (user) {
                console.log(user);
                $scope.user = user;
                $scope.notLoggin = false;
            });



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

        $scope.upload = function () {
            var update = {'title': $scope.title, 'context': $scope.context,
                            'user': 'test'};
            $http.post('/api/new/post', update)
                .success(function(res) {
                    $window.location.href = '/';
                });
        }
    })
    .controller('postDetailCtrl', function () {

    })
    .controller('findCtrl', ['$scope','$http','$routeParams', function ($http, $scope, $routeParams) {
        var findString = $routeParams.findString;
        var tags = findString.split("#").forEach(function (element, index, array) {
           tags[index] = tags[index].replace(" ","");
        });
        $http.get('/api/find/' + findString)
            .success(function (data) {
               $scope.data = data;
            });
    }]);


KobeMono.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/views/home.html'
        })
        .when('/new_post',{
            templateUrl: '/views/newPost.html',
            controller:'NewPostCtrl'
        })
        .when('/posts/:postId',{
            templateUrl: '/views/post-detail.html',
            controller:'postDetailCtrl'
        })
        .when('/login',{
            templateUrl: '/views/login.html',
            controller:'loginCtrl'
        })
        .when('/signup',{
            templateUrl: '/views/signup.html'
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
