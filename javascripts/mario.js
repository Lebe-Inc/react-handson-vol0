(function($){

	var isAnimating = false,
			click_count = 0,
			MAX_CLICK_COUNT = 10;

	// blockをclickされた時
	function click_block(){

		if(isAnimating){
			return;
		}

		if(click_count < MAX_CLICK_COUNT){

			$(".coin").addClass("animating")
			isAnimating = !isAnimating;
			click_count += 1;
			
			setTimeout(function(){
				isAnimating = !isAnimating;
				$(".coin").removeClass("animating")
			},800);

		}else{

			$(".block img").attr("src","http://www.machi-mori.com/mydesign/pict/10211.gif");
			alert("コインはもう出ません");

		}	

	}

	// block clickイベントのバインド
	$(".block").on("click",click_block)

})(jQuery)