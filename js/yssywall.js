/************************************
* app name:         yssywall饮水思源涂鸦墙
* author:           i@scaret.in
* last edit:        2013-3-17
* version:          2.0
************************************/
var config={
	board:"juhui",
	load_interval:5000,
	tips_number:4,
	superman:["Juhui"],
	wall_interval:1000,
	clearInterval_obj:null,
	clearInterval_wall:null,
	init_page:500,
	page:500,
	include:0,
	pretty:1,
	pageNumber:5,
	boardHandler:"boardHandler",
	articleHandler:"articleHandler",
	page_return:500
	
}



function loadBoard(board,page){
	var url = api.board(board,page);
	$hackscope.posts = [];
		
	$hackhttp.get(url).success(function(data) {
		for(var i = 0 ; i < data.articles.length ; i++){
			$scope.posts.push({
				author:data["articles"][i]["author"],
				title:data["articles"][i]["link"],
				content:data["articles"][i]["title"]
			});
		}
	});
}


function postsController($scope,$http,$timeout){
	$scope.posts=[];
	var page = 500;
	(function tick() {
        $http.get(api.board("juhui",page)).success(function (data) {
		$scope.posts = [];
		for(var i = 0 ; i < data.articles.length ; i++){
			$scope.posts.push({
				author:data["articles"][i]["author"],
				title:data["articles"][i]["link"],
				content:data["articles"][i]["title"]
			});
		} 	
        $timeout(tick, 5000);
        });
	page +=1;
    })();
	
}


