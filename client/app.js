//todo: poner todos los componentes en el directorio /client/imports => lazy load
//todo: implementar las funciones de rootScope como una factoria

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import 'angular-simple-logger';
import ngMaterial from 'angular-material';
import ngAnimate from 'angular-animate';
import '../imports/ui/anim-in-out.js';
import 'angularjs-social-login';
import mdDataTable from 'angular-material-data-table';
import ngFileUpload from 'ng-file-upload';

export var app = angular.module('couponClicks',
    [angularMeteor, ngMaterial, uiRouter, 'accounts.ui', ngAnimate, 'anim-in-out', 'socialLogin', mdDataTable, ngFileUpload]).value('THROTTLE_MILLISECONDS', 250);

app.config(function ($locationProvider, $urlRouterProvider, $stateProvider, $mdThemingProvider, $mdIconProvider, $provide, socialProvider) {
    'ngInject';

    $locationProvider.html5Mode(true);
    socialProvider.setFbKey({appId: '1822142978105305', apiVersion: 'v2.9'});

    $stateProvider
    .state(
        'login', {
            url:'/login',
            template: '<login></login>',
            resolve: {
                currentUser($q, $state) {
                    if (!Meteor.userId()) {
                      return $q.resolve();
                    } else {
                      return $q.reject('LOGGED_IN');
                    };
                }
              }
    })
    .state(
        'home', {
            url:'/',
            template: '<home></home>',
            resolve: {
                currentUser($q, $state) {
                    if (!Meteor.userId()) {
                      return $q.resolve();
                    } else {
                      return $q.reject('LOGGED_IN');
                    };
                }
              }
    })    
    .state(
        'signin', {
            url:'/signin',
            template: '<login></login>',
            resolve: {
                currentUser($q, $state) {
                    if (Meteor.userId()) {
                        return $q.reject('LOGGED_IN');
                    } else {
                        return $q.resolve();
                    }
                }
              }
    })
    .state(
        'verify-email', {
            url:'/verify-email/:token',
            template: '<verify></verify>',
            controller: function() {
              Accounts.verifyEmail( params.token, ( error ) =>{
                if ( error ) {
                  console.log('error');
                } else {
                  $state.go('Dashboard');
                }
              })
              }
    })
    .state(
        'register', {
            url:'/register',
            template: '<register></register>'
    })
    .state(
        'not-found', {
            url: '/not-found',
            template: '<notfound></notfound>'
    })
    .state('logout', {
		        url: '/logout',
            template: '<login></login>',
            resolve: {
                currentUser($q, $state) {
                    if (!Meteor.userId()) {
                      return $q.reject('LOGGED_IN');
                    } else {
                      return $q.resolve();
                    };
                }
              }
	 })
    .state('Dashboard', {
          url:'/:stateHolder/DSHb/:userID',
          template: '<dashboard></dashboard>',
          resolve: {
              currentUser($q, $state) {
                  if (!Meteor.userId()) {
                      return $q.reject('AUTH_REQUIRED');
                  } else {
                    return $q.resolve();
                  };
              }
          },
          onEnter: function($rootScope, $stateParams, $state) {
              $rootScope.stateHolder = $stateParams.stateHolder;
          }
      })
      .state('Projectpage', {
            url:'/:stateHolder/PRJP/:userID/:listID',
            template: '<projectpage></projectpage>',
            resolve: {
                currentUser($q, $state) {
                    if (!Meteor.userId()) {
                        return $q.reject('AUTH_REQUIRED');
                    } else {
                      return $q.resolve();
                    };
                }
            },
            onEnter: function($rootScope, $stateParams, $state) {
                $rootScope.stateHolder = $stateParams.stateHolder;
                $rootScope.listID = $stateParams.listID;
            }
        })
        .state('Task', {
              url:'/:stateHolder/TSKP/:userID/:projectID/:taskID',
              template: '<taskprofile></taskprofile>',
              resolve: {
                  currentUser($q, $state) {
                      if (!Meteor.userId()) {
                          return $q.reject('AUTH_REQUIRED');
                      } else {
                        return $q.resolve();
                      };
                  }
              },
              onEnter: function($rootScope, $stateParams, $state) {
                  $rootScope.stateHolder = $stateParams.stateHolder;
                  $rootScope.taskID = $stateParams.taskID;
                  $rootScope.projectID = $stateParams.projectID;
              }
          })
          .state('Profile', {
            url:'/:stateHolder/PRFl/:userID',
            template: '<profile></profile>',
            resolve: {
                currentUser($q, $state) {
                    if (!Meteor.userId()) {
                        return $q.reject('AUTH_REQUIRED');
                    } else {
                        return $q.resolve();
                    };
                }
            },
            onEnter: function($rootScope, $stateParams, $state) {
                $rootScope.stateHolder = $stateParams.stateHolder;
            }
        });

    $urlRouterProvider.otherwise('/not-found');

    $mdThemingProvider.definePalette('squalaPalette', {
      '50': 'C788CE',
    '100': 'BF75C7',
    '200': 'B663BF',
    '300': 'AE51B8',
    '400': 'A046AA',
    '500': '8F3E98',
    '600': '7E3786',
    '700': '6D2F74',
    '800': '5C2862',
    '900': '4B2150',
    'A100': 'ff8a80',
    'A200': 'ff5252',
    'A400': 'ff1744',
    'A700': 'd50000',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light

    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });

    //disable theme generation
    //$mdThemingProvider.generateThemesOnDemand(true);

    $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('blue');

    $mdThemingProvider.theme('Project')
    .primaryPalette('amber')
    .accentPalette('orange');

    $mdThemingProvider.theme('Admissions')
    .primaryPalette('amber')
    .accentPalette('orange');

    $mdThemingProvider.theme('Assessment')
    .primaryPalette('light-green')
    .accentPalette('lime');

    $mdThemingProvider.theme('Classroom')
    .primaryPalette('light-blue')
    .accentPalette('indigo');

    $mdThemingProvider.theme('Collect')
    .primaryPalette('red')
    .accentPalette('pink');

    $mdThemingProvider.theme('Rapido')
    .primaryPalette('orange')
    .accentPalette('amber');

    $mdThemingProvider.theme('Scheduler')
    .primaryPalette('yellow')
    .accentPalette('orange');

    $mdThemingProvider.theme('Dashboard')
    .primaryPalette('indigo')
    .accentPalette('blue');

    $mdThemingProvider.alwaysWatchTheme(true);

    $provide.value('themeProvider', $mdThemingProvider);
  });

app.run(function ($state, $rootScope, $stateParams, $mdTheming) {
    'ngInject';
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
      switch(error) {
        case "AUTH_REQUIRED":
         console.log('login');
          $state.go('login');
        break;
        case "FORBIDDEN":
          $state.go('forbidden');
        break;
        case "UNAUTHORIZED":
          $state.go('unauthorized');
        break;
        case "LOGGED_IN":
        console.log('dashboard');
          $state.go('Dashboard');
        break;
        default:
          $state.go('not-found');
      }
  });
    // handle logout event and redirect user to home page
    var _logout = Meteor.logout;
    Meteor.logout = function customLogout() {
        console.log('user loggin out');
        $state.go('login');
        _logout.apply(Meteor, arguments);
    };

    $rootScope.helpers({
        // todo: revisar este helper ya que el usuario se puede obtener
        // todo: en teoria de forma global usando Meteor.user()
        userLoggedIn(){
            return Meteor.user();
        },
        userID(){
            return Meteor.userId();
        },
        userLoggedInRole(){
          var role = null;
          if(Meteor.user()){
            var details = Meteor.user();
            role = details.role;
            console.info('role', role);
          }
          return role;
        },
        userLoggedInBranch(){
          var branch = null;
          if(Meteor.user()) {
            var details = Meteor.user();
            branch = details.branchId;
            console.info('branch', branch);
          }
          return branch;
        },
        userLoggedInProject(){
          var projectId = null;
          if(Meteor.user()){
            var details = Meteor.user();
            projectId = details.user_projectID;
            console.info('projectId', projectId);
          }
          return projectId;
        }
    });

    userID = function () {
            return Meteor.userId();
    };

    $rootScope.state = $state;

    $rootScope.isEditable = function (party) {
        if(Meteor.user() && party) {
            return Meteor.userId() === party.ownerId;
        }else{
            return false;
        }
    };

    $rootScope.userInvited = function (party) {
        var isInvited = _.findWhere( party.invitedUsers, {userId: Meteor.userId()} ) != null ;
        return isInvited;
    };

    $rootScope.setPrivacity = function (partyId, isPublic) {
        if(isPublic){
            // Making public a party implies it has no ivited users. Everybody can assist
            Parties.update({_id: partyId}, {$set: {public: isPublic, invitedUsers: []}})
        }
        if(!isPublic){
            Parties.update({_id: partyId}, {$set: {public: isPublic}})

        }
    };


});
