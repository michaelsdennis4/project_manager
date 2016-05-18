require('normalize-css');

var $ = require('jquery');

document.addEventListener("DOMContentLoaded", function(event) {

	var message;

	if (document.body.getAttribute('id') == 'body-signup') {

		message = document.getElementById('signup-message');
		message.textContent = "";

		document.querySelector('#signup-submit').addEventListener('click', 
			function(event) {
			event.preventDefault();
			var $form = $(event.target.parentNode);
    	var data = $form.serializeArray();
			$.ajax({
				url: '/users',
				method: 'post',
				data: data,
				dataType: 'json'
			}).done(function(result) {
				if (result.message === 'ok') {
					location.href = '/dashboard';
				} else {	
					message.textContent = result.message;
				}
			});
		});

	}

	if (document.body.getAttribute('id') == 'body-login') {

		message = document.getElementById('login-message');
		message.textContent = "";

		document.querySelector('#login-submit').addEventListener('click', 
			function(event) {
			event.preventDefault();
			console.log('login clicked');
			var $form = $(event.target.parentNode);
    	var data = $form.serializeArray();
			$.ajax({
				url: '/login',
				method: 'post',
				data: data,
				dataType: 'json'
			}).done(function(result) {
				if (result.message === 'ok') {
					location.href = '/dashboard';
				} else {	
					message.textContent = result.message;
				}
			});
		});

	}


});

