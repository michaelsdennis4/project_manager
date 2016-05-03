require('normalize-css');

var $ = require('jquery');

document.addEventListener("DOMContentLoaded", function(event) {

	if (document.body.getAttribute('id') == 'body-signup') {

		document.querySelector('#signup-submit').addEventListener('click', 
			function(event) {
				event.preventDefault();
				console.log('sign up was clicked');
			});

	}

});

