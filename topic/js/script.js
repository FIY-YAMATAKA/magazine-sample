let topics = [];

// バックリンク
document.getElementById( 'backLink' ).addEventListener( 'click', ( e ) => {
	e.preventDefault();
	history.back();
} );

// 記事を表示
function renderArticle ( topic ) {
	const article = document.getElementById( 'topic' );
	article.querySelector( 'h2' ).textContent = topic.title;
	article.querySelector( 'img' ).src = `../data/img/${ topic.thumbnail }`;
	const parsedContent = new DOMParser().parseFromString( topic.content, 'text/html' );
	const content = document.createDocumentFragment();
	parsedContent.body.childNodes.forEach( node => {
		content.appendChild( node.cloneNode( true ) );
	} );
	article.querySelector( 'section' ).appendChild( content );
	article.querySelector( 'time' ).textContent = toJapaneseDate( topic.date );
	article.querySelector( 'time' ).dateTime = toJstIso8601String( topic.date );
	article.querySelector( '.author' ).textContent = topic.author;
	document.querySelector('.dot-loader').style.display = 'none';
	document.querySelector('#error404').style.display = 'none';
	article.style.opacity = 1;
}

// 記事がない時は404を表示
function render404 () {
	document.querySelector('.dot-loader').style.display = 'none';
	document.getElementById( 'topic' ).style.display = 'none';
	document.getElementById( 'error404' ).style.display = 'block';
	document.getElementById( 'error404' ).style.opacity = 1;
}

// 初期化処理
document.addEventListener( 'DOMContentLoaded', () => {
	fetch( '../data/sample-topics.json' )
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

			// 表示する記事のidを取得
			const params = new URLSearchParams( location.search );
			if ( params.has( 'aid' ) ) {
				const aid = parseInt( params.get( 'aid' ), 10 );
				if ( !isNaN( aid ) && aid>-1 && aid < topics.length) {
					renderArticle( topics[ aid ] );
				} else {
					render404();
				}
			} else {
				render404();
			}
		} )
		.catch( ( err ) => {
			render404();
			throw new Error( `エラー：${ err.message }` );
		} )
		.finally( () => {
			console.log( 'JSON is loaded' );
		} );
} );