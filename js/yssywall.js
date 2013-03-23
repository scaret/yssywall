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
var tipsToShow=[];
var tipsShown=[];
function init(){
	if(config.clearInterval_obj) clearInterval(config.clearInterval_obj);
	config.page=config.init_page;
	config.clearInterval_obj = setInterval(loadBoard,config.load_interval);
	loadBoard();
}
function loadBoard(){
	$("head").append('<script src="'+api.board(config.board,config.page,config.boardHandler,config.include)+'"></script>');
	
	if(typeof(config.page == "number")){
		for(var i = 1; i <= config.pageNumber; i++)
			$("head").append('<script src="'+api.board(config.board,config.page_return-i,config.boardHandler+"Former",config.include)+'"></script>');
	
	}
	
	if(typeof config.page == "number") config.page += 1;
}
function boardHandlerFormer(data){
	//renewPageNum(data);
	var newTipsFound = _.filter(data[0].articles,filterTips);
	tipsToShow=tipsToShow.concat(newTipsFound);	
	tipsShown = tipsShown.concat( _.map(newTipsFound,function(article){return article.file_id;}));
}
function boardHandler(data){
	renewPageNum(data);
	var newTipsFound = _.filter(data[0].articles,filterTips);
	tipsToShow=tipsToShow.concat(newTipsFound);	
	tipsShown = tipsShown.concat( _.map(newTipsFound,function(article){return article.file_id;}));
}
function renewPageNum(data){
	config.page_return = config.page = data[0].page + 1;
	$("#page").val(config.page_return);
	return config.page_return;
}
function filterTips(data){
	//console.log(data.file_id);
	for(var i = 0; i < tipsShown.length; i++ ){if(data.file_id == tipsShown[i]) return false;}
	//if(data.title.substr(0,4) == "Re: ") return true;
	if( data.mark[0] == " ") return false;
	return true;
}
function showOneTip(){
	if(tipsToShow.length == 0)	return false;
	
	var data=tipsToShow.shift();
	var article = api.article(config.board,data.file,config.articleHandler,config.pretty);
	console.log(article);
	$("head").append('<script src="'+article+'"></script>');
	deleteOver();
	return data;
}
function articleHandler(data){
	renderTip(data);
	deleteOver();
}

function renderTip(data){
	if(data[0].file_id == data[0].reid) renderTopicSingle(data);
	else {renderTopicSingle(data);renderReplySingle(data)};
}  
function renderTopicSingle(data){

	var tip_template=_.template($("#topic-template").html());	
	data[0]["alertType"]=getAdditionalClass(data[0]);
	if($("#main .topic").length >1 ) $("#main .topic:eq(0)").after(tip_template(data[0]));
	else $("#main").append(tip_template(data[0]));
	
	$("#"+data[0].file_id).hide().show("slow");
  }
function renderReplySingle(data){
	var tip_template=_.template($("#reply-template").html());	
	$("#"+data[0].reid+" .replies").prepend(tip_template(data[0]));
  
	$("#"+data[0].file_id).hide().slideDown("slow");
  }
function getAdditionalClass(data){
	for(var i = 0; i < config.superman.length; i++){
		if(data.content.author == config.superman[i] ) return "alert-success";
	}
	return  "alert-info";
}
function start(){
	init();
	wallinit();
}
function wallinit(){
	if(config.clearInterval_wall) clearInterval(config.clearInterval_wall);
	config.clearInterval_wall = setInterval(showOneTip,config.wall_interval);
	showOneTip();
}
function stop(){
	clearInterval(config.clearInterval_wall);
	clearInterval(config.clearInterval_obj);
	return false;
}
function deleteOver(){
	$(".topic").each(function(index){
	if(index >= config.tips_number){
		$(this).hide("slow",function(){$(this).remove();});
	}
	
	});
}
function clear(){
	tipsToShow = [];
	stop();
}
function showUsage(){
	renderTopicSingle([{
	file_id:12345,
	content:{
		author:"wallAdmin",
		title:"※※※水源墙使用提示※※※※※",
		nick:"我是墙墙小助手",
		text_lines:['水源墙参与方法:<br/>1.在<span class="c32">juhui板</span>发表文章,被标记的帖子即可上水源墙哦!<br/>2.帖子的<span class="c31">第一行</span>也会上墙哦!']
		}
	}]);
}

function postsController($scope,$http){
	$scope.posts=[];
	$http.get(api.board("juhui",1)).success(function(data) {
		for(var i = 0 ; i < data.articles.length ; i++)
		$scope.posts.push({
			author:data["articles"][i]["author"],
			title:data["articles"][i]["link"],
			content:data["articles"][i]["title"]
		});
	});
}


