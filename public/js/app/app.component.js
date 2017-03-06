(function() {
  'use strict'

  angular.module('app')
    .component('app', {
      templateUrl: '/js/app/app.template.html',
      controller: controller
    })

  controller.$inject = ['$http']
  function controller($http) {
    const vm = this

    vm.$onInit = onInit

    function onInit() {
      console.log('H2O alive!');
      vm.addingPost = false
    }
  }

}());
