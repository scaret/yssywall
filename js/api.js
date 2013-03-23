/************************************
* name:				ÒûË®Ë¼Ô´api
* Designed by: 		scaret@bbs.sjtu.edu.cn
* last edit:		2013-3-23
* version:			0.2
************************************/
var api={
	article:function(board,file,pretty){
	
		board=board?board:this.default.board;
		file=file?file:this.default.file;
		pretty=pretty?pretty:this.default.pretty;
		
		return this.default.entrance+"article?board="+board+"&file="+
			file+"&pretty="+pretty;
		},
	board:function(board,page,include,pretty){
		board=board?board:this.default.board;
		page=page?page:this.default.page;
		pretty=pretty?pretty:this.default.pretty;
		include=include?include:this.default.include;
		
		return this.default.entrance+"board?board="+board+"&page="+
			page+"&pretty="+pretty+"&include="+include;
	},
	

	default:{
		entrance:"https://bbs.sjtu.edu.cn/api/",
		board:"sysop",
		file:"M.1319219786.A",
		id:"1319219786",
		page:"lastpage",
		pretty:1,
		include:0
	}
}