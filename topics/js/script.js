// トピック一覧の表示件数
let currentPage = 1;
let articlesPerPage = 12;

// ベースのパスを指定する
dirPath = '../';

// 初期化処理
document.addEventListener( 'DOMContentLoaded', () => {
	getTopicsData('../data/sample-topics.json',()=>{
		refreshArticleList();
		renderPageNation();
	});
} );