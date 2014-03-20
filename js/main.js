App = {
	api: "http://api.themoviedb.org/3/movie/",
	api_key: "?api_key=bf8e34695ccdcec1c7e15ff397826594",
	base_image_url: "http://image.tmdb.org/t/p/w342"
};

var Movie = function (argument) {
	this.id = argument.id;
	this.poster_path = App.base_image_url+argument.poster_path;
};

Movie.prototype.getMovieCast = function(fallback) {
	var _this = this;
	$.ajax({
        url: App.api + this.id+"/credits"+ App.api_key ,
        dataType: "jsonp",
        async: true,
        success: function (response) {
        		_this.cast = response.cast.slice(0, 3);
        		fallback.apply(_this, []);
        },
        error: function (request,error) {
            alert('No Movie Info Founded');
        }
    });     
};

Movie.prototype.getMovieInfo = function() {
	var _this = this;
	$.ajax({
        url: App.api + this.id + App.api_key ,
        dataType: "jsonp",
        async: true,
        success: function (response) {
            _this.title = response.title;
            _this.date = new Date(response.release_date).getFullYear();
            _this.overview = response.overview;
            _this.getMovieCast(_this.showMovieInfo); 
        },
        error: function (request,error) {
            alert('No Movie Info Founded');
        }
    });     
};

Movie.prototype.showMovieInfo = function(){
	var _this = this;

	var popup = '<div class="white-popup">'+
	    		'<div class="media movie-info">'+
	    			'<div class="pull-left">'+
	    				'<img class="movie-poster" src="'+_this.poster_path+'" />'+
	    			'</div>'+
	    			'<div class="media-body">'+
	    				'<h2 class="movie-name">'+_this.title+' <span class="movie-date">('+_this.date+')</span></h2>'+
	    				'<div>'+
	    					'<label>Overview</label>'+
	    					'<p>'+_this.overview+'</p>'+
	    				'</div>'+
	    				'<div>'+
	    					'<label>Cast</label>'+
	    					'<ul class="cast-list">';

	    					$.each(_this.cast, function(index, val) {
	    						 popup+= '<li>'+
	    						 						'<div class="media">'+
	    						 							'<div class="pull-left">'+
	    						 								'<img class="cast-image"src="'+App.base_image_url+val.profile_path+'" />'+
	    						 							'</div>'+
	    						 							'<div class="media-body">'+
	    						 								'<p>'+val.name+'</p>'+
	    						 								'<p> as '+val.character+'</p>'+
	    						 							'</div>'+
	    						 						'</div>'+
	    						 					'</li>'
	    					});
	    					
	    					popup += '</ul>'+
	    				'</div>'+
	    			'</div>'+
	    		'</div>'+
	    	'</div>';

	$.magnificPopup.open({
	  items: {
	    src: popup,
	    type: 'inline'
	  }
	});
};

var Collection = function (category) {
	this.movies =[];
	this.category = category;
};

Collection.prototype.getMovies = function() {
	var	_this = this;
	$.ajax({
        url: App.api + this.category + App.api_key ,
        dataType: "jsonp",
        async: true,
        success: function (response) {
            var data = response.results;
            $.each(data, function(i, el) {
            	var movie = new Movie(el);
            	_this.movies.push(movie);
	        });
	        _this.showMovies()
        },
        error: function (request,error) {
            alert('No Movies Founded');
        }
    });     
};

Collection.prototype.showMovies = function() {
	var	_this = this;
	$.each(this.movies, function(index, el) {
		var movie = new MovieView(el);
		$(".js-"+_this.category).append(movie.html);
	});
};

var MovieView = function(movie){
	var _this = this; 
	this.movie = movie;
	this.html = $("<li class='movie' id='"+this.movie.id+"'/>");
	var img = $('<img/>').appendTo(this.html);
	img.attr('src', this.movie.poster_path);

	$(this.html).on('click', function() {
		_this.movie.getMovieInfo();
	});
};



$(function(){
	var popular = new Collection("popular");
	popular.getMovies();

	var top_rated = new Collection("top_rated");
	top_rated.getMovies();
});


