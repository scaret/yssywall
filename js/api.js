/************************************
* name:				ÒûË®Ë¼Ô´api
* Designed by: 		scaret@bbs.sjtu.edu.cn
* last edit:		2012-4-18
* version:			0.1
************************************/
var api={
	article:function(board,file,callback,pretty){
	
		board=board?board:this.default.board;
		file=file?file:this.default.file;
		callback=callback?callback:this.default.callback;
		pretty=pretty?pretty:this.default.pretty;
		
		return this.default.entrance+"article?board="+board+"&file="+
			file+"&pretty="+pretty+"&callback="+callback;
		},
	board:function(board,page,callback,include,pretty){
		board=board?board:this.default.board;
		page=page?page:this.default.page;
		callback=callback?callback:this.default.callback;
		pretty=pretty?pretty:this.default.pretty;
		include=include?include:this.default.include;
		
		return this.default.entrance+"board?board="+board+"&page="+
			page+"&pretty="+pretty+"&callback="+callback+"&include="+include;
	},
	

	default:{
		entrance:"https://bbs.sjtu.edu.cn/api/",
		board:"sysop",
		file:"M.1319219786.A",
		id:"1319219786",
		page:"lastpage",
		callback:"console.log",
		pretty:1,
		include:0
	}
}