// トピック一覧の表示件数
let currentPage = 1;
let articlesPerPage = 6;

// 初期化処理
document.addEventListener( 'DOMContentLoaded', () => {
	getTopicsData('data/sample-topics.json',()=>{
		refreshRecomenArticleList();
		refreshArticleList();
		renderPageNation();
	});
} );