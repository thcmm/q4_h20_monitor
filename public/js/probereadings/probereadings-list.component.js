(function() {
  'use strict'

  angular.module('app')
    .component('probereadingsList', {
      require: {
        layout: '^app'
      },
      templateUrl: '/js/probereadings/probereadings-list.template.html',
      controller: controller
    })

  controller.$inject = ['$http']
  function controller($http) {
    const vm = this
	let sortdataItemsBy = 'id';
	let sortingBy = 'Id'; // Sort


    vm.$onInit = onInit
    vm.sortDataItems = sortDataItems;

    function onInit() {
      console.log("c:probereadingsList")
      $http.get('/probedata') // /messages
        //.then(response => vm.messages = response.data)
        .then(response => vm.probeDataListing = response.data)
    }

      // TODO Lägg till typ av data givare värden
	  function sortDataItems(by) {
		  //console.log('f:sortDataItems = ', by);
		  switch (by) {
			  case "id":
				  console.log('f:sortDataItems: id');
				  vm.sortdataItemsBy = 'id';
				  vm.sortingBy = "Id"
				  break;
			  case "date":
				  console.log('f:sortDataItems: date');
				  vm.sortdataItemsBy = 'date';
				  vm.sortingBy = "Date"
				  break;
		  }
	  }
  }
}());
