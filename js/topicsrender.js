// データソースを保持する配列
let topics = [];

// ベースのパスを指定する
let dirPath = '';

// 実行時のディレクトリ
const url = new URL( window.location.href );
url.pathname = url.pathname.replace( /[^/]*$/, '' ); // 最後のファイル名を除去
url.search = ''; 
url.hash = '';
const dirUrl = url.toString();

// スクロール検知
let lastScrollY = window.scrollY;
let isScrollUp = true;
window.addEventListener( 'scroll', () => {
	const currentY = window.scrollY;
	isScrollUp = currentY > lastScrollY ? false : true;
	lastScrollY = currentY;
} );
// ドロップイントリガー
const dropInObserver = new IntersectionObserver( ( entries ) => {
	entries.forEach( entry => {
		entry.target.classList.remove( 'from-top', 'from-bottom' );
		entry.target.classList.add( isScrollUp ? 'from-bottom' : 'from-top' );
		if ( entry.isIntersecting ) {
			entry.target.classList.add( 'visible' );
		} else {
			entry.target.classList.remove( 'visible' );
		}
	} );
}, {
	threshold: 0
} );

// 記事一覧を描画する
function renderArticles ( articles, parent, isRecommen = false ) {
	parent.querySelector( '.dot-loader' ).style.display = 'flex';
	articles.forEach( ( article ) => {
		const addArticle = document.createElement( 'article' );

		const img = document.createElement( 'img' );
		img.src = `${dirPath}data/img/${article.thumbnail}`;
		img.alt = `「${ article.title }」のイメージに合うサムネイル画像`;
		img.loading = 'lazy';

		const imgDiv = document.createElement( 'div' );
		imgDiv.classList.add( 'thumb' );
		imgDiv.appendChild( img );

		const title = document.createElement( 'h3' );
		title.classList.add( 'article-title' );
		title.textContent = article.title;

		const time = document.createElement( 'time' );
		time.textContent = toJapaneseDate( new Date( article.date ) );
		time.dateTime = toJstIso8601String( new Date( article.date ) );

		const description = document.createElement( 'p' );
		description.textContent = article.description;

		const aLink = document.createElement( 'a' );
		aLink.title = `「${ article.title }」の記事詳細を開く`;
		aLink.href = `${dirPath}topic/?aid=${ article.id }`;

		if ( isRecommen ) {
			// おすすめでは画像とタイトルだけ、overlayを追加
			const overlay = document.createElement( 'div' );
			overlay.classList.add( 'overlay' );
			const overlayText = document.createElement( 'span' );
			overlayText.classList.add( 'read-text' );
			overlayText.textContent = 'トピックを読む';
			overlay.appendChild( overlayText );
			imgDiv.append( overlay, title );
			aLink.appendChild( imgDiv );
		} else {
			// おすすめ以外では全項目を表示する
			aLink.append( imgDiv, title, time, description );
		}

		addArticle.appendChild( aLink );
		parent.appendChild( addArticle );
		dropInObserver.observe( addArticle );
	} );
	parent.querySelector( '.dot-loader' ).style.display = 'none';
}

// おすすめトピック
function refreshRecomenArticleList () {
	// シャッフル配列
	const shuffled = topics.slice().sort( () => Math.random() - 0.5 );
	const target = document.getElementById( 'recommendations' );
	renderArticles( shuffled.slice( 0, 2 ), target, true );
}

// トピック一覧
function refreshArticleList () {
	const target = document.querySelector( '#articleList' );
	target.previousElementSibling.scrollIntoView( {
		block: 'start'
	} );
	
	const start = ( currentPage - 1 ) * articlesPerPage;
	const end = currentPage * articlesPerPage;
	const renderTopics = topics.slice( start, end );
	target.querySelectorAll( 'article' ).forEach( el => el.remove() );
	renderArticles( renderTopics, target );
	refreshPageNation();
}

// ページネーション
function renderPageNation () {
	const paginationContainer = document.getElementById( 'pagination' );
	for ( let i = 0; i < Math.ceil( topics.length / articlesPerPage ); i++ ) {
		const pageLink = document.createElement( 'a' );
		pageLink.href = '#';
		pageLink.title = `${ i + 1 }ページを表示`;
		pageLink.textContent = i + 1;
		pageLink.addEventListener( 'click', ( e ) => {
			e.preventDefault();
			if ( currentPage === ( i + 1 ) ) {
				return;
			}
			currentPage = i + 1;
			refreshArticleList();
		} );

		paginationContainer.appendChild( pageLink );
		refreshPageNation();
	}
}
function refreshPageNation () {
	history.pushState( null, '', `?page=${ currentPage }` );
	document.querySelectorAll( '#pagination>a' ).forEach( ( page, index ) => {
		page.classList.remove( 'current' );
		if ( currentPage === ( index + 1 ) ) {
			page.classList.add( 'current' );
		}
	} );
}

// 記事データをロードする
function getTopicsData ( url, callback ) {
	fetch( url )
		.then( ( res ) => {
			if ( !res.ok ) {
				throw new Error( `通信エラー：${ res.status }` );
			}
			return res.json()
		} )
		.then( ( data ) => {
			// indexでidをつける
			topics = data.map( ( topic, index ) => ( {
				...topic,
				id: index,
				date: new Date( topic.date )
			} ) );
			// 日付順で降順ソートする
			topics.sort( ( a, b ) => b.date - a.date );
			const params = new URLSearchParams( location.search );
			if ( params.has( 'page' ) ) {
				const page = parseInt( params.get( 'page' ), 10 );
				if ( !isNaN( page ) && page > 0 ) {
					currentPage = page;
				}
			}
			callback();
		} )
		.catch( ( err ) => {
			throw new Error( `エラー：${ err.message }` );
		} )
		.finally( () => {
			console.log( 'JSON is loaded' );
		} );
}