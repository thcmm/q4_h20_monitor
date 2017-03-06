(function() {
  'use strict'

  angular.module('app')
    .config(config)

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider']

  function config($stateProvider, $urlRouterProvider, $locationProvider){
    $locationProvider.html5Mode(true)

    $stateProvider
      .state({
        name: 'app',
        abstract: true,
        component: 'app',
      })
      .state({
        name: 'home',
        parent: 'app',
        url: '/',
        component: 'dashboard', // probereadingsList
      })
      .state({
       name: 'probereadingsView', // dashboardView'
       parent: 'app',
       url: '/',
       component: 'probereadingsList',
     })
  }
}());
