/************************************
* app name:         yssywall饮水思源涂鸦墙
* author:           i@scaret.in
* last edit:        2013-03-23
* version:          2.0
************************************/
function filterTag(text){
	  if (text) {
		return text.
		replace(/<[\w\W]+?>/g,'');
	  }
	  return '';
}

function postsController($scope,$http,$timeout){
	$scope.postsShown=[];
	$scope.postsShowing = [];
	$scope.postsToShow = [];
	$scope.untractedPosts = [];
	$scope.currentPage = 500;
	$scope.lastFileId = 0;
	
	(function getUntractedPost() {
        $http.get(api.board("juhui",$scope.currentPage)).success(function (data) {
			for(var i = 0 ; i < data.articles.length ; i++){
				if(data["articles"][i]["mark"] != "   " && parseInt(data["articles"][i]["file_id"]) > $scope.lastFileId){
					$scope.untractedPosts.push({
						board:data["board"],
						file:data["articles"][i]["file"]
					});
					$scope.lastFileId =  parseInt(data["articles"][i]["file_id"]);
				}
			} 	
			$timeout(getUntractedPost, 5000);
        });
		$scope.currentPage +=1;
    })();
	
	(function getPostsToShow(){
		if($scope.untractedPosts.length > 0){
			var thePost = $scope.untractedPosts.shift();
			$http.get(api.article(thePost["board"],thePost["file"])).success(function (data) {
				console.log(data);
				var content = data["content_lines"][4]?data["content_lines"][4]:data["content_lines"][5];
				content = filterTag(content);
				if(!content) return;
				$scope.postsToShow.push({
					author:data["content"]["author"],
					title:data["content"]["title"],
					content:content
				});
			});
		}
		$timeout(getPostsToShow, 1000);	
    })();
	
	(function updatePostsShowing() {
		if($scope.postsToShow.length > 0){
			$scope.postsShowing.push($scope.postsToShow.shift());
		}
		while($scope.postsShowing.length > 3) $scope.postsShown.push($scope.postsShowing.shift());
		$timeout(updatePostsShowing, 2000);
    })();
}