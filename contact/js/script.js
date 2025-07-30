document.getElementById('contact').addEventListener('submit',(e)=>{
	e.preventDefault()
	document.getElementById('contact').style.display = 'none';
	document.getElementById('sending').style.display = 'block';
	setTimeout(() => {
		document.getElementById('sending').style.display = 'none';
		document.getElementById('sended').style.display = 'block';
	},2000);
});