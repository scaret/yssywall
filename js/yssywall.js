/************************************
* app name:         yssywall饮水思源涂鸦墙
* author:           i@scaret.in
* last edit:        2013-03-23
* version:          2.0
************************************/

var AUTO_SCROLL_FLAG = true;
var AUTO_SCROLL_FLAG_LOCK = 0;
var AUTO_SCROLL_FREQUENCY = 2000;
var POST_SHOWING_CNT = 3;
var AJAX_FLAG = true;

function filterHTML(text){
	  if (text) {
		return text.
		replace(/<[\w\W]+?>/g,'').
		replace(/&[a-zA-Z]+?;/g,'');
	  }
	  return '';
}
function toggleAutoScroll(){
	clearInterval(AUTO_SCROLL_FLAG_LOCK);
	AUTO_SCROLL_FLAG = !AUTO_SCROLL_FLAG;
}


function postsController($scope,$http,$timeout){
	$scope.postsShown=[];
	$scope.postsShowing = [];
	$scope.postsToShow = [];
	$scope.untractedPosts = [];
	$scope.currentPage = 500;
	$scope.lastFileId = 0;
	$scope.auto = "自动中";
	$scope.board = "Juhui";
	$scope.settingClass = "hidden";
	$scope.ajaxFlag = "已打开";
	
	$scope.toAuto = function(){
		$scope.auto = "自动中";
		AUTO_SCROLL_FLAG = true;
		clearInterval(AUTO_SCROLL_FLAG_LOCK);		
	}
	$scope.toManual = function(){
		$scope.auto = "手动中";
		AUTO_SCROLL_FLAG = false;
		clearInterval(AUTO_SCROLL_FLAG_LOCK);		
	}
	$scope.toggleAjax_Flag = function(){
		$scope.ajaxFlag = (AJAX_FLAG = !AJAX_FLAG)?"已打开":"已关闭";
		return AJAX_FLAG;
	}
	
	$scope.opencloseSettings = function(){
		$scope.settingClass =$scope.settingClass == "hidden" ? "shown" :"hidden";
	}
	$scope.toggleAuto = function(){
		(AUTO_SCROLL_FLAG?$scope.toManual:$scope.toAuto).call($scope);
	};
	$scope.prev = function(){
			if($scope.postsShown != 0){
				$scope.postsShowing.unshift($scope.postsShown.pop());
				while($scope.postsShowing.length > POST_SHOWING_CNT )
					 $scope.postsToShow.unshift($scope.postsShowing.pop());
				if(AUTO_SCROLL_FLAG == true){
					AUTO_SCROLL_FLAG = false;
					clearInterval(AUTO_SCROLL_FLAG_LOCK);
					AUTO_SCROLL_FLAG_LOCK = setTimeout(function(){AUTO_SCROLL_FLAG = true},5000);
				}
			} 
	};// end of prev

	$scope.next = function(){
			if($scope.postsToShow != 0){
				$scope.postsShowing.push($scope.postsToShow.shift());
				while($scope.postsShowing.length > POST_SHOWING_CNT )
					 $scope.postsShown.push($scope.postsShowing.shift());
				if(AUTO_SCROLL_FLAG == true){
					AUTO_SCROLL_FLAG = false;
					clearInterval(AUTO_SCROLL_FLAG_LOCK);
					AUTO_SCROLL_FLAG_LOCK = setTimeout(function(){AUTO_SCROLL_FLAG = true},5000);
				}
			} 
	};// end of next
	
	(function getUntractedPost() {
		if(!AJAX_FLAG)	{$timeout(getUntractedPost, 3000);return;}
        $http.get(api.board($scope.board,$scope.currentPage)).success(function (data) {
			for(var i = 0 ; i < data.articles.length ; i++){
				if(data["articles"][i]["mark"] != "   " && parseInt(data["articles"][i]["file_id"]) > $scope.lastFileId){
					$scope.untractedPosts.push({
						board:data["board"],
						file:data["articles"][i]["file"]
					});
					$scope.lastFileId =  parseInt(data["articles"][i]["file_id"]);
				}
			} 	
			$timeout(getUntractedPost, 3000);
        });
		$scope.currentPage = parseInt($scope.currentPage) + 1;
    })();
	
	(function getPostsToShow(){
		if(!AJAX_FLAG)	{$timeout(getPostsToShow, 100);return;}
		if($scope.untractedPosts.length > 0){
			var thePost = $scope.untractedPosts.shift();
			$http.get(api.article(thePost["board"],thePost["file"])).success(function (data) {
				var title = data["content"]["title"];
				title = filterHTML(title);
				var content = data["content_lines"][4]?data["content_lines"][4]:data["content_lines"][5];
				content = filterHTML(content);
				if(!content) return;
				$scope.postsToShow.push({
					author:data["content"]["author"],
					title:title,
					content:content
				});
			});
		}
		$timeout(getPostsToShow, 100);	
    })();
	
	(function updatePostsShowing() {
		if($scope.postsToShow.length > 0 && AUTO_SCROLL_FLAG){
			$scope.postsShowing.push($scope.postsToShow.shift());
		}
		while($scope.postsShowing.length > POST_SHOWING_CNT) $scope.postsShown.push($scope.postsShowing.shift());
		$timeout(updatePostsShowing, AUTO_SCROLL_FREQUENCY);
    })();
}

function keydownHandler(e){
	switch(e.keyCode){
		case 37: //left
			document.getElementById("prev").click();
			break;
		case 39: //right;
			document.getElementById("next").click();
			break;
		case 77: //m
			document.getElementById("mode").click();
			break;
	}
}