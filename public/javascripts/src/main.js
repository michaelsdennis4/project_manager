require('normalize-css');

var $ = require('jquery');

document.addEventListener("DOMContentLoaded", function(event) {

	if (document.body.getAttribute('id') == 'body-signup') {

		var signupMessage = document.getElementById('signup-message');
		signupMessage.textContent = "";

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
					signupMessage.textContent = result.message;
				}
			});
		});

	}

	if (document.body.getAttribute('id') == 'body-login') {

		var loginMessage = document.getElementById('login-message');
		loginMessage.textContent = "";

		document.querySelector('#login-submit').addEventListener('click', 
			function(event) {
			event.preventDefault();
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
					loginMessage.textContent = result.message;
				}
			});
		});

	}

	if (document.body.getAttribute('id') == 'body-profile') {

		var profileMessage = document.getElementById('profile-message');
		profileMessage.textContent = "";

		var passwordMessage = document.getElementById('password-message');
		passwordMessage.textContent = "";

		document.querySelector('#profile-submit').addEventListener('click', 
			function(event) {
			event.preventDefault();
			var $form = $(event.target.parentNode);
    		var data = $form.serializeArray();
			$.ajax({
				url: '/users',
				method: 'patch',
				data: data,
				dataType: 'json'
			}).done(function(result) {
				if (result.message === 'ok') {
					location.href = '/dashboard';
				} else if (result.message == 'login') {
					location.href = '/';
				} else {	
					profileMessage.textContent = result.message;
				}
			});
		});

		document.querySelector('#password-submit').addEventListener('click', 
			function(event) {
			event.preventDefault();
			var $form = $(event.target.parentNode);
    		var data = $form.serializeArray();
			$.ajax({
				url: '/password',
				method: 'patch',
				data: data,
				dataType: 'json'
			}).done(function(result) {
				if (result.message === 'ok') {
					location.href = '/dashboard';
				} else if (result.message == 'login') {
					location.href = '/';
				} else {	
					passwordMessage.textContent = result.message;
				}
			});
		});

	}


});

