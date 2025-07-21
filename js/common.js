// JAPAN形式にフォーマット
function toJapaneseDate ( date ) {
	if ( !( date instanceof Date ) ) {
		throw new Error( 'date型じゃない日付データです' );
	}

	const year = date.getFullYear();
	const month = date.getMonth() + 1; // 0から始まるので +1
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();

	return `${ year }年${ month }月${ day }日（${ hour }時${ minute }分）`;
}

// ISO 8601 + 9:00形式にフォーマット
function toJstIso8601String ( date ) {
	if ( !( date instanceof Date ) ) {
		throw new Error( 'date型じゃない日付データです' );
	}
	const pad = ( n ) => String( n ).padStart( 2, '0' );

	const year = date.getFullYear();
	const month = pad( date.getMonth() + 1 );
	const day = pad( date.getDate() );
	const hours = pad( date.getHours() );
	const minutes = pad( date.getMinutes() );
	const seconds = pad( date.getSeconds() );

	const offset = '+09:00';

	return `${ year }-${ month }-${ day }T${ hours }:${ minutes }:${ seconds }${ offset }`;
}

// ナビゲーションメニューのイベント
document.addEventListener( 'DOMContentLoaded', function () {
	const toggleButton = document.querySelector( '.menu-toggle' );
	const navMenu = document.querySelector( '.nav-menu' );
	toggleButton.addEventListener( 'click', () => {
		navMenu.classList.toggle( 'active' );
		toggleButton.querySelectorAll( 'i' ).forEach( ( iEl ) => {
			iEl.classList.toggle( 'active' );
		} );
	} );
} );