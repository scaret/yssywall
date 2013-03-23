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
	$scope.postsShown=[];
	$scope.postsShowing = [];
	$scope.postsToShow = [];
	$scope.currentPage = 500;
	(function getPostsToShow() {
        $http.get(api.board("juhui",$scope.currentPage)).success(function (data) {
			for(var i = 0 ; i < data.articles.length ; i++){
				if(data["articles"][i]["mark"] != "   "){
					$scope.postsToShow.push({
						author:data["articles"][i]["author"],
						title:data["articles"][i]["link"],
						content:data["articles"][i]["title"],
						mark:data["articles"][i]["mark"] != "   ",
						page:data["page"]
					});
				}
			} 	
			$timeout(getPostsToShow, 5000);
        });
		page +=1;
    })();
	(function updatePostsShowing() {
		if($scope.postsToShow.length > 0){
			$scope.postsShowing.push($scope.postsToShow.shift());
		}
		while($scope.postsShowing.length > 5) $scope.postsShown.push($scope.postsShowing.shift());
		$timeout(updatePostsShowing, 1000);
    })();
}