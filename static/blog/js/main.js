function get_element_style(ele){
	return window.getComputedStyle ? window.getComputedStyle(document.getElementById(ele), null)
		: document.getElementById(ele).currentStyle;
}

window.onload = function(){
	var canvas_style = get_element_style('cls-canvas');

	canvas = document.getElementById('cls-canvas');
	context = canvas.getContext('2d');

	canvas.width = parseInt(canvas_style.width)*2;
	canvas.height = parseInt(canvas_style.height)*2;


	canvas.style.display = "block";

	console.log("123");
}
