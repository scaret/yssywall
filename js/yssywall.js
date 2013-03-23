/************************************
* app name:         yssywall饮水思源涂鸦墙
* author:           i@scaret.in
* last edit:        2013-03-23
* version:          2.0
************************************/

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
		$scope.currentPage +=1;
    })();
	(function updatePostsShowing() {
		if($scope.postsToShow.length > 0){
			$scope.postsShowing.push($scope.postsToShow.shift());
		}
		while($scope.postsShowing.length > 5) $scope.postsShown.push($scope.postsShowing.shift());
		$timeout(updatePostsShowing, 1000);
    })();
}