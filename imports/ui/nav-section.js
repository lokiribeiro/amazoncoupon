//Animate NavBar Srcolling
$('.navbar a[href^="#"]').click( function(){
    var scroll_el = $(this).attr('href');
	if ($(scroll_el).length != 0) {
			$('html, body').delay(250).animate({ scrollTop: $(scroll_el).offset().top }, 1000);
		}
	return false;
});
