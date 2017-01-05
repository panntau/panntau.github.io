$(document).ready(function() {

	/* ----- Vaariables and user agent check ----- */
	isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
	isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


	/* ----- Function to prevent Default Events ----- */
	function pde(e){
		if(e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;
	}


	/* ----- Safari class if is Safari ----- */
	if (isSafari) {
		$('html').addClass('is-safari');
	} else {
		$('html').removeClass('is-safari');
	}


	/* ----- Darken the revealed menu on mobile ----- */
	$('.navbar-toggle').on('click', function(){
		if (!$('.navbar-collapse').hasClass("in")) {
			$('.navbar').addClass('darken-menu');
		} else if ($('.navbar-collapse').hasClass("in")) {
			$('.navbar').removeClass('darken-menu');
		}
	});


	/* ----- Parallax effect on welcome screen ----- */
	$(document).scroll(function () {
		var position = $(document).scrollTop();

		if (!isMobile) {
			$(".welcome-section .content-wrapper").css({
				opacity : (1 - position/500)
			});
		}
	});


	/* ----- Collapse navigation on click (Bootstrap 3 is missing it) ----- */
	$('.nav a').on('click', function () {
		$('#my-nav').removeClass('in').addClass('collapse');
	});


	/* ----- Scroll down from Welcome screen ----- */
	$('.welcome-section .scroll-more').click(function(evt) {
		var place = $('body').children('section').eq(1);
		// var offsetTop = $('.navbar').outerHeight();
		$('html, body').animate({scrollTop: $(place).offset().top}, 1200, 'easeInOutCubic');
		pde(evt);
	});


	/* ----- Nice scroll to Sections ----- */
	$('.navbar-nav li a').click(function(evt){
		var place = $(this).attr('href');
		var off = $(place).offset().top;
		$('html, body').animate({
			scrollTop: off
		}, 1200, 'easeInOutCubic');
		pde(evt);
	});


	/* ----- Minimize and darken the Menu Bar ----- */
	$('body').waypoint(function(direction) {
		$('.navbar').toggleClass('minified dark-menu');
	}, { offset: '-200px' });


	/* ----- Testimonials rotator ----- */
	$( '#testimonials-rotator' ).cbpQTRotator();


	/* ----- Text Rotator ----- */
	$(".rotating-words").textrotator({
		animation: "dissolve",
		separator: ",",
		speed: 3000
	});




	/* ----- Show "Back to Top" button ----- */
	$(document).scroll(function () {
		var position = $(document).scrollTop();
		var headerHeight = $('#welcome').outerHeight();
		if (position >= headerHeight - 100){
			$('.scrolltotop').addClass('show-to-top');
		} else {
			$('.scrolltotop').removeClass('show-to-top');
		}
	});

	// Scroll on Top
	$('.scrolltotop, .navbar-brand').click(function(e) {
		$('html, body').animate({scrollTop: '0'}, 1200, 'easeInOutCubic');
		pde(e);
	});


	/* ----- Filterable Portfolio effect ----- */
	$('ul.og-grid li').append('<div class="hidden-overlay"></div>');
	$('ul.filter-list li').click(function() {
		$(this).css('outline','none');

		$('ul.filter-list .active').removeClass('active');
		$(this).addClass('active');

		var filterVal = $(this).attr('data-id');

		if(filterVal == 'all') {
			$('ul.og-grid li.hidden-item').addClass('visible-item');
			$('ul.og-grid li.hidden-item').removeClass('hidden-item').animate({opacity: 1}, 600);
		} else {

			$('ul.og-grid li').each(function() {

				var attrArr = $(this).attr('data-id').split(' ');
				var found = $.inArray(filterVal, attrArr);

				if(found == -1) {
					$(this).animate({opacity: 0.2}, 600, function(){
						$(this).removeClass('visible-item').addClass('hidden-item');
					});
				} else {
					$(this).addClass('visible-item');
					$(this).removeClass('hidden-item').animate({opacity: 1}, 600);
				}
			});
		}

		return false;
	});


	/* ----- Contact form ----- */
	$("#submit_btn").click(function(e) {
		e.preventDefault();

		$('#submit_btn').text('').append('<i class="fa fa-spinner fa-spin"></i>');

		//get input field values
		var user_name       = $('input[name=name]').val();
		var user_email      = $('input[name=email]').val();
		var user_human      = $('input[name=human]').val();
		var user_message    = $('textarea[name=message]').val();

		//simple validation at client's end
		//we simply change border color to red if empty field using .css()
		var proceed = true;
		if(user_name==""){
			$('input[name=name]').css('border-color','red');
			$('#submit_btn').remove('i').text('Submit');
			proceed = false;
		}
		if(user_email==""){
			$('input[name=email]').css('border-color','red');
			$('#submit_btn').remove('i').text('Submit');
			proceed = false;
		}
		if( user_human == "" ) {
			$('input[name=human]').css('border-color','red');
			$('#submit_btn').remove('i').text('Submit');
			proceed = false;
		}
		if(user_message=="") {
			$('textarea[name=message]').css('border-color','red');
			$('#submit_btn').remove('i').text('Submit');
			proceed = false;
		}

        //everything looks good! proceed...
        if (proceed) {

			//data to be sent to server
			post_data = {'userName':user_name, 'userEmail':user_email, 'userHuman':user_human, 'userMessage':user_message};

			//Ajax post data to server
			$.post('contact.php', post_data, function(response){

				//load json data from server and output message
				if(response.type == 'error') {
					output = '<div class="error">'+response.text+'</div>';
					$('#submit_btn').remove('i').text('Submit');
				} else {
					output = '<div class="success">'+response.text+'</div>';

					$('#submit_btn').remove('i').text('Message sent!');
					$('#submit_btn').attr("disabled", true);

					//reset values in all input fields
					$('#contact_form input').val('');
					$('#contact_form textarea').val('');
				}

				$("#result").hide().html(output).slideDown();

            }, 'json');

        }

    });

	//reset previously set border colors and hide all message on .keyup()
	$("#contact_form input, #contact_form textarea").keyup(function() {
		$("#contact_form input, #contact_form textarea").css('border-color','');
		$("#result").slideUp();
	});


	/* ----- Forms Placeholder fix for IE8 and IE9 ----- */
	$('[placeholder]').focus(function() {
		var input = $(this);
		if (input.val() == input.attr('placeholder')) {
			input.val('');
			input.removeClass('placeholder');
		}
	}).blur(function() {
		var input = $(this);
		if (input.val() == '' || input.val() == input.attr('placeholder')) {
			input.addClass('placeholder');
			input.val(input.attr('placeholder'));
		}
	}).blur().parents('form').submit(function() {
		$(this).find('[placeholder]').each(function() {
		var input = $(this);
		if (input.val() == input.attr('placeholder')) {
			input.val('');
		}
	});
	});


	/* ----- Initialize Portfolio Grid ----- */
	/*initializeGrid();*/


	/* ----- Initializa Parallax effect ----- */
	parallaxed('.parallax');


});



/* ----- Functions ----- */

function initializeGrid() {
	Grid.init();
}

function parallaxed(obj) {

	$(window).bind("load resize scroll",function() {
		$(obj).each(function(){
			var windowHeight = $(window).height();
			var windowWidth = $(window).width();
			var scrollPos = $(window).scrollTop();
			var objectPos = $(this).offset().top;
			var position = objectPos - scrollPos;

			if (!isMobile && windowWidth >= 768) {
				$(this).css('background-position', '50% ' + parseInt(position*0.2) + 'px');
			} else {
				$(this).css({
					backgroundPosition: '50% 0px',
					backgroundSize: 'cover'
				});
			}
		});
	});

}

// Landing Elements
//var pContainerHeight = $('.welcome-section').height();

$(window).scroll(function() {

    var wScroll = $(this).scrollTop();

    /*
    if (wScroll <= pContainerHeight) {

        $('.logo').css({
            'transform': 'translate(0px, ' + wScroll / 2 + '%)'
        });

        $('.back-bird').css({
            'transform': 'translate(0px, ' + wScroll / 4 + '%)'
        });

        $('.fore-bird').css({
            'transform': 'translate(0px, -' + wScroll / 40 + '%)'
        });

    }
    */

    if (wScroll > $('#portfolioApp').offset().top - ($(window).height() )) {

        $('#portfolio .c-portfolio__item').each(function(i) {

            setTimeout(function() {
                $('#portfolio .c-portfolio__item').eq(i).addClass('is-showing');
            }, (1500 * (Math.exp(i * 0.14))) - 1000);
        });

    }
});

/* ----- Clients Carousel ----- */
/*
$('.carousel').slick({
	infinite: true,
	slidesToShow: 4,
	slidesToScroll: 1,
	slide: 'div',
	dots: true,
	easing: 'easeInOutQuart',
	speed: 800,
	responsive: [{
		breakpoint: 1200,
		settings: {
			slidesToShow: 3,
			slidesToScroll: 1,
			infinite: true,
			dots: true,
			easing: 'easeInOutQuart',
			speed: 800,
		}
	},{
		breakpoint: 992,
		settings: {
			slidesToShow: 2,
			slidesToScroll: 1,
			infinite: true,
			dots: true,
			easing: 'easeInOutQuart',
			speed: 800,
		}
	},{
		breakpoint: 768,
		settings: {
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: true,
			dots: true,
			easing: 'easeInOutQuart',
			speed: 800,
		}
	}]
});
*/

/*!
 * Bootstrap v3.1.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

+function(a){"use strict";var b='[data-dismiss="alert"]',c=function(c){a(c).on("click",b,this.close)};c.prototype.close=function(b){function f(){e.trigger("closed.bs.alert").remove()}var c=a(this),d=c.attr("data-target");d||(d=c.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,""));var e=a(d);b&&b.preventDefault(),e.length||(e=c.hasClass("alert")?c:c.parent()),e.trigger(b=a.Event("close.bs.alert"));if(b.isDefaultPrevented())return;e.removeClass("in"),a.support.transition&&e.hasClass("fade")?e.one(a.support.transition.end,f).emulateTransitionEnd(150):f()};var d=a.fn.alert;a.fn.alert=function(b){return this.each(function(){var d=a(this),e=d.data("bs.alert");e||d.data("bs.alert",e=new c(this)),typeof b=="string"&&e[b].call(d)})},a.fn.alert.Constructor=c,a.fn.alert.noConflict=function(){return a.fn.alert=d,this},a(document).on("click.bs.alert.data-api",b,c.prototype.close)}(jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.isLoading=!1};b.DEFAULTS={loadingText:"loading..."},b.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",f.resetText||d.data("resetText",d[e]()),d[e](f[b]||this.options[b]),setTimeout(a.proxy(function(){b=="loadingText"?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},b.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");c.prop("type")=="radio"&&(c.prop("checked")&&this.$element.hasClass("active")?a=!1:b.find(".active").removeClass("active")),a&&c.prop("checked",!this.$element.hasClass("active")).trigger("change")}a&&this.$element.toggleClass("active")};var c=a.fn.button;a.fn.button=function(c){return this.each(function(){var d=a(this),e=d.data("bs.button"),f=typeof c=="object"&&c;e||d.data("bs.button",e=new b(this,f)),c=="toggle"?e.toggle():c&&e.setState(c)})},a.fn.button.Constructor=b,a.fn.button.noConflict=function(){return a.fn.button=c,this},a(document).on("click.bs.button.data-api","[data-toggle^=button]",function(b){var c=a(b.target);c.hasClass("btn")||(c=c.closest(".btn")),c.button("toggle"),b.preventDefault()})}(jQuery),+function(a){"use strict";var b=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=this.sliding=this.interval=this.$active=this.$items=null,this.options.pause=="hover"&&this.$element.on("mouseenter",a.proxy(this.pause,this)).on("mouseleave",a.proxy(this.cycle,this))};b.DEFAULTS={interval:5e3,pause:"hover",wrap:!0},b.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},b.prototype.getActiveIndex=function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},b.prototype.to=function(b){var c=this,d=this.getActiveIndex();if(b>this.$items.length-1||b<0)return;return this.sliding?this.$element.one("slid.bs.carousel",function(){c.to(b)}):d==b?this.pause().cycle():this.slide(b>d?"next":"prev",a(this.$items[b]))},b.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},b.prototype.next=function(){if(this.sliding)return;return this.slide("next")},b.prototype.prev=function(){if(this.sliding)return;return this.slide("prev")},b.prototype.slide=function(b,c){var d=this.$element.find(".item.active"),e=c||d[b](),f=this.interval,g=b=="next"?"left":"right",h=b=="next"?"first":"last",i=this;if(!e.length){if(!this.options.wrap)return;e=this.$element.find(".item")[h]()}if(e.hasClass("active"))return this.sliding=!1;var j=a.Event("slide.bs.carousel",{relatedTarget:e[0],direction:g});this.$element.trigger(j);if(j.isDefaultPrevented())return;return this.sliding=!0,f&&this.pause(),this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid.bs.carousel",function(){var b=a(i.$indicators.children()[i.getActiveIndex()]);b&&b.addClass("active")})),a.support.transition&&this.$element.hasClass("slide")?(e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),d.one(a.support.transition.end,function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger("slid.bs.carousel")},0)}).emulateTransitionEnd(d.css("transition-duration").slice(0,-1)*1e3)):(d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger("slid.bs.carousel")),f&&this.cycle(),this};var c=a.fn.carousel;a.fn.carousel=function(c){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},b.DEFAULTS,d.data(),typeof c=="object"&&c),g=typeof c=="string"?c:f.slide;e||d.data("bs.carousel",e=new b(this,f)),typeof c=="number"?e.to(c):g?e[g]():f.interval&&e.pause().cycle()})},a.fn.carousel.Constructor=b,a.fn.carousel.noConflict=function(){return a.fn.carousel=c,this},a(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",function(b){var c=a(this),d,e=a(c.attr("data-target")||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,"")),f=a.extend({},e.data(),c.data()),g=c.attr("data-slide-to");g&&(f.interval=!1),e.carousel(f),(g=c.attr("data-slide-to"))&&e.data("bs.carousel").to(g),b.preventDefault()}),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var b=a(this);b.carousel(b.data())})})}(jQuery),+function(a){function e(d){a(b).remove(),a(c).each(function(){var b=f(a(this)),c={relatedTarget:this};if(!b.hasClass("open"))return;b.trigger(d=a.Event("hide.bs.dropdown",c));if(d.isDefaultPrevented())return;b.removeClass("open").trigger("hidden.bs.dropdown",c)})}function f(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}"use strict";var b=".dropdown-backdrop",c="[data-toggle=dropdown]",d=function(b){a(b).on("click.bs.dropdown",this.toggle)};d.prototype.toggle=function(b){var c=a(this);if(c.is(".disabled, :disabled"))return;var d=f(c),g=d.hasClass("open");e();if(!g){"ontouchstart"in document.documentElement&&!d.closest(".navbar-nav").length&&a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click",e);var h={relatedTarget:this};d.trigger(b=a.Event("show.bs.dropdown",h));if(b.isDefaultPrevented())return;d.toggleClass("open").trigger("shown.bs.dropdown",h),c.focus()}return!1},d.prototype.keydown=function(b){if(!/(38|40|27)/.test(b.keyCode))return;var d=a(this);b.preventDefault(),b.stopPropagation();if(d.is(".disabled, :disabled"))return;var e=f(d),g=e.hasClass("open");if(!g||g&&b.keyCode==27)return b.which==27&&e.find(c).focus(),d.click();var h=" li:not(.divider):visible a",i=e.find("[role=menu]"+h+", [role=listbox]"+h);if(!i.length)return;var j=i.index(i.filter(":focus"));b.keyCode==38&&j>0&&j--,b.keyCode==40&&j<i.length-1&&j++,~j||(j=0),i.eq(j).focus()};var g=a.fn.dropdown;a.fn.dropdown=function(b){return this.each(function(){var c=a(this),e=c.data("bs.dropdown");e||c.data("bs.dropdown",e=new d(this)),typeof b=="string"&&e[b].call(c)})},a.fn.dropdown.Constructor=d,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=g,this},a(document).on("click.bs.dropdown.data-api",e).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",c,d.prototype.toggle).on("keydown.bs.dropdown.data-api",c+", [role=menu], [role=listbox]",d.prototype.keydown)}(jQuery),+function(a){"use strict";var b=function(b,c){this.options=c,this.$element=a(b),this.$backdrop=this.isShown=null,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};b.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},b.prototype.toggle=function(a){return this[this.isShown?"hide":"show"](a)},b.prototype.show=function(b){var c=this,d=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(d);if(this.isShown||d.isDefaultPrevented())return;this.isShown=!0,this.escape(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.backdrop(function(){var d=a.support.transition&&c.$element.hasClass("fade");c.$element.parent().length||c.$element.appendTo(document.body),c.$element.show().scrollTop(0),d&&c.$element[0].offsetWidth,c.$element.addClass("in").attr("aria-hidden",!1),c.enforceFocus();var e=a.Event("shown.bs.modal",{relatedTarget:b});d?c.$element.find(".modal-dialog").one(a.support.transition.end,function(){c.$element.focus().trigger(e)}).emulateTransitionEnd(300):c.$element.focus().trigger(e)})},b.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b);if(!this.isShown||b.isDefaultPrevented())return;this.isShown=!1,this.escape(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one(a.support.transition.end,a.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal()},b.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]!==a.target&&!this.$element.has(a.target).length&&this.$element.focus()},this))},b.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.bs.modal",a.proxy(function(a){a.which==27&&this.hide()},this)):this.isShown||this.$element.off("keyup.dismiss.bs.modal")},b.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.removeBackdrop(),a.$element.trigger("hidden.bs.modal")})},b.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},b.prototype.backdrop=function(b){var c=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var d=a.support.transition&&c;this.$backdrop=a('<div class="modal-backdrop '+c+'" />').appendTo(document.body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){if(a.target!==a.currentTarget)return;this.options.backdrop=="static"?this.$element[0].focus.call(this.$element[0]):this.hide.call(this)},this)),d&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in");if(!b)return;d?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(a.support.transition.end,b).emulateTransitionEnd(150):b()):b&&b()};var c=a.fn.modal;a.fn.modal=function(c,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},b.DEFAULTS,e.data(),typeof c=="object"&&c);f||e.data("bs.modal",f=new b(this,g)),typeof c=="string"?f[c](d):g.show&&f.show(d)})},a.fn.modal.Constructor=b,a.fn.modal.noConflict=function(){return a.fn.modal=c,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(b){var c=a(this),d=c.attr("href"),e=a(c.attr("data-target")||d&&d.replace(/.*(?=#[^\s]+$)/,"")),f=e.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(d)&&d},e.data(),c.data());c.is("a")&&b.preventDefault(),e.modal(f,this).one("hide",function(){c.is(":visible")&&c.focus()})}),a(document).on("show.bs.modal",".modal",function(){a(document.body).addClass("modal-open")}).on("hidden.bs.modal",".modal",function(){a(document.body).removeClass("modal-open")})}(jQuery),+function(a){"use strict";var b=function(a,b){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",a,b)};b.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},b.prototype.init=function(b,c,d){this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d);var e=this.options.trigger.split(" ");for(var f=e.length;f--;){var g=e[f];if(g=="click")this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if(g!="manual"){var h=g=="hover"?"mouseenter":"focusin",i=g=="hover"?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&typeof b.delay=="number"&&(b.delay={show:b.delay,hide:b.delay}),b},b.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},b.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);clearTimeout(c.timeout),c.hoverState="in";if(!c.options.delay||!c.options.delay.show)return c.show();c.timeout=setTimeout(function(){c.hoverState=="in"&&c.show()},c.options.delay.show)},b.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);clearTimeout(c.timeout),c.hoverState="out";if(!c.options.delay||!c.options.delay.hide)return c.hide();c.timeout=setTimeout(function(){c.hoverState=="out"&&c.hide()},c.options.delay.hide)},b.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);if(b.isDefaultPrevented())return;var c=this,d=this.tip();this.setContent(),this.options.animation&&d.addClass("fade");var e=typeof this.options.placement=="function"?this.options.placement.call(this,d[0],this.$element[0]):this.options.placement,f=/\s?auto?\s?/i,g=f.test(e);g&&(e=e.replace(f,"")||"top"),d.detach().css({top:0,left:0,display:"block"}).addClass(e),this.options.container?d.appendTo(this.options.container):d.insertAfter(this.$element);var h=this.getPosition(),i=d[0].offsetWidth,j=d[0].offsetHeight;if(g){var k=this.$element.parent(),l=e,m=document.documentElement.scrollTop||document.body.scrollTop,n=this.options.container=="body"?window.innerWidth:k.outerWidth(),o=this.options.container=="body"?window.innerHeight:k.outerHeight(),p=this.options.container=="body"?0:k.offset().left;e=e=="bottom"&&h.top+h.height+j-m>o?"top":e=="top"&&h.top-m-j<0?"bottom":e=="right"&&h.right+i>n?"left":e=="left"&&h.left-i<p?"right":e,d.removeClass(l).addClass(e)}var q=this.getCalculatedOffset(e,h,i,j);this.applyPlacement(q,e),this.hoverState=null;var r=function(){c.$element.trigger("shown.bs."+c.type)};a.support.transition&&this.$tip.hasClass("fade")?d.one(a.support.transition.end,r).emulateTransitionEnd(150):r()}},b.prototype.applyPlacement=function(b,c){var d,e=this.tip(),f=e[0].offsetWidth,g=e[0].offsetHeight,h=parseInt(e.css("margin-top"),10),i=parseInt(e.css("margin-left"),10);isNaN(h)&&(h=0),isNaN(i)&&(i=0),b.top=b.top+h,b.left=b.left+i,a.offset.setOffset(e[0],a.extend({using:function(a){e.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),e.addClass("in");var j=e[0].offsetWidth,k=e[0].offsetHeight;c=="top"&&k!=g&&(d=!0,b.top=b.top+g-k);if(/bottom|top/.test(c)){var l=0;b.left<0&&(l=b.left*-2,b.left=0,e.offset(b),j=e[0].offsetWidth,k=e[0].offsetHeight),this.replaceArrow(l-f+j,j,"left")}else this.replaceArrow(k-g,k,"top");d&&e.offset(b)},b.prototype.replaceArrow=function(a,b,c){this.arrow().css(c,a?50*(1-a/b)+"%":"")},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},b.prototype.hide=function(){function e(){b.hoverState!="in"&&c.detach(),b.$element.trigger("hidden.bs."+b.type)}var b=this,c=this.tip(),d=a.Event("hide.bs."+this.type);this.$element.trigger(d);if(d.isDefaultPrevented())return;return c.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?c.one(a.support.transition.end,e).emulateTransitionEnd(150):e(),this.hoverState=null,this},b.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||typeof a.attr("data-original-title")!="string")&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},b.prototype.hasContent=function(){return this.getTitle()},b.prototype.getPosition=function(){var b=this.$element[0];return a.extend({},typeof b.getBoundingClientRect=="function"?b.getBoundingClientRect():{width:b.offsetWidth,height:b.offsetHeight},this.$element.offset())},b.prototype.getCalculatedOffset=function(a,b,c,d){return a=="bottom"?{top:b.top+b.height,left:b.left+b.width/2-c/2}:a=="top"?{top:b.top-d,left:b.left+b.width/2-c/2}:a=="left"?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},b.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||(typeof c.title=="function"?c.title.call(b[0]):c.title),a},b.prototype.tip=function(){return this.$tip=this.$tip||a(this.options.template)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},b.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},b.prototype.enable=function(){this.enabled=!0},b.prototype.disable=function(){this.enabled=!1},b.prototype.toggleEnabled=function(){this.enabled=!this.enabled},b.prototype.toggle=function(b){var c=b?a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type):this;c.tip().hasClass("in")?c.leave(c):c.enter(c)},b.prototype.destroy=function(){clearTimeout(this.timeout),this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var c=a.fn.tooltip;a.fn.tooltip=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f=typeof c=="object"&&c;if(!e&&c=="destroy")return;e||d.data("bs.tooltip",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.tooltip.Constructor=b,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=c,this}}(jQuery),+function(a){"use strict";var b=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");b.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),b.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),b.prototype.constructor=b,b.prototype.getDefaults=function(){return b.DEFAULTS},b.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content")[this.options.html?typeof c=="string"?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},b.prototype.hasContent=function(){return this.getTitle()||this.getContent()},b.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||(typeof b.content=="function"?b.content.call(a[0]):b.content)},b.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},b.prototype.tip=function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip};var c=a.fn.popover;a.fn.popover=function(c){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f=typeof c=="object"&&c;if(!e&&c=="destroy")return;e||d.data("bs.popover",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.popover.Constructor=b,a.fn.popover.noConflict=function(){return a.fn.popover=c,this}}(jQuery),+function(a){"use strict";var b=function(b){this.element=a(b)};b.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,""));if(b.parent("li").hasClass("active"))return;var e=c.find(".active:last a")[0],f=a.Event("show.bs.tab",{relatedTarget:e});b.trigger(f);if(f.isDefaultPrevented())return;var g=a(d);this.activate(b.parent("li"),c),this.activate(g,g.parent(),function(){b.trigger({type:"shown.bs.tab",relatedTarget:e})})},b.prototype.activate=function(b,c,d){function g(){e.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),f?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var e=c.find("> .active"),f=d&&a.support.transition&&e.hasClass("fade");f?e.one(a.support.transition.end,g).emulateTransitionEnd(150):g(),e.removeClass("in")};var c=a.fn.tab;a.fn.tab=function(c){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new b(this)),typeof c=="string"&&e[c]()})},a.fn.tab.Constructor=b,a.fn.tab.noConflict=function(){return a.fn.tab=c,this},a(document).on("click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(b){b.preventDefault(),a(this).tab("show")})}(jQuery),+function(a){"use strict";var b=function(c,d){this.options=a.extend({},b.DEFAULTS,d),this.$window=a(window).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(c),this.affixed=this.unpin=this.pinnedOffset=null,this.checkPosition()};b.RESET="affix affix-top affix-bottom",b.DEFAULTS={offset:0},b.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(b.RESET).addClass("affix");var a=this.$window.scrollTop(),c=this.$element.offset();return this.pinnedOffset=c.top-a},b.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},b.prototype.checkPosition=function(){if(!this.$element.is(":visible"))return;var c=a(document).height(),d=this.$window.scrollTop(),e=this.$element.offset(),f=this.options.offset,g=f.top,h=f.bottom;this.affixed=="top"&&(e.top+=d),typeof f!="object"&&(h=g=f),typeof g=="function"&&(g=f.top(this.$element)),typeof h=="function"&&(h=f.bottom(this.$element));var i=this.unpin!=null&&d+this.unpin<=e.top?!1:h!=null&&e.top+this.$element.height()>=c-h?"bottom":g!=null&&d<=g?"top":!1;if(this.affixed===i)return;this.unpin&&this.$element.css("top","");var j="affix"+(i?"-"+i:""),k=a.Event(j+".bs.affix");this.$element.trigger(k);if(k.isDefaultPrevented())return;this.affixed=i,this.unpin=i=="bottom"?this.getPinnedOffset():null,this.$element.removeClass(b.RESET).addClass(j).trigger(a.Event(j.replace("affix","affixed"))),i=="bottom"&&this.$element.offset({top:c-h-this.$element.height()})};var c=a.fn.affix;a.fn.affix=function(c){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f=typeof c=="object"&&c;e||d.data("bs.affix",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.affix.Constructor=b,a.fn.affix.noConflict=function(){return a.fn.affix=c,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var b=a(this),c=b.data();c.offset=c.offset||{},c.offsetBottom&&(c.offset.bottom=c.offsetBottom),c.offsetTop&&(c.offset.top=c.offsetTop),b.affix(c)})})}(jQuery),+function(a){"use strict";var b=function(c,d){this.$element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.transitioning=null,this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};b.DEFAULTS={toggle:!0},b.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},b.prototype.show=function(){if(this.transitioning||this.$element.hasClass("in"))return;var b=a.Event("show.bs.collapse");this.$element.trigger(b);if(b.isDefaultPrevented())return;var c=this.$parent&&this.$parent.find("> .panel > .in");if(c&&c.length){var d=c.data("bs.collapse");if(d&&d.transitioning)return;c.collapse("hide"),d||c.data("bs.collapse",null)}var e=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[e](0),this.transitioning=1;var f=function(){this.$element.removeClass("collapsing").addClass("collapse in")[e]("auto"),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return f.call(this);var g=a.camelCase(["scroll",e].join("-"));this.$element.one(a.support.transition.end,a.proxy(f,this)).emulateTransitionEnd(350)[e](this.$element[0][g])},b.prototype.hide=function(){if(this.transitioning||!this.$element.hasClass("in"))return;var b=a.Event("hide.bs.collapse");this.$element.trigger(b);if(b.isDefaultPrevented())return;var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1;var d=function(){this.transitioning=0,this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")};if(!a.support.transition)return d.call(this);this.$element[c](0).one(a.support.transition.end,a.proxy(d,this)).emulateTransitionEnd(350)},b.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var c=a.fn.collapse;a.fn.collapse=function(c){return this.each(function(){var d=a(this),e=d.data("bs.collapse"),f=a.extend({},b.DEFAULTS,d.data(),typeof c=="object"&&c);!e&&f.toggle&&c=="show"&&(c=!c),e||d.data("bs.collapse",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.collapse.Constructor=b,a.fn.collapse.noConflict=function(){return a.fn.collapse=c,this},a(document).on("click.bs.collapse.data-api","[data-toggle=collapse]",function(b){var c=a(this),d,e=c.attr("data-target")||b.preventDefault()||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""),f=a(e),g=f.data("bs.collapse"),h=g?"toggle":c.data(),i=c.attr("data-parent"),j=i&&a(i);if(!g||!g.transitioning)j&&j.find('[data-toggle=collapse][data-parent="'+i+'"]').not(c).addClass("collapsed"),c[f.hasClass("in")?"addClass":"removeClass"]("collapsed");f.collapse(h)})}(jQuery),+function(a){function b(c,d){var e,f=a.proxy(this.process,this);this.$element=a(c).is("body")?a(window):a(c),this.$body=a("body"),this.$scrollElement=this.$element.on("scroll.bs.scroll-spy.data-api",f),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||(e=a(c).attr("href"))&&e.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.offsets=a([]),this.targets=a([]),this.activeTarget=null,this.refresh(),this.process()}"use strict",b.DEFAULTS={offset:10},b.prototype.refresh=function(){var b=this.$element[0]==window?"offset":"position";this.offsets=a([]),this.targets=a([]);var c=this,d=this.$body.find(this.selector).map(function(){var d=a(this),e=d.data("target")||d.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[b]().top+(!a.isWindow(c.$scrollElement.get(0))&&c.$scrollElement.scrollTop()),e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){c.offsets.push(this[0]),c.targets.push(this[1])})},b.prototype.process=function(){var a=this.$scrollElement.scrollTop()+this.options.offset,b=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,c=b-this.$scrollElement.height(),d=this.offsets,e=this.targets,f=this.activeTarget,g;if(a>=c)return f!=(g=e.last()[0])&&this.activate(g);if(f&&a<=d[0])return f!=(g=e[0])&&this.activate(g);for(g=d.length;g--;)f!=e[g]&&a>=d[g]&&(!d[g+1]||a<=d[g+1])&&this.activate(e[g])},b.prototype.activate=function(b){this.activeTarget=b,a(this.selector).parentsUntil(this.options.target,".active").removeClass("active");var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")};var c=a.fn.scrollspy;a.fn.scrollspy=function(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f=typeof c=="object"&&c;e||d.data("bs.scrollspy",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=c,this},a(window).on("load",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);b.scrollspy(b.data())})})}(jQuery),+function(a){function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(a.style[c]!==undefined)return{end:b[c]};return!1}"use strict",a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one(a.support.transition.end,function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b()})}(jQuery)

/* Modernizr 2.7.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-borderimage-borderradius-boxshadow-flexbox-flexboxlegacy-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-csscolumns-generatedcontent-cssgradients-cssreflections-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-canvastext-draganddrop-hashchange-history-audio-video-indexeddb-input-inputtypes-localstorage-postmessage-sessionstorage-websockets-websqldatabase-webworkers-geolocation-inlinesvg-smil-svg-svgclippaths-touch-webgl-shiv-mq-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function D(a){j.cssText=a}function E(a,b){return D(n.join(a+";")+(b||""))}function F(a,b){return typeof a===b}function G(a,b){return!!~(""+a).indexOf(b)}function H(a,b){for(var d in a){var e=a[d];if(!G(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function I(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:F(f,"function")?f.bind(d||b):f}return!1}function J(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return F(b,"string")||F(b,"undefined")?H(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),I(e,b,c))}function K(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.7.1",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},z=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b).matches;var d;return y("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},A=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=F(e[d],"function"),F(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),B={}.hasOwnProperty,C;!F(B,"undefined")&&!F(B.call,"undefined")?C=function(a,b){return B.call(a,b)}:C=function(a,b){return b in a&&F(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e}),s.flexbox=function(){return J("flexWrap")},s.flexboxlegacy=function(){return J("boxDirection")},s.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},s.canvastext=function(){return!!e.canvas&&!!F(b.createElement("canvas").getContext("2d").fillText,"function")},s.webgl=function(){return!!a.WebGLRenderingContext},s.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:y(["@media (",n.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},s.geolocation=function(){return"geolocation"in navigator},s.postmessage=function(){return!!a.postMessage},s.websqldatabase=function(){return!!a.openDatabase},s.indexedDB=function(){return!!J("indexedDB",a)},s.hashchange=function(){return A("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},s.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},s.rgba=function(){return D("background-color:rgba(150,255,150,.5)"),G(j.backgroundColor,"rgba")},s.hsla=function(){return D("background-color:hsla(120,40%,100%,.5)"),G(j.backgroundColor,"rgba")||G(j.backgroundColor,"hsla")},s.multiplebgs=function(){return D("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return J("backgroundSize")},s.borderimage=function(){return J("borderImage")},s.borderradius=function(){return J("borderRadius")},s.boxshadow=function(){return J("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.opacity=function(){return E("opacity:.55"),/^0.55$/.test(j.opacity)},s.cssanimations=function(){return J("animationName")},s.csscolumns=function(){return J("columnCount")},s.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return D((a+"-webkit- ".split(" ").join(b+a)+n.join(c+a)).slice(0,-a.length)),G(j.backgroundImage,"gradient")},s.cssreflections=function(){return J("boxReflect")},s.csstransforms=function(){return!!J("transform")},s.csstransforms3d=function(){var a=!!J("perspective");return a&&"webkitPerspective"in g.style&&y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},s.csstransitions=function(){return J("transition")},s.fontface=function(){var a;return y('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&g.indexOf(d.split(" ")[0])===0}),a},s.generatedcontent=function(){var a;return y(["#",h,"{font:0/0 a}#",h,':after{content:"',l,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},s.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},s.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.webworkers=function(){return!!a.Worker},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==r.svg},s.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(m.call(b.createElementNS(r.svg,"animate")))},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var L in s)C(s,L)&&(x=L.toLowerCase(),e[x]=s[L](),v.push((e[x]?"":"no-")+x));return e.input||K(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)C(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},D(""),i=k=null,function(a,b){function l(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a=="string"?a.split(" "):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&&!e.test(a)&&!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function q(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?o(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function r(a){a||(a=b);var c=n(a);return s.shivCSS&&!g&&!c.hasCSS&&(c.hasCSS=!!l(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||q(a,c),a}var c="3.7.0",d=a.html5||{},e=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h="_html5shiv",i=0,j={},k;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",g="hidden"in a,k=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.mq=z,e.hasEvent=A,e.testProp=function(a){return H([a])},e.testAllProps=J,e.testStyles=y,e.prefixed=function(a,b,c){return b?J(a,b,c):J(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
// Modernizr IE version test
// Jon Suderman 2013
(function(){

  // https://gist.github.com/padolsey/527683#comment-786682
  var ie = (function(){

    // for-loop saves characters over while
    for( var v = 3,

          // b just as good as a div with 2 fewer characters
          el = document.createElement('b'),

          // el.all instead of el.getElementsByTagName('i')
          // empty array as loop breaker (and exception-avoider) for non-IE and IE10+
          all = el.all || [];

        // i tag not well-formed since we know that IE5-IE9 won't mind
        el.innerHTML = '<!--[if gt IE ' + (++v) + ']><i><![endif]-->',
        all[0];
      );

    // instead of undefined, returns the documentMode for IE10+ compatibility
    // non-IE will still get undefined as before
    return v > 4 ? v : document.documentMode;

  }());

  // Check if ie version has been detected
  if (typeof ie !== 'undefined') {

    // Add ie classes to html element
    document.documentElement.className += ' ie ie' + ie;

    // Assign ie to Modernizr if available
    if (typeof Modernizr !== 'undefined') {
      Modernizr.ie = ie;
    }

    // Otherwise, assign ie to the window
    else {
      window.ie = ie;
    }

  }

})();

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/
jQuery.easing["jswing"]=jQuery.easing["swing"];jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(a,b,c,d,e){return jQuery.easing[jQuery.easing.def](a,b,c,d,e)},easeInQuad:function(a,b,c,d,e){return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b+c;return-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e){return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b+c;return d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b*b+c;return-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e){return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b*b*b+c;return d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e){return-d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e){return-d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e){return b==0?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e){if(b==0)return c;if(b==e)return c+d;if((b/=e/2)<1)return d/2*Math.pow(2,10*(b-1))+c;return d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e){return-d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e){if((b/=e/2)<1)return-d/2*(Math.sqrt(1-b*b)-1)+c;return d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e)==1)return c+d;if(!g)g=e*.3;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g))+c},easeOutElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e)==1)return c+d;if(!g)g=e*.3;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*b)*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInOutElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e/2)==2)return c+d;if(!g)g=e*.3*1.5;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);if(b<1)return-.5*h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+c;return h*Math.pow(2,-10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)*.5+d+c},easeInBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;return d*(b/=e)*b*((f+1)*b-f)+c},easeOutBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;return d*((b=b/e-1)*b*((f+1)*b+f)+1)+c},easeInOutBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;if((b/=e/2)<1)return d/2*b*b*(((f*=1.525)+1)*b-f)+c;return d/2*((b-=2)*b*(((f*=1.525)+1)*b+f)+2)+c},easeInBounce:function(a,b,c,d,e){return d-jQuery.easing.easeOutBounce(a,e-b,0,d,e)+c},easeOutBounce:function(a,b,c,d,e){if((b/=e)<1/2.75){return d*7.5625*b*b+c}else if(b<2/2.75){return d*(7.5625*(b-=1.5/2.75)*b+.75)+c}else if(b<2.5/2.75){return d*(7.5625*(b-=2.25/2.75)*b+.9375)+c}else{return d*(7.5625*(b-=2.625/2.75)*b+.984375)+c}},easeInOutBounce:function(a,b,c,d,e){if(b<e/2)return jQuery.easing.easeInBounce(a,b*2,0,d,e)*.5+c;return jQuery.easing.easeOutBounce(a,b*2-e,0,d,e)*.5+d*.5+c}})
/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
!function(e){var t={animation:"dissolve",separator:",",speed:2e3};e.fx.step.textShadowBlur=function(t){e(t.elem).prop("textShadowBlur",t.now).css({textShadow:"0 0 "+Math.floor(t.now)+"px black"})};e.fn.textrotator=function(n){var r=e.extend({},t,n);return this.each(function(){var t=e(this);var n=[];e.each(t.text().split(r.separator),function(e,t){n.push(t)});t.text(n[0]);var i=function(){switch(r.animation){case"dissolve":t.animate({textShadowBlur:20,opacity:0},500,function(){s=e.inArray(t.text(),n);if(s+1==n.length)s=-1;t.text(n[s+1]).animate({textShadowBlur:0,opacity:1},500)});break;case"flip":if(t.find(".back").length>0){t.html(t.find(".back").html())}var i=t.text();var s=e.inArray(i,n);if(s+1==n.length)s=-1;t.html("");e("<span class='front'>"+i+"</span>").appendTo(t);e("<span class='back'>"+n[s+1]+"</span>").appendTo(t);t.wrapInner("<span class='rotating' />").find(".rotating").hide().addClass("flip").show().css({"-webkit-transform":" rotateY(-180deg)","-moz-transform":" rotateY(-180deg)","-o-transform":" rotateY(-180deg)",transform:" rotateY(-180deg)"});break;case"flipUp":if(t.find(".back").length>0){t.html(t.find(".back").html())}var i=t.text();var s=e.inArray(i,n);if(s+1==n.length)s=-1;t.html("");e("<span class='front'>"+i+"</span>").appendTo(t);e("<span class='back'>"+n[s+1]+"</span>").appendTo(t);t.wrapInner("<span class='rotating' />").find(".rotating").hide().addClass("flip up").show().css({"-webkit-transform":" rotateX(-180deg)","-moz-transform":" rotateX(-180deg)","-o-transform":" rotateX(-180deg)",transform:" rotateX(-180deg)"});break;case"flipCube":if(t.find(".back").length>0){t.html(t.find(".back").html())}var i=t.text();var s=e.inArray(i,n);if(s+1==n.length)s=-1;t.html("");e("<span class='front'>"+i+"</span>").appendTo(t);e("<span class='back'>"+n[s+1]+"</span>").appendTo(t);t.wrapInner("<span class='rotating' />").find(".rotating").hide().addClass("flip cube").show().css({"-webkit-transform":" rotateY(180deg)","-moz-transform":" rotateY(180deg)","-o-transform":" rotateY(180deg)",transform:" rotateY(180deg)"});break;case"flipCubeUp":if(t.find(".back").length>0){t.html(t.find(".back").html())}var i=t.text();var s=e.inArray(i,n);if(s+1==n.length)s=-1;t.html("");e("<span class='front'>"+i+"</span>").appendTo(t);e("<span class='back'>"+n[s+1]+"</span>").appendTo(t);t.wrapInner("<span class='rotating' />").find(".rotating").hide().addClass("flip cube up").show().css({"-webkit-transform":" rotateX(180deg)","-moz-transform":" rotateX(180deg)","-o-transform":" rotateX(180deg)",transform:" rotateX(180deg)"});break;case"spin":if(t.find(".rotating").length>0){t.html(t.find(".rotating").html())}s=e.inArray(t.text(),n);if(s+1==n.length)s=-1;t.wrapInner("<span class='rotating spin' />").find(".rotating").hide().text(n[s+1]).show().css({"-webkit-transform":" rotate(0) scale(1)","-moz-transform":"rotate(0) scale(1)","-o-transform":"rotate(0) scale(1)",transform:"rotate(0) scale(1)"});break;case"fade":t.fadeOut(r.speed,function(){s=e.inArray(t.text(),n);if(s+1==n.length)s=-1;t.text(n[s+1]).fadeIn(r.speed)});break}};setInterval(i,r.speed)})}}(window.jQuery)
/**
 * jquery.cbpQTRotator.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
;( function( $, window, undefined ) {

	'use strict';

	// global
	var Modernizr = window.Modernizr;

	$.CBPQTRotator = function( options, element ) {
		this.$el = $( element );
		this._init( options );
	};

	// the options
	$.CBPQTRotator.defaults = {
		// default transition speed (ms)
		speed : 700,
		// default transition easing
		easing : 'ease',
		// rotator interval (ms)
		interval : 12000
	};

	$.CBPQTRotator.prototype = {
		_init : function( options ) {
			// options
			this.options = $.extend( true, {}, $.CBPQTRotator.defaults, options );
			// cache some elements and initialize some variables
			this._config();
			// show current item
			this.$items.eq( this.current ).addClass( 'current' );
			// set the transition to the items
			if( this.support ) {
				this._setTransition();
			}
			// start rotating the items
			this._startRotator();
		},
		_config : function() {

			// the content items
			this.$items = this.$el.children( 'div.testimonial' );
			// total items
			this.itemsCount = this.$items.length;
			// current item's index
			this.current = 0;
			// support for CSS Transitions
			this.support = Modernizr.csstransitions;
			// add the progress bar
			if( this.support ) {
				this.$progress = $( '<span class="testimonial-progress"></span>' ).appendTo( '#testimonials' );
			}
			// bullets
			// this.createBullets = $( '<ul class="testimonial-bullets"></ul>' ).appendTo( '#testimonials-rotator' );
			// for (var i=0; i<this.itemsCount; i++){
			// 	$('.testimonial-bullets').append('<li class="testim-bullet"></li>');
			// }
			// $('li.testim-bullet').eq( this.current ).addClass( 'current-bullet' );
		
		},
		_setTransition : function() {
			setTimeout( $.proxy( function() {
				this.$items.css( 'transition', 'opacity ' + this.options.speed + 'ms ' + this.options.easing );
			}, this ), 25 );
		},
		_startRotator: function() {

			if( this.support ) {
				this._startProgress();
			}

			setTimeout( $.proxy( function() {
				if( this.support ) {
					this._resetProgress();
				}
				this._next();
				this._startRotator();
			}, this ), this.options.interval );

		},
		_next : function() {

			// hide previous item
			this.$items.eq( this.current ).removeClass( 'current' );
			$('li.testim-bullet').eq( this.current ).removeClass( 'current-bullet' );
			// update current value
			this.current = this.current < this.itemsCount - 1 ? this.current + 1 : 0;
			// show next item
			this.$items.eq( this.current ).addClass('current');
			$('li.testim-bullet').eq( this.current ).addClass( 'current-bullet' );

		},
		_startProgress : function() {
			
			setTimeout( $.proxy( function() {
				this.$progress.css( { transition : 'width ' + this.options.interval + 'ms linear', width : '100%' } );
			}, this ), 25 );

		},
		_resetProgress : function() {
			this.$progress.css( { transition : 'none', width : '0%' } );
		},
		destroy : function() {
			if( this.support ) {
				this.$items.css( 'transition', 'none' );
				this.$progress.remove();
			}
			this.$items.removeClass( 'current' ).css( {
				'position' : 'relative',
				'z-index' : 100,
				'pointer-events' : 'auto',
				'opacity' : 1
			} );
		}
	};

	var logError = function( message ) {
		if ( window.console ) {
			window.console.error( message );
		}
	};

	$.fn.cbpQTRotator = function( options ) {
		if ( typeof options === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			this.each(function() {
				var instance = $.data( this, 'cbpQTRotator' );
				if ( !instance ) {
					logError( "cannot call methods on cbpQTRotator prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					logError( "no such method '" + options + "' for cbpQTRotator instance" );
					return;
				}
				instance[ options ].apply( instance, args );
			});
		} 
		else {
			this.each(function() {	
				var instance = $.data( this, 'cbpQTRotator' );
				if ( instance ) {
					instance._init();
				}
				else {
					instance = $.data( this, 'cbpQTRotator', new $.CBPQTRotator( options, this ) );
				}
			});
		}
		return this;
	};

} )( jQuery, window );
// Generated by CoffeeScript 1.6.2
/*
jQuery Waypoints - v2.0.4
Copyright (c) 2011-2014 Caleb Troughton
Dual licensed under the MIT license and GPL license.
https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
*/
(function(){var t=[].indexOf||function(t){for(var e=0,n=this.length;e<n;e++){if(e in this&&this[e]===t)return e}return-1},e=[].slice;(function(t,e){if(typeof define==="function"&&define.amd){return define("waypoints",["jquery"],function(n){return e(n,t)})}else{return e(t.jQuery,t)}})(this,function(n,r){var i,o,l,s,f,u,c,a,h,d,p,y,v,w,g,m;i=n(r);a=t.call(r,"ontouchstart")>=0;s={horizontal:{},vertical:{}};f=1;c={};u="waypoints-context-id";p="resize.waypoints";y="scroll.waypoints";v=1;w="waypoints-waypoint-ids";g="waypoint";m="waypoints";o=function(){function t(t){var e=this;this.$element=t;this.element=t[0];this.didResize=false;this.didScroll=false;this.id="context"+f++;this.oldScroll={x:t.scrollLeft(),y:t.scrollTop()};this.waypoints={horizontal:{},vertical:{}};this.element[u]=this.id;c[this.id]=this;t.bind(y,function(){var t;if(!(e.didScroll||a)){e.didScroll=true;t=function(){e.doScroll();return e.didScroll=false};return r.setTimeout(t,n[m].settings.scrollThrottle)}});t.bind(p,function(){var t;if(!e.didResize){e.didResize=true;t=function(){n[m]("refresh");return e.didResize=false};return r.setTimeout(t,n[m].settings.resizeThrottle)}})}t.prototype.doScroll=function(){var t,e=this;t={horizontal:{newScroll:this.$element.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.$element.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};if(a&&(!t.vertical.oldScroll||!t.vertical.newScroll)){n[m]("refresh")}n.each(t,function(t,r){var i,o,l;l=[];o=r.newScroll>r.oldScroll;i=o?r.forward:r.backward;n.each(e.waypoints[t],function(t,e){var n,i;if(r.oldScroll<(n=e.offset)&&n<=r.newScroll){return l.push(e)}else if(r.newScroll<(i=e.offset)&&i<=r.oldScroll){return l.push(e)}});l.sort(function(t,e){return t.offset-e.offset});if(!o){l.reverse()}return n.each(l,function(t,e){if(e.options.continuous||t===l.length-1){return e.trigger([i])}})});return this.oldScroll={x:t.horizontal.newScroll,y:t.vertical.newScroll}};t.prototype.refresh=function(){var t,e,r,i=this;r=n.isWindow(this.element);e=this.$element.offset();this.doScroll();t={horizontal:{contextOffset:r?0:e.left,contextScroll:r?0:this.oldScroll.x,contextDimension:this.$element.width(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:r?0:e.top,contextScroll:r?0:this.oldScroll.y,contextDimension:r?n[m]("viewportHeight"):this.$element.height(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};return n.each(t,function(t,e){return n.each(i.waypoints[t],function(t,r){var i,o,l,s,f;i=r.options.offset;l=r.offset;o=n.isWindow(r.element)?0:r.$element.offset()[e.offsetProp];if(n.isFunction(i)){i=i.apply(r.element)}else if(typeof i==="string"){i=parseFloat(i);if(r.options.offset.indexOf("%")>-1){i=Math.ceil(e.contextDimension*i/100)}}r.offset=o-e.contextOffset+e.contextScroll-i;if(r.options.onlyOnScroll&&l!=null||!r.enabled){return}if(l!==null&&l<(s=e.oldScroll)&&s<=r.offset){return r.trigger([e.backward])}else if(l!==null&&l>(f=e.oldScroll)&&f>=r.offset){return r.trigger([e.forward])}else if(l===null&&e.oldScroll>=r.offset){return r.trigger([e.forward])}})})};t.prototype.checkEmpty=function(){if(n.isEmptyObject(this.waypoints.horizontal)&&n.isEmptyObject(this.waypoints.vertical)){this.$element.unbind([p,y].join(" "));return delete c[this.id]}};return t}();l=function(){function t(t,e,r){var i,o;r=n.extend({},n.fn[g].defaults,r);if(r.offset==="bottom-in-view"){r.offset=function(){var t;t=n[m]("viewportHeight");if(!n.isWindow(e.element)){t=e.$element.height()}return t-n(this).outerHeight()}}this.$element=t;this.element=t[0];this.axis=r.horizontal?"horizontal":"vertical";this.callback=r.handler;this.context=e;this.enabled=r.enabled;this.id="waypoints"+v++;this.offset=null;this.options=r;e.waypoints[this.axis][this.id]=this;s[this.axis][this.id]=this;i=(o=this.element[w])!=null?o:[];i.push(this.id);this.element[w]=i}t.prototype.trigger=function(t){if(!this.enabled){return}if(this.callback!=null){this.callback.apply(this.element,t)}if(this.options.triggerOnce){return this.destroy()}};t.prototype.disable=function(){return this.enabled=false};t.prototype.enable=function(){this.context.refresh();return this.enabled=true};t.prototype.destroy=function(){delete s[this.axis][this.id];delete this.context.waypoints[this.axis][this.id];return this.context.checkEmpty()};t.getWaypointsByElement=function(t){var e,r;r=t[w];if(!r){return[]}e=n.extend({},s.horizontal,s.vertical);return n.map(r,function(t){return e[t]})};return t}();d={init:function(t,e){var r;if(e==null){e={}}if((r=e.handler)==null){e.handler=t}this.each(function(){var t,r,i,s;t=n(this);i=(s=e.context)!=null?s:n.fn[g].defaults.context;if(!n.isWindow(i)){i=t.closest(i)}i=n(i);r=c[i[0][u]];if(!r){r=new o(i)}return new l(t,r,e)});n[m]("refresh");return this},disable:function(){return d._invoke.call(this,"disable")},enable:function(){return d._invoke.call(this,"enable")},destroy:function(){return d._invoke.call(this,"destroy")},prev:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){if(e>0){return t.push(n[e-1])}})},next:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){if(e<n.length-1){return t.push(n[e+1])}})},_traverse:function(t,e,i){var o,l;if(t==null){t="vertical"}if(e==null){e=r}l=h.aggregate(e);o=[];this.each(function(){var e;e=n.inArray(this,l[t]);return i(o,e,l[t])});return this.pushStack(o)},_invoke:function(t){this.each(function(){var e;e=l.getWaypointsByElement(this);return n.each(e,function(e,n){n[t]();return true})});return this}};n.fn[g]=function(){var t,r;r=arguments[0],t=2<=arguments.length?e.call(arguments,1):[];if(d[r]){return d[r].apply(this,t)}else if(n.isFunction(r)){return d.init.apply(this,arguments)}else if(n.isPlainObject(r)){return d.init.apply(this,[null,r])}else if(!r){return n.error("jQuery Waypoints needs a callback function or handler option.")}else{return n.error("The "+r+" method does not exist in jQuery Waypoints.")}};n.fn[g].defaults={context:r,continuous:true,enabled:true,horizontal:false,offset:0,triggerOnce:false};h={refresh:function(){return n.each(c,function(t,e){return e.refresh()})},viewportHeight:function(){var t;return(t=r.innerHeight)!=null?t:i.height()},aggregate:function(t){var e,r,i;e=s;if(t){e=(i=c[n(t)[0][u]])!=null?i.waypoints:void 0}if(!e){return[]}r={horizontal:[],vertical:[]};n.each(r,function(t,i){n.each(e[t],function(t,e){return i.push(e)});i.sort(function(t,e){return t.offset-e.offset});r[t]=n.map(i,function(t){return t.element});return r[t]=n.unique(r[t])});return r},above:function(t){if(t==null){t=r}return h._filter(t,"vertical",function(t,e){return e.offset<=t.oldScroll.y})},below:function(t){if(t==null){t=r}return h._filter(t,"vertical",function(t,e){return e.offset>t.oldScroll.y})},left:function(t){if(t==null){t=r}return h._filter(t,"horizontal",function(t,e){return e.offset<=t.oldScroll.x})},right:function(t){if(t==null){t=r}return h._filter(t,"horizontal",function(t,e){return e.offset>t.oldScroll.x})},enable:function(){return h._invoke("enable")},disable:function(){return h._invoke("disable")},destroy:function(){return h._invoke("destroy")},extendFn:function(t,e){return d[t]=e},_invoke:function(t){var e;e=n.extend({},s.vertical,s.horizontal);return n.each(e,function(e,n){n[t]();return true})},_filter:function(t,e,r){var i,o;i=c[n(t)[0][u]];if(!i){return[]}o=[];n.each(i.waypoints[e],function(t,e){if(r(i,e)){return o.push(e)}});o.sort(function(t,e){return t.offset-e.offset});return n.map(o,function(t){return t.element})}};n[m]=function(){var t,n;n=arguments[0],t=2<=arguments.length?e.call(arguments,1):[];if(h[n]){return h[n].apply(null,t)}else{return h.aggregate.call(null,n)}};n[m].settings={resizeThrottle:100,scrollThrottle:30};return i.load(function(){return n[m]("refresh")})})}).call(this);
/*!
 * Vue.js v2.0.1
 * (c) 2014-2016 Evan You
 * Released under the MIT License.
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Vue=t()}(this,function(){"use strict";function e(e){return null==e?"":"object"==typeof e?JSON.stringify(e,null,2):String(e)}function t(e){var t=parseFloat(e,10);return t||0===t?t:e}function n(e,t){for(var n=Object.create(null),r=e.split(","),i=0;i<r.length;i++)n[r[i]]=!0;return t?function(e){return n[e.toLowerCase()]}:function(e){return n[e]}}function r(e,t){if(e.length){var n=e.indexOf(t);if(n>-1)return e.splice(n,1)}}function i(e,t){return hr.call(e,t)}function o(e){return"string"==typeof e||"number"==typeof e}function a(e){var t=Object.create(null);return function(n){var r=t[n];return r||(t[n]=e(n))}}function s(e,t){function n(n){var r=arguments.length;return r?r>1?e.apply(t,arguments):e.call(t,n):e.call(t)}return n._length=e.length,n}function c(e,t){t=t||0;for(var n=e.length-t,r=new Array(n);n--;)r[n]=e[n+t];return r}function u(e,t){for(var n in t)e[n]=t[n];return e}function l(e){return null!==e&&"object"==typeof e}function f(e){return $r.call(e)===wr}function d(e){for(var t={},n=0;n<e.length;n++)e[n]&&u(t,e[n]);return t}function p(){}function v(e){return e.reduce(function(e,t){return e.concat(t.staticKeys||[])},[]).join(",")}function h(e,t){return e==t||!(!l(e)||!l(t))&&JSON.stringify(e)===JSON.stringify(t)}function m(e,t){for(var n=0;n<e.length;n++)if(h(e[n],t))return n;return-1}function g(e){var t=(e+"").charCodeAt(0);return 36===t||95===t}function y(e,t,n,r){Object.defineProperty(e,t,{value:n,enumerable:!!r,writable:!0,configurable:!0})}function _(e){if(!kr.test(e)){var t=e.split(".");return function(e){for(var n=0;n<t.length;n++){if(!e)return;e=e[t[n]]}return e}}}function b(e){return/native code/.test(e.toString())}function $(e){Rr.target&&Ir.push(Rr.target),Rr.target=e}function w(){Rr.target=Ir.pop()}function C(){Fr.length=0,Br={},Hr=Ur=!1}function x(){for(Ur=!0,Fr.sort(function(e,t){return e.id-t.id}),zr=0;zr<Fr.length;zr++){var e=Fr[zr],t=e.id;Br[t]=null,e.run()}Nr&&xr.devtools&&Nr.emit("flush"),C()}function k(e){var t=e.id;if(null==Br[t]){if(Br[t]=!0,Ur){for(var n=Fr.length-1;n>=0&&Fr[n].id>e.id;)n--;Fr.splice(Math.max(n,zr)+1,0,e)}else Fr.push(e);Hr||(Hr=!0,Mr(x))}}function A(e,t){var n,r;t||(t=qr,t.clear());var i=Array.isArray(e),o=l(e);if((i||o)&&Object.isExtensible(e)){if(e.__ob__){var a=e.__ob__.dep.id;if(t.has(a))return;t.add(a)}if(i)for(n=e.length;n--;)A(e[n],t);else if(o)for(r=Object.keys(e),n=r.length;n--;)A(e[r[n]],t)}}function O(e,t){e.__proto__=t}function T(e,t,n){for(var r=0,i=n.length;r<i;r++){var o=n[r];y(e,o,t[o])}}function S(e){if(l(e)){var t;return i(e,"__ob__")&&e.__ob__ instanceof Yr?t=e.__ob__:Gr.shouldConvert&&!xr._isServer&&(Array.isArray(e)||f(e))&&Object.isExtensible(e)&&!e._isVue&&(t=new Yr(e)),t}}function E(e,t,n,r){var i=new Rr,o=Object.getOwnPropertyDescriptor(e,t);if(!o||o.configurable!==!1){var a=o&&o.get,s=o&&o.set,c=S(n);Object.defineProperty(e,t,{enumerable:!0,configurable:!0,get:function(){var t=a?a.call(e):n;if(Rr.target&&(i.depend(),c&&c.dep.depend(),Array.isArray(t)))for(var r=void 0,o=0,s=t.length;o<s;o++)r=t[o],r&&r.__ob__&&r.__ob__.dep.depend();return t},set:function(t){var r=a?a.call(e):n;t!==r&&(s?s.call(e,t):n=t,c=S(t),i.notify())}})}}function j(e,t,n){if(Array.isArray(e))return e.splice(t,1,n),n;if(i(e,t))return void(e[t]=n);var r=e.__ob__;if(!(e._isVue||r&&r.vmCount))return r?(E(r.value,t,n),r.dep.notify(),n):void(e[t]=n)}function L(e,t){var n=e.__ob__;e._isVue||n&&n.vmCount||i(e,t)&&(delete e[t],n&&n.dep.notify())}function D(e){e._watchers=[],N(e),M(e),P(e),I(e),F(e)}function N(e){var t=e.$options.props;if(t){var n=e.$options.propsData||{},r=e.$options._propKeys=Object.keys(t),i=!e.$parent;Gr.shouldConvert=i;for(var o=function(i){var o=r[i];E(e,o,je(o,t,n,e))},a=0;a<r.length;a++)o(a);Gr.shouldConvert=!0}}function M(e){var t=e.$options.data;t=e._data="function"==typeof t?t.call(e):t||{},f(t)||(t={});for(var n=Object.keys(t),r=e.$options.props,o=n.length;o--;)r&&i(r,n[o])||U(e,n[o]);S(t),t.__ob__&&t.__ob__.vmCount++}function P(e){var t=e.$options.computed;if(t)for(var n in t){var r=t[n];"function"==typeof r?(Qr.get=R(r,e),Qr.set=p):(Qr.get=r.get?r.cache!==!1?R(r.get,e):s(r.get,e):p,Qr.set=r.set?s(r.set,e):p),Object.defineProperty(e,n,Qr)}}function R(e,t){var n=new Jr(t,e,p,{lazy:!0});return function(){return n.dirty&&n.evaluate(),Rr.target&&n.depend(),n.value}}function I(e){var t=e.$options.methods;if(t)for(var n in t)null!=t[n]&&(e[n]=s(t[n],e))}function F(e){var t=e.$options.watch;if(t)for(var n in t){var r=t[n];if(Array.isArray(r))for(var i=0;i<r.length;i++)B(e,n,r[i]);else B(e,n,r)}}function B(e,t,n){var r;f(n)&&(r=n,n=n.handler),"string"==typeof n&&(n=e[n]),e.$watch(t,n,r)}function H(e){var t={};t.get=function(){return this._data},Object.defineProperty(e.prototype,"$data",t),e.prototype.$set=j,e.prototype.$delete=L,e.prototype.$watch=function(e,t,n){var r=this;n=n||{},n.user=!0;var i=new Jr(r,e,t,n);return n.immediate&&t.call(r,i.value),function(){i.teardown()}}}function U(e,t){g(t)||Object.defineProperty(e,t,{configurable:!0,enumerable:!0,get:function(){return e._data[t]},set:function(n){e._data[t]=n}})}function z(e){var t=new Xr(e.tag,e.data,e.children,e.text,e.elm,e.ns,e.context,e.componentOptions);return t.isStatic=e.isStatic,t.key=e.key,t.isCloned=!0,t}function V(e){for(var t=new Array(e.length),n=0;n<e.length;n++)t[n]=z(e[n]);return t}function J(e,t,n){if(o(e))return[q(e)];if(Array.isArray(e)){for(var r=[],i=0,a=e.length;i<a;i++){var s=e[i],c=r[r.length-1];Array.isArray(s)?r.push.apply(r,J(s,t,i)):o(s)?c&&c.text?c.text+=String(s):""!==s&&r.push(q(s)):s instanceof Xr&&(s.text&&c&&c.text?c.text+=s.text:(t&&K(s,t),s.tag&&null==s.key&&null!=n&&(s.key="__vlist_"+n+"_"+i+"__"),r.push(s)))}return r}}function q(e){return new Xr(void 0,void 0,void 0,String(e))}function K(e,t){if(e.tag&&!e.ns&&(e.ns=t,e.children))for(var n=0,r=e.children.length;n<r;n++)K(e.children[n],t)}function W(e){return e&&e.filter(function(e){return e&&e.componentOptions})[0]}function Z(e,t,n){var r=e[t];if(r){var i=e.__injected||(e.__injected={});i[t]||(i[t]=!0,e[t]=function(){r.apply(this,arguments),n.apply(this,arguments)})}else e[t]=n}function G(e,t,n,r){var i,o,a,s,c,u;for(i in e)if(o=e[i],a=t[i],o)if(a){if(o!==a)if(Array.isArray(a)){a.length=o.length;for(var l=0;l<a.length;l++)a[l]=o[l];e[i]=a}else a.fn=o,e[i]=a}else u="!"===i.charAt(0),c=u?i.slice(1):i,Array.isArray(o)?n(c,o.invoker=Y(o),u):(o.invoker||(s=o,o=e[i]={},o.fn=s,o.invoker=Q(o)),n(c,o.invoker,u));else;for(i in t)e[i]||(c="!"===i.charAt(0)?i.slice(1):i,r(c,t[i].invoker))}function Y(e){return function(t){for(var n=arguments,r=1===arguments.length,i=0;i<e.length;i++)r?e[i](t):e[i].apply(null,n)}}function Q(e){return function(t){var n=1===arguments.length;n?e.fn(t):e.fn.apply(null,arguments)}}function X(e){var t=e.$options,n=t.parent;if(n&&!t.abstract){for(;n.$options.abstract&&n.$parent;)n=n.$parent;n.$children.push(e)}e.$parent=n,e.$root=n?n.$root:e,e.$children=[],e.$refs={},e._watcher=null,e._inactive=!1,e._isMounted=!1,e._isDestroyed=!1,e._isBeingDestroyed=!1}function ee(e){e.prototype._mount=function(e,t){var n=this;return n.$el=e,n.$options.render||(n.$options.render=ei),te(n,"beforeMount"),n._watcher=new Jr(n,function(){n._update(n._render(),t)},p),t=!1,n.$root===n&&(n._isMounted=!0,te(n,"mounted")),n},e.prototype._update=function(e,t){var n=this;n._isMounted&&te(n,"beforeUpdate");var r=n.$el,i=ti;ti=n;var o=n._vnode;n._vnode=e,o?n.$el=n.__patch__(o,e):n.$el=n.__patch__(n.$el,e,t),ti=i,r&&(r.__vue__=null),n.$el&&(n.$el.__vue__=n),n.$vnode&&n.$parent&&n.$vnode===n.$parent._vnode&&(n.$parent.$el=n.$el),n._isMounted&&te(n,"updated")},e.prototype._updateFromParent=function(e,t,n,r){var i=this,o=!(!i.$options._renderChildren&&!r);if(i.$options._parentVnode=n,i.$options._renderChildren=r,e&&i.$options.props){Gr.shouldConvert=!1;for(var a=i.$options._propKeys||[],s=0;s<a.length;s++){var c=a[s];i[c]=je(c,i.$options.props,e,i)}Gr.shouldConvert=!0}if(t){var u=i.$options._parentListeners;i.$options._parentListeners=t,i._updateListeners(t,u)}o&&(i.$slots=ye(r,i._renderContext),i.$forceUpdate())},e.prototype.$forceUpdate=function(){var e=this;e._watcher&&e._watcher.update()},e.prototype.$destroy=function(){var e=this;if(!e._isBeingDestroyed){te(e,"beforeDestroy"),e._isBeingDestroyed=!0;var t=e.$parent;!t||t._isBeingDestroyed||e.$options.abstract||r(t.$children,e),e._watcher&&e._watcher.teardown();for(var n=e._watchers.length;n--;)e._watchers[n].teardown();e._data.__ob__&&e._data.__ob__.vmCount--,e._isDestroyed=!0,te(e,"destroyed"),e.$off(),e.$el&&(e.$el.__vue__=null)}}}function te(e,t){var n=e.$options[t];if(n)for(var r=0,i=n.length;r<i;r++)n[r].call(e);e.$emit("hook:"+t)}function ne(e,t,n,r,i){if(e&&(l(e)&&(e=we.extend(e)),"function"==typeof e)){if(!e.cid)if(e.resolved)e=e.resolved;else if(e=ue(e,function(){n.$forceUpdate()}),!e)return;t=t||{};var o=le(t,e);if(e.options.functional)return re(e,o,t,n,r);var a=t.on;t.on=t.nativeOn,e.options.abstract&&(t={}),de(t);var s=e.options.name||i,c=new Xr("vue-component-"+e.cid+(s?"-"+s:""),t,void 0,void 0,void 0,void 0,n,{Ctor:e,propsData:o,listeners:a,tag:i,children:r});return c}}function re(e,t,n,r,i){var o={},a=e.options.props;if(a)for(var c in a)o[c]=je(c,a,t);return e.options.render.call(null,s(ve,{_self:Object.create(r)}),{props:o,data:n,parent:r,children:J(i),slots:function(){return ye(i,r)}})}function ie(e,t){var n=e.componentOptions,r={_isComponent:!0,parent:t,propsData:n.propsData,_componentTag:n.tag,_parentVnode:e,_parentListeners:n.listeners,_renderChildren:n.children},i=e.data.inlineTemplate;return i&&(r.render=i.render,r.staticRenderFns=i.staticRenderFns),new n.Ctor(r)}function oe(e,t){if(!e.child||e.child._isDestroyed){var n=e.child=ie(e,ti);n.$mount(t?e.elm:void 0,t)}}function ae(e,t){var n=t.componentOptions,r=t.child=e.child;r._updateFromParent(n.propsData,n.listeners,t,n.children)}function se(e){e.child._isMounted||(e.child._isMounted=!0,te(e.child,"mounted")),e.data.keepAlive&&(e.child._inactive=!1,te(e.child,"activated"))}function ce(e){e.child._isDestroyed||(e.data.keepAlive?(e.child._inactive=!0,te(e.child,"deactivated")):e.child.$destroy())}function ue(e,t){if(!e.requested){e.requested=!0;var n=e.pendingCallbacks=[t],r=!0,i=function(t){if(l(t)&&(t=we.extend(t)),e.resolved=t,!r)for(var i=0,o=n.length;i<o;i++)n[i](t)},o=function(e){},a=e(i,o);return a&&"function"==typeof a.then&&!e.resolved&&a.then(i,o),r=!1,e.resolved}e.pendingCallbacks.push(t)}function le(e,t){var n=t.options.props;if(n){var r={},i=e.attrs,o=e.props,a=e.domProps;if(i||o||a)for(var s in n){var c=br(s);fe(r,o,s,c,!0)||fe(r,i,s,c)||fe(r,a,s,c)}return r}}function fe(e,t,n,r,o){if(t){if(i(t,n))return e[n]=t[n],o||delete t[n],!0;if(i(t,r))return e[n]=t[r],o||delete t[r],!0}return!1}function de(e){e.hook||(e.hook={});for(var t=0;t<ri.length;t++){var n=ri[t],r=e.hook[n],i=ni[n];e.hook[n]=r?pe(i,r):i}}function pe(e,t){return function(n,r){e(n,r),t(n,r)}}function ve(e,t,n){return t&&(Array.isArray(t)||"object"!=typeof t)&&(n=t,t=void 0),he(this._self,e,t,n)}function he(e,t,n,r){if(!n||!n.__ob__){if(!t)return ei();if("string"==typeof t){var i,o=xr.getTagNamespace(t);return xr.isReservedTag(t)?new Xr(t,n,J(r,o),void 0,void 0,o,e):(i=Ee(e.$options,"components",t))?ne(i,n,e,r,t):new Xr(t,n,J(r,o),void 0,void 0,o,e)}return ne(t,n,e,r)}}function me(e){e.$vnode=null,e._vnode=null,e._staticTrees=null,e._renderContext=e.$options._parentVnode&&e.$options._parentVnode.context,e.$slots=ye(e.$options._renderChildren,e._renderContext),e.$createElement=s(ve,e),e.$options.el&&e.$mount(e.$options.el)}function ge(n){n.prototype.$nextTick=function(e){Mr(e,this)},n.prototype._render=function(){var e=this,t=e.$options,n=t.render,r=t.staticRenderFns,i=t._parentVnode;if(e._isMounted)for(var o in e.$slots)e.$slots[o]=V(e.$slots[o]);r&&!e._staticTrees&&(e._staticTrees=[]),e.$vnode=i;var a;try{a=n.call(e._renderProxy,e.$createElement)}catch(t){if(xr.errorHandler)xr.errorHandler.call(null,t,e);else{if(xr._isServer)throw t;setTimeout(function(){throw t},0)}a=e._vnode}return a instanceof Xr||(a=ei()),a.parent=i,a},n.prototype._h=ve,n.prototype._s=e,n.prototype._n=t,n.prototype._e=ei,n.prototype._q=h,n.prototype._i=m,n.prototype._m=function(e,t){var n=this._staticTrees[e];if(n&&!t)return Array.isArray(n)?V(n):z(n);if(n=this._staticTrees[e]=this.$options.staticRenderFns[e].call(this._renderProxy),Array.isArray(n))for(var r=0;r<n.length;r++)n[r].isStatic=!0,n[r].key="__static__"+e+"_"+r;else n.isStatic=!0,n.key="__static__"+e;return n};var r=function(e){return e};n.prototype._f=function(e){return Ee(this.$options,"filters",e,!0)||r},n.prototype._l=function(e,t){var n,r,i,o,a;if(Array.isArray(e))for(n=new Array(e.length),r=0,i=e.length;r<i;r++)n[r]=t(e[r],r);else if("number"==typeof e)for(n=new Array(e),r=0;r<e;r++)n[r]=t(r+1,r);else if(l(e))for(o=Object.keys(e),n=new Array(o.length),r=0,i=o.length;r<i;r++)a=o[r],n[r]=t(e[a],a,r);return n},n.prototype._t=function(e,t){var n=this.$slots[e];return n||t},n.prototype._b=function(e,t,n){if(t)if(l(t)){Array.isArray(t)&&(t=d(t));for(var r in t)if("class"===r||"style"===r)e[r]=t[r];else{var i=n||xr.mustUseProp(r)?e.domProps||(e.domProps={}):e.attrs||(e.attrs={});i[r]=t[r]}}else;return e},n.prototype._k=function(e){return xr.keyCodes[e]}}function ye(e,t){var n={};if(!e)return n;for(var r,i,o=J(e)||[],a=[],s=0,c=o.length;s<c;s++)if(i=o[s],i.context===t&&i.data&&(r=i.data.slot)){var u=n[r]||(n[r]=[]);"template"===i.tag?u.push.apply(u,i.children):u.push(i)}else a.push(i);return a.length&&(1!==a.length||" "!==a[0].text&&!a[0].isComment)&&(n.default=a),n}function _e(e){e._events=Object.create(null);var t=e.$options._parentListeners,n=s(e.$on,e),r=s(e.$off,e);e._updateListeners=function(e,t){G(e,t||{},n,r)},t&&e._updateListeners(t)}function be(e){e.prototype.$on=function(e,t){var n=this;return(n._events[e]||(n._events[e]=[])).push(t),n},e.prototype.$once=function(e,t){function n(){r.$off(e,n),t.apply(r,arguments)}var r=this;return n.fn=t,r.$on(e,n),r},e.prototype.$off=function(e,t){var n=this;if(!arguments.length)return n._events=Object.create(null),n;var r=n._events[e];if(!r)return n;if(1===arguments.length)return n._events[e]=null,n;for(var i,o=r.length;o--;)if(i=r[o],i===t||i.fn===t){r.splice(o,1);break}return n},e.prototype.$emit=function(e){var t=this,n=t._events[e];if(n){n=n.length>1?c(n):n;for(var r=c(arguments,1),i=0,o=n.length;i<o;i++)n[i].apply(t,r)}return t}}function $e(e){function t(e,t){var r=e.$options=Object.create(n(e));r.parent=t.parent,r.propsData=t.propsData,r._parentVnode=t._parentVnode,r._parentListeners=t._parentListeners,r._renderChildren=t._renderChildren,r._componentTag=t._componentTag,t.render&&(r.render=t.render,r.staticRenderFns=t.staticRenderFns)}function n(e){var t=e.constructor,n=t.options;if(t.super){var r=t.super.options,i=t.superOptions;r!==i&&(t.superOptions=r,n=t.options=Se(r,t.extendOptions),n.name&&(n.components[n.name]=t))}return n}e.prototype._init=function(e){var r=this;r._uid=ii++,r._isVue=!0,e&&e._isComponent?t(r,e):r.$options=Se(n(r),e||{},r),r._renderProxy=r,r._self=r,X(r),_e(r),te(r,"beforeCreate"),D(r),te(r,"created"),me(r)}}function we(e){this._init(e)}function Ce(e,t){var n,r,o;for(n in t)r=e[n],o=t[n],i(e,n)?l(r)&&l(o)&&Ce(r,o):j(e,n,o);return e}function xe(e,t){return t?e?e.concat(t):Array.isArray(t)?t:[t]:e}function ke(e,t){var n=Object.create(e||null);return t?u(n,t):n}function Ae(e){if(e.components){var t,n=e.components;for(var r in n){var i=r.toLowerCase();vr(i)||xr.isReservedTag(i)||(t=n[r],f(t)&&(n[r]=we.extend(t)))}}}function Oe(e){var t=e.props;if(t){var n,r,i,o={};if(Array.isArray(t))for(n=t.length;n--;)r=t[n],"string"==typeof r&&(i=gr(r),o[i]={type:null});else if(f(t))for(var a in t)r=t[a],i=gr(a),o[i]=f(r)?r:{type:r};e.props=o}}function Te(e){var t=e.directives;if(t)for(var n in t){var r=t[n];"function"==typeof r&&(t[n]={bind:r,update:r})}}function Se(e,t,n){function r(r){var i=si[r]||ci;l[r]=i(e[r],t[r],n,r)}Ae(t),Oe(t),Te(t);var o=t.extends;if(o&&(e="function"==typeof o?Se(e,o.options,n):Se(e,o,n)),t.mixins)for(var a=0,s=t.mixins.length;a<s;a++){var c=t.mixins[a];c.prototype instanceof we&&(c=c.options),e=Se(e,c,n)}var u,l={};for(u in e)r(u);for(u in t)i(e,u)||r(u);return l}function Ee(e,t,n,r){if("string"==typeof n){var i=e[t],o=i[n]||i[gr(n)]||i[yr(gr(n))];return o}}function je(e,t,n,r){var o=t[e],a=!i(n,e),s=n[e];if("Boolean"===De(o.type)&&(a&&!i(o,"default")?s=!1:""!==s&&s!==br(e)||(s=!0)),void 0===s){s=Le(r,o,e);var c=Gr.shouldConvert;Gr.shouldConvert=!0,S(s),Gr.shouldConvert=c}return s}function Le(e,t,n){if(i(t,"default")){var r=t.default;return l(r),"function"==typeof r&&t.type!==Function?r.call(e):r}}function De(e){var t=e&&e.toString().match(/^\s*function (\w+)/);return t&&t[1]}function Ne(e){e.use=function(e){if(!e.installed){var t=c(arguments,1);return t.unshift(this),"function"==typeof e.install?e.install.apply(e,t):e.apply(null,t),e.installed=!0,this}}}function Me(e){e.mixin=function(t){e.options=Se(e.options,t)}}function Pe(e){e.cid=0;var t=1;e.extend=function(e){e=e||{};var n=this,r=0===n.cid;if(r&&e._Ctor)return e._Ctor;var i=e.name||n.options.name,o=function(e){this._init(e)};return o.prototype=Object.create(n.prototype),o.prototype.constructor=o,o.cid=t++,o.options=Se(n.options,e),o.super=n,o.extend=n.extend,xr._assetTypes.forEach(function(e){o[e]=n[e]}),i&&(o.options.components[i]=o),o.superOptions=n.options,o.extendOptions=e,r&&(e._Ctor=o),o}}function Re(e){xr._assetTypes.forEach(function(t){e[t]=function(n,r){return r?("component"===t&&f(r)&&(r.name=r.name||n,r=e.extend(r)),"directive"===t&&"function"==typeof r&&(r={bind:r,update:r}),this.options[t+"s"][n]=r,r):this.options[t+"s"][n]}})}function Ie(e){var t={};t.get=function(){return xr},Object.defineProperty(e,"config",t),e.util=ui,e.set=j,e.delete=L,e.nextTick=Mr,e.options=Object.create(null),xr._assetTypes.forEach(function(t){e.options[t+"s"]=Object.create(null)}),u(e.options.components,fi),Ne(e),Me(e),Pe(e),Re(e)}function Fe(e){for(var t=e.data,n=e,r=e;r.child;)r=r.child._vnode,r.data&&(t=Be(r.data,t));for(;n=n.parent;)n.data&&(t=Be(t,n.data));return He(t)}function Be(e,t){return{staticClass:Ue(e.staticClass,t.staticClass),class:e.class?[e.class,t.class]:t.class}}function He(e){var t=e.class,n=e.staticClass;return n||t?Ue(n,ze(t)):""}function Ue(e,t){return e?t?e+" "+t:e:t||""}function ze(e){var t="";if(!e)return t;if("string"==typeof e)return e;if(Array.isArray(e)){for(var n,r=0,i=e.length;r<i;r++)e[r]&&(n=ze(e[r]))&&(t+=n+" ");return t.slice(0,-1)}if(l(e)){for(var o in e)e[o]&&(t+=o+" ");return t.slice(0,-1)}return t}function Ve(e){return ki(e)?"svg":"math"===e?"math":void 0}function Je(e){if(!Or)return!0;if(Oi(e))return!1;if(e=e.toLowerCase(),null!=Ti[e])return Ti[e];var t=document.createElement(e);return e.indexOf("-")>-1?Ti[e]=t.constructor===window.HTMLUnknownElement||t.constructor===window.HTMLElement:Ti[e]=/HTMLUnknownElement/.test(t.toString())}function qe(e){if("string"==typeof e){if(e=document.querySelector(e),!e)return document.createElement("div")}return e}function Ke(e){return document.createElement(e)}function We(e,t){return document.createElementNS(bi[e],t)}function Ze(e){return document.createTextNode(e)}function Ge(e){return document.createComment(e)}function Ye(e,t,n){e.insertBefore(t,n)}function Qe(e,t){e.removeChild(t)}function Xe(e,t){e.appendChild(t)}function et(e){return e.parentNode}function tt(e){return e.nextSibling}function nt(e){return e.tagName}function rt(e,t){e.textContent=t}function it(e){return e.childNodes}function ot(e,t,n){e.setAttribute(t,n)}function at(e,t){var n=e.data.ref;if(n){var i=e.context,o=e.child||e.elm,a=i.$refs;t?Array.isArray(a[n])?r(a[n],o):a[n]===o&&(a[n]=void 0):e.data.refInFor?Array.isArray(a[n])?a[n].push(o):a[n]=[o]:a[n]=o}}function st(e){return null==e}function ct(e){return null!=e}function ut(e,t){return e.key===t.key&&e.tag===t.tag&&e.isComment===t.isComment&&!e.data==!t.data}function lt(e,t,n){var r,i,o={};for(r=t;r<=n;++r)i=e[r].key,ct(i)&&(o[i]=r);return o}function ft(e){function t(e){return new Xr(C.tagName(e).toLowerCase(),{},[],void 0,e)}function n(e,t){function n(){0===--n.listeners&&r(e)}return n.listeners=t,n}function r(e){var t=C.parentNode(e);C.removeChild(t,e)}function i(e,t,n){var r,i=e.data;if(e.isRootInsert=!n,ct(i)&&(ct(r=i.hook)&&ct(r=r.init)&&r(e),ct(r=e.child)))return u(e,t),e.elm;var o=e.children,s=e.tag;return ct(s)?(e.elm=e.ns?C.createElementNS(e.ns,s):C.createElement(s),l(e),a(e,o,t),ct(i)&&c(e,t)):e.isComment?e.elm=C.createComment(e.text):e.elm=C.createTextNode(e.text),e.elm}function a(e,t,n){if(Array.isArray(t))for(var r=0;r<t.length;++r)C.appendChild(e.elm,i(t[r],n,!0));else o(e.text)&&C.appendChild(e.elm,C.createTextNode(e.text))}function s(e){for(;e.child;)e=e.child._vnode;return ct(e.tag)}function c(e,t){for(var n=0;n<$.create.length;++n)$.create[n](Li,e);_=e.data.hook,ct(_)&&(_.create&&_.create(Li,e),_.insert&&t.push(e))}function u(e,t){e.data.pendingInsert&&t.push.apply(t,e.data.pendingInsert),e.elm=e.child.$el,s(e)?(c(e,t),l(e)):(at(e),t.push(e))}function l(e){var t;ct(t=e.context)&&ct(t=t.$options._scopeId)&&C.setAttribute(e.elm,t,""),ct(t=ti)&&t!==e.context&&ct(t=t.$options._scopeId)&&C.setAttribute(e.elm,t,"")}function f(e,t,n,r,o,a){for(;r<=o;++r)C.insertBefore(e,i(n[r],a),t)}function d(e){var t,n,r=e.data;if(ct(r))for(ct(t=r.hook)&&ct(t=t.destroy)&&t(e),t=0;t<$.destroy.length;++t)$.destroy[t](e);if(ct(t=e.child)&&!r.keepAlive&&d(t._vnode),ct(t=e.children))for(n=0;n<e.children.length;++n)d(e.children[n])}function p(e,t,n,r){for(;n<=r;++n){var i=t[n];ct(i)&&(ct(i.tag)?(v(i),d(i)):C.removeChild(e,i.elm))}}function v(e,t){if(t||ct(e.data)){var i=$.remove.length+1;for(t?t.listeners+=i:t=n(e.elm,i),ct(_=e.child)&&ct(_=_._vnode)&&ct(_.data)&&v(_,t),_=0;_<$.remove.length;++_)$.remove[_](e,t);ct(_=e.data.hook)&&ct(_=_.remove)?_(e,t):t()}else r(e.elm)}function h(e,t,n,r,o){for(var a,s,c,u,l=0,d=0,v=t.length-1,h=t[0],g=t[v],y=n.length-1,_=n[0],b=n[y],$=!o;l<=v&&d<=y;)st(h)?h=t[++l]:st(g)?g=t[--v]:ut(h,_)?(m(h,_,r),h=t[++l],_=n[++d]):ut(g,b)?(m(g,b,r),g=t[--v],b=n[--y]):ut(h,b)?(m(h,b,r),$&&C.insertBefore(e,h.elm,C.nextSibling(g.elm)),h=t[++l],b=n[--y]):ut(g,_)?(m(g,_,r),$&&C.insertBefore(e,g.elm,h.elm),g=t[--v],_=n[++d]):(st(a)&&(a=lt(t,l,v)),s=ct(_.key)?a[_.key]:null,st(s)?(C.insertBefore(e,i(_,r),h.elm),_=n[++d]):(c=t[s],c.tag!==_.tag?(C.insertBefore(e,i(_,r),h.elm),_=n[++d]):(m(c,_,r),t[s]=void 0,$&&C.insertBefore(e,_.elm,h.elm),_=n[++d])));l>v?(u=st(n[y+1])?null:n[y+1].elm,f(e,u,n,d,y,r)):d>y&&p(e,t,l,v)}function m(e,t,n,r){if(e!==t){if(t.isStatic&&e.isStatic&&t.key===e.key&&t.isCloned)return void(t.elm=e.elm);var i,o,a=ct(i=t.data);a&&ct(o=i.hook)&&ct(i=o.prepatch)&&i(e,t);var c=t.elm=e.elm,u=e.children,l=t.children;if(a&&s(t)){for(i=0;i<$.update.length;++i)$.update[i](e,t);ct(o)&&ct(i=o.update)&&i(e,t)}if(st(t.text)?ct(u)&&ct(l)?u!==l&&h(c,u,l,n,r):ct(l)?(ct(e.text)&&C.setTextContent(c,""),f(c,null,l,0,l.length-1,n)):ct(u)?p(c,u,0,u.length-1):ct(e.text)&&C.setTextContent(c,""):e.text!==t.text&&C.setTextContent(c,t.text),a){for(i=0;i<$.postpatch.length;++i)$.postpatch[i](e,t);ct(o)&&ct(i=o.postpatch)&&i(e,t)}}}function g(e,t,n){if(n&&e.parent)e.parent.data.pendingInsert=t;else for(var r=0;r<t.length;++r)t[r].data.hook.insert(t[r])}function y(e,t,n){t.elm=e;var r=t.tag,i=t.data,o=t.children;if(ct(i)&&(ct(_=i.hook)&&ct(_=_.init)&&_(t,!0),ct(_=t.child)))return u(t,n),!0;if(ct(r)){if(ct(o)){var s=C.childNodes(e);if(s.length){var l=!0;if(s.length!==o.length)l=!1;else for(var f=0;f<o.length;f++)if(!y(s[f],o[f],n)){l=!1;break}if(!l)return!1}else a(t,o,n)}ct(i)&&c(t,n)}return!0}var _,b,$={},w=e.modules,C=e.nodeOps;for(_=0;_<Di.length;++_)for($[Di[_]]=[],b=0;b<w.length;++b)void 0!==w[b][Di[_]]&&$[Di[_]].push(w[b][Di[_]]);return function(e,n,r,o){var a,c,u=!1,l=[];if(e){var f=ct(e.nodeType);if(!f&&ut(e,n))m(e,n,l,o);else{if(f){if(1===e.nodeType&&e.hasAttribute("server-rendered")&&(e.removeAttribute("server-rendered"),r=!0),r&&y(e,n,l))return g(n,l,!0),e;e=t(e)}if(a=e.elm,c=C.parentNode(a),i(n,l),n.parent&&(n.parent.elm=n.elm,s(n)))for(var v=0;v<$.create.length;++v)$.create[v](Li,n.parent);null!==c?(C.insertBefore(c,n.elm,C.nextSibling(a)),p(c,[e],0,0)):ct(e.tag)&&d(e)}}else u=!0,i(n,l);return g(n,l,u),n.elm}}function dt(e,t,n){var r=t.data.directives;if(r)for(var i=0;i<r.length;i++){var o=r[i],a=Ee(t.context.$options,"directives",o.name,!0);if(a){var s=e&&e.data.directives;s&&(o.oldValue=s[i].value),o.modifiers||(o.modifiers=Mi),n(a,o)}}}function pt(e,t,n){dt(e,t,function(r,i){vt(r,i,n,t,e)})}function vt(e,t,n,r,i){var o=e&&e[n];o&&o(r.elm,t,r,i)}function ht(e,t){if(e.data.attrs||t.data.attrs){var n,r,i,o=t.elm,a=e.data.attrs||{},s=t.data.attrs||{};s.__ob__&&(s=t.data.attrs=u({},s));for(n in s)r=s[n],i=a[n],i!==r&&mt(o,n,r);for(n in a)null==s[n]&&(gi(n)?o.removeAttributeNS(mi,yi(n)):vi(n)||o.removeAttribute(n))}}function mt(e,t,n){hi(t)?_i(n)?e.removeAttribute(t):e.setAttribute(t,t):vi(t)?e.setAttribute(t,_i(n)||"false"===n?"false":"true"):gi(t)?_i(n)?e.removeAttributeNS(mi,yi(t)):e.setAttributeNS(mi,t,n):_i(n)?e.removeAttribute(t):e.setAttribute(t,n)}function gt(e,t){var n=t.elm,r=t.data,i=e.data;if(r.staticClass||r.class||i&&(i.staticClass||i.class)){var o=Fe(t),a=n._transitionClasses;a&&(o=Ue(o,ze(a))),o!==n._prevClass&&(n.setAttribute("class",o),n._prevClass=o)}}function yt(e,t){if(e.data.on||t.data.on){var n=t.data.on||{},r=e.data.on||{},i=t.elm._v_add||(t.elm._v_add=function(e,n,r){t.elm.addEventListener(e,n,r)}),o=t.elm._v_remove||(t.elm._v_remove=function(e,n){t.elm.removeEventListener(e,n)});G(n,r,i,o)}}function _t(e,t){if(e.data.domProps||t.data.domProps){var n,r,i=t.elm,o=e.data.domProps||{},a=t.data.domProps||{};a.__ob__&&(a=t.data.domProps=u({},a));for(n in o)null==a[n]&&(i[n]=void 0);for(n in a)if("textContent"!==n&&"innerHTML"!==n||!t.children||(t.children.length=0),r=a[n],"value"===n){i._value=r;var s=null==r?"":String(r);i.value!==s&&(i.value=s)}else i[n]=r}}function bt(e,t){if(e.data&&e.data.style||t.data.style){var n,r,i=t.elm,o=e.data.style||{},a=t.data.style||{};if("string"==typeof a)return void(i.style.cssText=a);var s=a.__ob__;Array.isArray(a)&&(a=t.data.style=d(a)),s&&(a=t.data.style=u({},a));for(r in o)a[r]||(i.style[Ui(r)]="");for(r in a)n=a[r],n!==o[r]&&(i.style[Ui(r)]=null==n?"":n)}}function $t(e,t){if(e.classList)t.indexOf(" ")>-1?t.split(/\s+/).forEach(function(t){return e.classList.add(t)}):e.classList.add(t);else{var n=" "+e.getAttribute("class")+" ";n.indexOf(" "+t+" ")<0&&e.setAttribute("class",(n+t).trim())}}function wt(e,t){if(e.classList)t.indexOf(" ")>-1?t.split(/\s+/).forEach(function(t){return e.classList.remove(t)}):e.classList.remove(t);else{for(var n=" "+e.getAttribute("class")+" ",r=" "+t+" ";n.indexOf(r)>=0;)n=n.replace(r," ");e.setAttribute("class",n.trim())}}function Ct(e){Yi(function(){Yi(e)})}function xt(e,t){(e._transitionClasses||(e._transitionClasses=[])).push(t),$t(e,t)}function kt(e,t){e._transitionClasses&&r(e._transitionClasses,t),wt(e,t)}function At(e,t,n){var r=Ot(e,t),i=r.type,o=r.timeout,a=r.propCount;if(!i)return n();var s=i===Ji?Wi:Gi,c=0,u=function(){e.removeEventListener(s,l),n()},l=function(t){t.target===e&&++c>=a&&u()};setTimeout(function(){c<a&&u()},o+1),e.addEventListener(s,l)}function Ot(e,t){var n,r=window.getComputedStyle(e),i=r[Ki+"Delay"].split(", "),o=r[Ki+"Duration"].split(", "),a=Tt(i,o),s=r[Zi+"Delay"].split(", "),c=r[Zi+"Duration"].split(", "),u=Tt(s,c),l=0,f=0;t===Ji?a>0&&(n=Ji,l=a,f=o.length):t===qi?u>0&&(n=qi,l=u,f=c.length):(l=Math.max(a,u),n=l>0?a>u?Ji:qi:null,f=n?n===Ji?o.length:c.length:0);var d=n===Ji&&Qi.test(r[Ki+"Property"]);return{type:n,timeout:l,propCount:f,hasTransform:d}}function Tt(e,t){return Math.max.apply(null,t.map(function(t,n){return St(t)+St(e[n])}))}function St(e){return 1e3*Number(e.slice(0,-1))}function Et(e){var t=e.elm;t._leaveCb&&(t._leaveCb.cancelled=!0,t._leaveCb());var n=Lt(e.data.transition);if(n&&!t._enterCb&&1===t.nodeType){var r=n.css,i=n.type,o=n.enterClass,a=n.enterActiveClass,s=n.appearClass,c=n.appearActiveClass,u=n.beforeEnter,l=n.enter,f=n.afterEnter,d=n.enterCancelled,p=n.beforeAppear,v=n.appear,h=n.afterAppear,m=n.appearCancelled,g=ti.$vnode,y=g&&g.parent?g.parent.context:ti,_=!y._isMounted||!e.isRootInsert;if(!_||v||""===v){var b=_?s:o,$=_?c:a,w=_?p||u:u,C=_&&"function"==typeof v?v:l,x=_?h||f:f,k=_?m||d:d,A=r!==!1&&!Er,O=C&&(C._length||C.length)>1,T=t._enterCb=Dt(function(){A&&kt(t,$),T.cancelled?(A&&kt(t,b),k&&k(t)):x&&x(t),t._enterCb=null});e.data.show||Z(e.data.hook||(e.data.hook={}),"insert",function(){var n=t.parentNode,r=n&&n._pending&&n._pending[e.key];r&&r.tag===e.tag&&r.elm._leaveCb&&r.elm._leaveCb(),C&&C(t,T)}),w&&w(t),A&&(xt(t,b),xt(t,$),Ct(function(){kt(t,b),T.cancelled||O||At(t,i,T)})),e.data.show&&C&&C(t,T),A||O||T()}}}function jt(e,t){function n(){m.cancelled||(e.data.show||((r.parentNode._pending||(r.parentNode._pending={}))[e.key]=e),u&&u(r),v&&(xt(r,s),xt(r,c),Ct(function(){kt(r,s),m.cancelled||h||At(r,a,m)})),l&&l(r,m),v||h||m())}var r=e.elm;r._enterCb&&(r._enterCb.cancelled=!0,r._enterCb());var i=Lt(e.data.transition);if(!i)return t();if(!r._leaveCb&&1===r.nodeType){var o=i.css,a=i.type,s=i.leaveClass,c=i.leaveActiveClass,u=i.beforeLeave,l=i.leave,f=i.afterLeave,d=i.leaveCancelled,p=i.delayLeave,v=o!==!1&&!Er,h=l&&(l._length||l.length)>1,m=r._leaveCb=Dt(function(){r.parentNode&&r.parentNode._pending&&(r.parentNode._pending[e.key]=null),v&&kt(r,c),m.cancelled?(v&&kt(r,s),d&&d(r)):(t(),f&&f(r)),r._leaveCb=null});p?p(n):n()}}function Lt(e){if(e){if("object"==typeof e){var t={};return e.css!==!1&&u(t,Xi(e.name||"v")),u(t,e),t}return"string"==typeof e?Xi(e):void 0}}function Dt(e){var t=!1;return function(){t||(t=!0,e())}}function Nt(e,t,n){var r=t.value,i=e.multiple;if(!i||Array.isArray(r)){for(var o,a,s=0,c=e.options.length;s<c;s++)if(a=e.options[s],i)o=m(r,Pt(a))>-1,a.selected!==o&&(a.selected=o);else if(h(Pt(a),r))return void(e.selectedIndex!==s&&(e.selectedIndex=s));i||(e.selectedIndex=-1)}}function Mt(e,t){for(var n=0,r=t.length;n<r;n++)if(h(Pt(t[n]),e))return!1;return!0}function Pt(e){return"_value"in e?e._value:e.value}function Rt(e){e.target.composing=!0}function It(e){e.target.composing=!1,Ft(e.target,"input")}function Ft(e,t){var n=document.createEvent("HTMLEvents");n.initEvent(t,!0,!0),e.dispatchEvent(n)}function Bt(e){return!e.child||e.data&&e.data.transition?e:Bt(e.child._vnode)}function Ht(e){var t=e&&e.componentOptions;return t&&t.Ctor.options.abstract?Ht(W(t.children)):e}function Ut(e){var t={},n=e.$options;for(var r in n.propsData)t[r]=e[r];var i=n._parentListeners;for(var o in i)t[gr(o)]=i[o].fn;return t}function zt(e,t){return/\d-keep-alive$/.test(t.tag)?e("keep-alive"):null}function Vt(e){for(;e=e.parent;)if(e.data.transition)return!0}function Jt(e){e.elm._moveCb&&e.elm._moveCb(),e.elm._enterCb&&e.elm._enterCb()}function qt(e){e.data.newPos=e.elm.getBoundingClientRect()}function Kt(e){var t=e.data.pos,n=e.data.newPos,r=t.left-n.left,i=t.top-n.top;if(r||i){e.data.moved=!0;var o=e.elm.style;o.transform=o.WebkitTransform="translate("+r+"px,"+i+"px)",o.transitionDuration="0s"}}function Wt(e,t){var n=document.createElement("div");return n.innerHTML='<div a="'+e+'">',n.innerHTML.indexOf(t)>0}function Zt(e){return ho.innerHTML=e,ho.textContent}function Gt(e,t,n){return t&&(e=e.replace(qo,"<").replace(Ko,">")),n&&(e=e.replace(Wo,"\n")),e.replace(Zo,"&").replace(Go,'"')}function Yt(e,t){function n(t){d+=t,e=e.substring(t)}function r(){var t=e.match(wo);if(t){var r={tagName:t[1],attrs:[],start:d};n(t[0].length);for(var i,o;!(i=e.match(Co))&&(o=e.match(_o));)n(o[0].length),r.attrs.push(o);if(i)return r.unarySlash=i[1],n(i[0].length),r.end=d,r}}function i(e){var n=e.tagName,r=e.unarySlash;u&&("p"===s&&xi(n)&&o("",s),Ci(n)&&s===n&&o("",n));for(var i=l(n)||"html"===n&&"head"===s||!!r,a=e.attrs.length,d=new Array(a),p=0;p<a;p++){var v=e.attrs[p];Ao&&v[0].indexOf('""')===-1&&(""===v[3]&&delete v[3],
""===v[4]&&delete v[4],""===v[5]&&delete v[5]);var h=v[3]||v[4]||v[5]||"";d[p]={name:v[1],value:f?Gt(h,t.shouldDecodeTags,t.shouldDecodeNewlines):h}}i||(c.push({tag:n,attrs:d}),s=n,r=""),t.start&&t.start(n,d,i,e.start,e.end)}function o(e,n,r,i){var o;if(null==r&&(r=d),null==i&&(i=d),n){var a=n.toLowerCase();for(o=c.length-1;o>=0&&c[o].tag.toLowerCase()!==a;o--);}else o=0;if(o>=0){for(var u=c.length-1;u>=o;u--)t.end&&t.end(c[u].tag,r,i);c.length=o,s=o&&c[o-1].tag}else"br"===n.toLowerCase()?t.start&&t.start(n,[],!0,r,i):"p"===n.toLowerCase()&&(t.start&&t.start(n,[],!1,r,i),t.end&&t.end(n,r,i))}for(var a,s,c=[],u=t.expectHTML,l=t.isUnaryTag||Cr,f=t.isFromDOM,d=0;e;){if(a=e,s&&Vo(s)){var p=s.toLowerCase(),v=Jo[p]||(Jo[p]=new RegExp("([\\s\\S]*?)(</"+p+"[^>]*>)","i")),h=0,m=e.replace(v,function(e,n,r){return h=r.length,"script"!==p&&"style"!==p&&"noscript"!==p&&(n=n.replace(/<!--([\s\S]*?)-->/g,"$1").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1")),t.chars&&t.chars(n),""});d+=e.length-m.length,e=m,o("</"+p+">",p,d-h,d)}else{var g=e.indexOf("<");if(0===g){if(/^<!--/.test(e)){var y=e.indexOf("-->");if(y>=0){n(y+3);continue}}if(/^<!\[/.test(e)){var _=e.indexOf("]>");if(_>=0){n(_+2);continue}}var b=e.match(ko);if(b){n(b[0].length);continue}var $=e.match(xo);if($){var w=d;n($[0].length),o($[0],$[1],w,d);continue}var C=r();if(C){i(C);continue}}var x=void 0;g>=0?(x=e.substring(0,g),n(g)):(x=e,e=""),t.chars&&t.chars(x)}if(e===a)throw new Error("Error parsing template:\n\n"+e)}o()}function Qt(e){function t(){(a||(a=[])).push(e.slice(d,i).trim()),d=i+1}var n,r,i,o,a,s=!1,c=!1,u=0,l=0,f=0,d=0;for(i=0;i<e.length;i++)if(r=n,n=e.charCodeAt(i),s)39===n&&92!==r&&(s=!s);else if(c)34===n&&92!==r&&(c=!c);else if(124!==n||124===e.charCodeAt(i+1)||124===e.charCodeAt(i-1)||u||l||f)switch(n){case 34:c=!0;break;case 39:s=!0;break;case 40:f++;break;case 41:f--;break;case 91:l++;break;case 93:l--;break;case 123:u++;break;case 125:u--}else void 0===o?(d=i+1,o=e.slice(0,i).trim()):t();if(void 0===o?o=e.slice(0,i).trim():0!==d&&t(),a)for(i=0;i<a.length;i++)o=Xt(o,a[i]);return o}function Xt(e,t){var n=t.indexOf("(");if(n<0)return'_f("'+t+'")('+e+")";var r=t.slice(0,n),i=t.slice(n+1);return'_f("'+r+'")('+e+","+i}function en(e,t){var n=t?Xo(t):Yo;if(n.test(e)){for(var r,i,o=[],a=n.lastIndex=0;r=n.exec(e);){i=r.index,i>a&&o.push(JSON.stringify(e.slice(a,i)));var s=Qt(r[1].trim());o.push("_s("+s+")"),a=i+r[0].length}return a<e.length&&o.push(JSON.stringify(e.slice(a))),o.join("+")}}function tn(e){console.error("[Vue parser]: "+e)}function nn(e,t){return e?e.map(function(e){return e[t]}).filter(function(e){return e}):[]}function rn(e,t,n){(e.props||(e.props=[])).push({name:t,value:n})}function on(e,t,n){(e.attrs||(e.attrs=[])).push({name:t,value:n})}function an(e,t,n,r,i){(e.directives||(e.directives=[])).push({name:t,value:n,arg:r,modifiers:i})}function sn(e,t,n,r,i){r&&r.capture&&(delete r.capture,t="!"+t);var o;r&&r.native?(delete r.native,o=e.nativeEvents||(e.nativeEvents={})):o=e.events||(e.events={});var a={value:n,modifiers:r},s=o[t];Array.isArray(s)?i?s.unshift(a):s.push(a):s?o[t]=i?[a,s]:[s,a]:o[t]=a}function cn(e,t,n){var r=un(e,":"+t)||un(e,"v-bind:"+t);if(null!=r)return r;if(n!==!1){var i=un(e,t);if(null!=i)return JSON.stringify(i)}}function un(e,t){var n;if(null!=(n=e.attrsMap[t]))for(var r=e.attrsList,i=0,o=r.length;i<o;i++)if(r[i].name===t){r.splice(i,1);break}return n}function ln(e,t){Oo=t.warn||tn,To=t.getTagNamespace||Cr,So=t.mustUseProp||Cr,Eo=t.isPreTag||Cr,jo=nn(t.modules,"preTransformNode"),Lo=nn(t.modules,"transformNode"),Do=nn(t.modules,"postTransformNode"),No=t.delimiters;var n,r,i=[],o=t.preserveWhitespace!==!1,a=!1,s=!1;return Yt(e,{expectHTML:t.expectHTML,isUnaryTag:t.isUnaryTag,isFromDOM:t.isFromDOM,shouldDecodeTags:t.shouldDecodeTags,shouldDecodeNewlines:t.shouldDecodeNewlines,start:function(e,o,c){function u(e){}var l=r&&r.ns||To(e);t.isIE&&"svg"===l&&(o=On(o));var f={type:1,tag:e,attrsList:o,attrsMap:xn(o),parent:r,children:[]};l&&(f.ns=l),An(f)&&(f.forbidden=!0);for(var d=0;d<jo.length;d++)jo[d](f,t);if(a||(fn(f),f.pre&&(a=!0)),Eo(f.tag)&&(s=!0),a)dn(f);else{hn(f),mn(f),yn(f),pn(f),f.plain=!f.key&&!o.length,vn(f),_n(f),bn(f);for(var p=0;p<Lo.length;p++)Lo[p](f,t);$n(f)}n||(n=f,u(n)),r&&!f.forbidden&&(f.else?gn(f,r):(r.children.push(f),f.parent=r)),c||(r=f,i.push(f));for(var v=0;v<Do.length;v++)Do[v](f,t)},end:function(){var e=i[i.length-1],t=e.children[e.children.length-1];t&&3===t.type&&" "===t.text&&e.children.pop(),i.length-=1,r=i[i.length-1],e.pre&&(a=!1),Eo(e.tag)&&(s=!1)},chars:function(e){if(r&&(e=s||e.trim()?sa(e):o&&r.children.length?" ":"")){var t;!a&&" "!==e&&(t=en(e,No))?r.children.push({type:2,expression:t,text:e}):r.children.push({type:3,text:e})}}}),n}function fn(e){null!=un(e,"v-pre")&&(e.pre=!0)}function dn(e){var t=e.attrsList.length;if(t)for(var n=e.attrs=new Array(t),r=0;r<t;r++)n[r]={name:e.attrsList[r].name,value:JSON.stringify(e.attrsList[r].value)};else e.pre||(e.plain=!0)}function pn(e){var t=cn(e,"key");t&&(e.key=t)}function vn(e){var t=cn(e,"ref");t&&(e.ref=t,e.refInFor=wn(e))}function hn(e){var t;if(t=un(e,"v-for")){var n=t.match(ta);if(!n)return;e.for=n[2].trim();var r=n[1].trim(),i=r.match(na);i?(e.alias=i[1].trim(),e.iterator1=i[2].trim(),i[3]&&(e.iterator2=i[3].trim())):e.alias=r}}function mn(e){var t=un(e,"v-if");t&&(e.if=t),null!=un(e,"v-else")&&(e.else=!0)}function gn(e,t){var n=kn(t.children);n&&n.if&&(n.elseBlock=e)}function yn(e){var t=un(e,"v-once");null!=t&&(e.once=!0)}function _n(e){if("slot"===e.tag)e.slotName=cn(e,"name");else{var t=cn(e,"slot");t&&(e.slotTarget=t)}}function bn(e){var t;(t=cn(e,"is"))&&(e.component=t),null!=un(e,"inline-template")&&(e.inlineTemplate=!0)}function $n(e){var t,n,r,i,o,a,s,c=e.attrsList;for(t=0,n=c.length;t<n;t++)if(r=c[t].name,i=c[t].value,ea.test(r))if(e.hasBindings=!0,a=Cn(r),a&&(r=r.replace(aa,"")),ra.test(r))r=r.replace(ra,""),a&&a.prop&&(s=!0,r=gr(r),"innerHtml"===r&&(r="innerHTML")),s||So(r)?rn(e,r,i):on(e,r,i);else if(ia.test(r))r=r.replace(ia,""),sn(e,r,i,a);else{r=r.replace(ea,"");var u=r.match(oa);u&&(o=u[1])&&(r=r.slice(0,-(o.length+1))),an(e,r,i,o,a)}else on(e,r,JSON.stringify(i))}function wn(e){for(var t=e;t;){if(void 0!==t.for)return!0;t=t.parent}return!1}function Cn(e){var t=e.match(aa);if(t){var n={};return t.forEach(function(e){n[e.slice(1)]=!0}),n}}function xn(e){for(var t={},n=0,r=e.length;n<r;n++)t[e[n].name]=e[n].value;return t}function kn(e){for(var t=e.length;t--;)if(e[t].tag)return e[t]}function An(e){return"style"===e.tag||"script"===e.tag&&(!e.attrsMap.type||"text/javascript"===e.attrsMap.type)}function On(e){for(var t=[],n=0;n<e.length;n++){var r=e[n];ca.test(r.name)||(r.name=r.name.replace(ua,""),t.push(r))}return t}function Tn(e,t){e&&(Mo=la(t.staticKeys||""),Po=t.isReservedTag||function(){return!1},En(e),jn(e,!1))}function Sn(e){return n("type,tag,attrsList,attrsMap,plain,parent,children,attrs"+(e?","+e:""))}function En(e){if(e.static=Ln(e),1===e.type)for(var t=0,n=e.children.length;t<n;t++){var r=e.children[t];En(r),r.static||(e.static=!1)}}function jn(e,t){if(1===e.type){if(e.once||e.static)return e.staticRoot=!0,void(e.staticInFor=t);if(e.children)for(var n=0,r=e.children.length;n<r;n++)jn(e.children[n],!!e.for)}}function Ln(e){return 2!==e.type&&(3===e.type||!(!e.pre&&(e.hasBindings||e.if||e.for||vr(e.tag)||!Po(e.tag)||!Object.keys(e).every(Mo))))}function Dn(e,t){var n=t?"nativeOn:{":"on:{";for(var r in e)n+='"'+r+'":'+Nn(e[r])+",";return n.slice(0,-1)+"}"}function Nn(e){if(e){if(Array.isArray(e))return"["+e.map(Nn).join(",")+"]";if(e.modifiers){var t="",n=[];for(var r in e.modifiers)pa[r]?t+=pa[r]:n.push(r);n.length&&(t=Mn(n)+t);var i=fa.test(e.value)?e.value+"($event)":e.value;return"function($event){"+t+i+"}"}return fa.test(e.value)?e.value:"function($event){"+e.value+"}"}return"function(){}"}function Mn(e){var t=1===e.length?Pn(e[0]):Array.prototype.concat.apply([],e.map(Pn));return Array.isArray(t)?"if("+t.map(function(e){return"$event.keyCode!=="+e}).join("&&")+")return;":"if($event.keyCode!=="+t+")return;"}function Pn(e){return parseInt(e,10)||da[e]||"_k("+JSON.stringify(e)+")"}function Rn(e,t){e.wrapData=function(e){return"_b("+e+","+t.value+(t.modifiers&&t.modifiers.prop?",true":"")+")"}}function In(e,t){var n=Ho,r=Ho=[];Uo=t,Ro=t.warn||tn,Io=nn(t.modules,"transformCode"),Fo=nn(t.modules,"genData"),Bo=t.directives||{};var i=e?Fn(e):'_h("div")';return Ho=n,{render:"with(this){return "+i+"}",staticRenderFns:r}}function Fn(e){if(e.staticRoot&&!e.staticProcessed)return e.staticProcessed=!0,Ho.push("with(this){return "+Fn(e)+"}"),"_m("+(Ho.length-1)+(e.staticInFor?",true":"")+")";if(e.for&&!e.forProcessed)return Un(e);if(e.if&&!e.ifProcessed)return Bn(e);if("template"!==e.tag||e.slotTarget){if("slot"===e.tag)return Wn(e);var t;if(e.component)t=Zn(e);else{var n=zn(e),r=e.inlineTemplate?null:Jn(e);t="_h('"+e.tag+"'"+(n?","+n:"")+(r?","+r:"")+")"}for(var i=0;i<Io.length;i++)t=Io[i](e,t);return t}return Jn(e)||"void 0"}function Bn(e){var t=e.if;return e.ifProcessed=!0,"("+t+")?"+Fn(e)+":"+Hn(e)}function Hn(e){return e.elseBlock?Fn(e.elseBlock):"_e()"}function Un(e){var t=e.for,n=e.alias,r=e.iterator1?","+e.iterator1:"",i=e.iterator2?","+e.iterator2:"";return e.forProcessed=!0,"_l(("+t+"),function("+n+r+i+"){return "+Fn(e)+"})"}function zn(e){if(!e.plain){var t="{",n=Vn(e);n&&(t+=n+","),e.key&&(t+="key:"+e.key+","),e.ref&&(t+="ref:"+e.ref+","),e.refInFor&&(t+="refInFor:true,"),e.component&&(t+='tag:"'+e.tag+'",'),e.slotTarget&&(t+="slot:"+e.slotTarget+",");for(var r=0;r<Fo.length;r++)t+=Fo[r](e);if(e.attrs&&(t+="attrs:{"+Gn(e.attrs)+"},"),e.props&&(t+="domProps:{"+Gn(e.props)+"},"),e.events&&(t+=Dn(e.events)+","),e.nativeEvents&&(t+=Dn(e.nativeEvents,!0)+","),e.inlineTemplate){var i=e.children[0];if(1===i.type){var o=In(i,Uo);t+="inlineTemplate:{render:function(){"+o.render+"},staticRenderFns:["+o.staticRenderFns.map(function(e){return"function(){"+e+"}"}).join(",")+"]}"}}return t=t.replace(/,$/,"")+"}",e.wrapData&&(t=e.wrapData(t)),t}}function Vn(e){var t=e.directives;if(t){var n,r,i,o,a="directives:[",s=!1;for(n=0,r=t.length;n<r;n++){i=t[n],o=!0;var c=Bo[i.name]||va[i.name];c&&(o=!!c(e,i,Ro)),o&&(s=!0,a+='{name:"'+i.name+'"'+(i.value?",value:("+i.value+"),expression:"+JSON.stringify(i.value):"")+(i.arg?',arg:"'+i.arg+'"':"")+(i.modifiers?",modifiers:"+JSON.stringify(i.modifiers):"")+"},")}return s?a.slice(0,-1)+"]":void 0}}function Jn(e){if(e.children.length)return"["+e.children.map(qn).join(",")+"]"}function qn(e){return 1===e.type?Fn(e):Kn(e)}function Kn(e){return 2===e.type?e.expression:JSON.stringify(e.text)}function Wn(e){var t=e.slotName||'"default"',n=Jn(e);return n?"_t("+t+","+n+")":"_t("+t+")"}function Zn(e){var t=Jn(e);return"_h("+e.component+","+zn(e)+(t?","+t:"")+")"}function Gn(e){for(var t="",n=0;n<e.length;n++){var r=e[n];t+='"'+r.name+'":'+r.value+","}return t.slice(0,-1)}function Yn(e,t){var n=ln(e.trim(),t);Tn(n,t);var r=In(n,t);return{ast:n,render:r.render,staticRenderFns:r.staticRenderFns}}function Qn(e,t){var n=(t.warn||tn,un(e,"class"));n&&(e.staticClass=JSON.stringify(n));var r=cn(e,"class",!1);r&&(e.classBinding=r)}function Xn(e){var t="";return e.staticClass&&(t+="staticClass:"+e.staticClass+","),e.classBinding&&(t+="class:"+e.classBinding+","),t}function er(e){var t=cn(e,"style",!1);t&&(e.styleBinding=t)}function tr(e){return e.styleBinding?"style:("+e.styleBinding+"),":""}function nr(e,t,n){zo=n;var r=t.value,i=t.modifiers,o=e.tag,a=e.attrsMap.type;if("select"===o)return ar(e,r);if("input"===o&&"checkbox"===a)rr(e,r);else{if("input"!==o||"radio"!==a)return or(e,r,i);ir(e,r)}}function rr(e,t){var n=cn(e,"value")||"null",r=cn(e,"true-value")||"true",i=cn(e,"false-value")||"false";rn(e,"checked","Array.isArray("+t+")?_i("+t+","+n+")>-1:_q("+t+","+r+")"),sn(e,"change","var $$a="+t+",$$el=$event.target,$$c=$$el.checked?("+r+"):("+i+");if(Array.isArray($$a)){var $$v="+n+",$$i=_i($$a,$$v);if($$c){$$i<0&&("+t+"=$$a.concat($$v))}else{$$i>-1&&("+t+"=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{"+t+"=$$c}",null,!0)}function ir(e,t){var n=cn(e,"value")||"null";rn(e,"checked","_q("+t+","+n+")"),sn(e,"change",t+"="+n,null,!0)}function or(e,t,n){var r=e.attrsMap.type,i=n||{},o=i.lazy,a=i.number,s=i.trim,c=o||Sr&&"range"===r?"change":"input",u=!o&&"range"!==r,l="input"===e.tag||"textarea"===e.tag,f=l?"$event.target.value"+(s?".trim()":""):"$event",d=a||"number"===r?t+"=_n("+f+")":t+"="+f;if(l&&u&&(d="if($event.target.composing)return;"+d),rn(e,"value",l?"_s("+t+")":"("+t+")"),sn(e,c,d,null,!0),u)return!0}function ar(e,t){var n=t+'=Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){return "_value" in o ? o._value : o.value})'+(null==e.attrsMap.multiple?"[0]":"");return sn(e,"change",n,null,!0),!0}function sr(e,t){t.value&&rn(e,"textContent","_s("+t.value+")")}function cr(e,t){t.value&&rn(e,"innerHTML","_s("+t.value+")")}function ur(e,t){return t=t?u(u({},ba),t):ba,Yn(e,t)}function lr(e,t,n){var r=(t&&t.warn||ai,t&&t.delimiters?String(t.delimiters)+e:e);if(_a[r])return _a[r];var i={},o=ur(e,t);i.render=fr(o.render);var a=o.staticRenderFns.length;i.staticRenderFns=new Array(a);for(var s=0;s<a;s++)i.staticRenderFns[s]=fr(o.staticRenderFns[s]);return _a[r]=i}function fr(e){try{return new Function(e)}catch(e){return p}}function dr(e){if(e.outerHTML)return e.outerHTML;var t=document.createElement("div");return t.appendChild(e.cloneNode(!0)),t.innerHTML}var pr,vr=n("slot,component",!0),hr=Object.prototype.hasOwnProperty,mr=/-(\w)/g,gr=a(function(e){return e.replace(mr,function(e,t){return t?t.toUpperCase():""})}),yr=a(function(e){return e.charAt(0).toUpperCase()+e.slice(1)}),_r=/([^-])([A-Z])/g,br=a(function(e){return e.replace(_r,"$1-$2").replace(_r,"$1-$2").toLowerCase()}),$r=Object.prototype.toString,wr="[object Object]",Cr=function(){return!1},xr={optionMergeStrategies:Object.create(null),silent:!1,devtools:!1,errorHandler:null,ignoredElements:null,keyCodes:Object.create(null),isReservedTag:Cr,isUnknownElement:Cr,getTagNamespace:p,mustUseProp:Cr,_assetTypes:["component","directive","filter"],_lifecycleHooks:["beforeCreate","created","beforeMount","mounted","beforeUpdate","updated","beforeDestroy","destroyed","activated","deactivated"],_maxUpdateCount:100,_isServer:!1},kr=/[^\w\.\$]/,Ar="__proto__"in{},Or="undefined"!=typeof window&&"[object Object]"!==Object.prototype.toString.call(window),Tr=Or&&window.navigator.userAgent.toLowerCase(),Sr=Tr&&/msie|trident/.test(Tr),Er=Tr&&Tr.indexOf("msie 9.0")>0,jr=Tr&&Tr.indexOf("edge/")>0,Lr=Tr&&Tr.indexOf("android")>0,Dr=Tr&&/iphone|ipad|ipod|ios/.test(Tr),Nr=Or&&window.__VUE_DEVTOOLS_GLOBAL_HOOK__,Mr=function(){function e(){r=!1;var e=n.slice(0);n.length=0;for(var t=0;t<e.length;t++)e[t]()}var t,n=[],r=!1;if("undefined"!=typeof Promise&&b(Promise)){var i=Promise.resolve();t=function(){i.then(e),Dr&&setTimeout(p)}}else if("undefined"==typeof MutationObserver||!b(MutationObserver)&&"[object MutationObserverConstructor]"!==MutationObserver.toString())t=setTimeout;else{var o=1,a=new MutationObserver(e),s=document.createTextNode(String(o));a.observe(s,{characterData:!0}),t=function(){o=(o+1)%2,s.data=String(o)}}return function(i,o){var a=o?function(){i.call(o)}:i;n.push(a),r||(r=!0,t(e,0))}}();pr="undefined"!=typeof Set&&b(Set)?Set:function(){function e(){this.set=Object.create(null)}return e.prototype.has=function(e){return void 0!==this.set[e]},e.prototype.add=function(e){this.set[e]=1},e.prototype.clear=function(){this.set=Object.create(null)},e}();var Pr=0,Rr=function(){this.id=Pr++,this.subs=[]};Rr.prototype.addSub=function(e){this.subs.push(e)},Rr.prototype.removeSub=function(e){r(this.subs,e)},Rr.prototype.depend=function(){Rr.target&&Rr.target.addDep(this)},Rr.prototype.notify=function(){for(var e=this.subs.slice(),t=0,n=e.length;t<n;t++)e[t].update()},Rr.target=null;var Ir=[],Fr=[],Br={},Hr=!1,Ur=!1,zr=0,Vr=0,Jr=function(e,t,n,r){void 0===r&&(r={}),this.vm=e,e._watchers.push(this),this.deep=!!r.deep,this.user=!!r.user,this.lazy=!!r.lazy,this.sync=!!r.sync,this.expression=t.toString(),this.cb=n,this.id=++Vr,this.active=!0,this.dirty=this.lazy,this.deps=[],this.newDeps=[],this.depIds=new pr,this.newDepIds=new pr,"function"==typeof t?this.getter=t:(this.getter=_(t),this.getter||(this.getter=function(){})),this.value=this.lazy?void 0:this.get()};Jr.prototype.get=function(){$(this);var e=this.getter.call(this.vm,this.vm);return this.deep&&A(e),w(),this.cleanupDeps(),e},Jr.prototype.addDep=function(e){var t=e.id;this.newDepIds.has(t)||(this.newDepIds.add(t),this.newDeps.push(e),this.depIds.has(t)||e.addSub(this))},Jr.prototype.cleanupDeps=function(){for(var e=this,t=this.deps.length;t--;){var n=e.deps[t];e.newDepIds.has(n.id)||n.removeSub(e)}var r=this.depIds;this.depIds=this.newDepIds,this.newDepIds=r,this.newDepIds.clear(),r=this.deps,this.deps=this.newDeps,this.newDeps=r,this.newDeps.length=0},Jr.prototype.update=function(){this.lazy?this.dirty=!0:this.sync?this.run():k(this)},Jr.prototype.run=function(){if(this.active){var e=this.get();if(e!==this.value||l(e)||this.deep){var t=this.value;if(this.value=e,this.user)try{this.cb.call(this.vm,e,t)}catch(e){if(!xr.errorHandler)throw e;xr.errorHandler.call(null,e,this.vm)}else this.cb.call(this.vm,e,t)}}},Jr.prototype.evaluate=function(){this.value=this.get(),this.dirty=!1},Jr.prototype.depend=function(){for(var e=this,t=this.deps.length;t--;)e.deps[t].depend()},Jr.prototype.teardown=function(){var e=this;if(this.active){this.vm._isBeingDestroyed||this.vm._vForRemoving||r(this.vm._watchers,this);for(var t=this.deps.length;t--;)e.deps[t].removeSub(e);this.active=!1}};var qr=new pr,Kr=Array.prototype,Wr=Object.create(Kr);["push","pop","shift","unshift","splice","sort","reverse"].forEach(function(e){var t=Kr[e];y(Wr,e,function(){for(var n=arguments,r=arguments.length,i=new Array(r);r--;)i[r]=n[r];var o,a=t.apply(this,i),s=this.__ob__;switch(e){case"push":o=i;break;case"unshift":o=i;break;case"splice":o=i.slice(2)}return o&&s.observeArray(o),s.dep.notify(),a})});var Zr=Object.getOwnPropertyNames(Wr),Gr={shouldConvert:!0,isSettingProps:!1},Yr=function(e){if(this.value=e,this.dep=new Rr,this.vmCount=0,y(e,"__ob__",this),Array.isArray(e)){var t=Ar?O:T;t(e,Wr,Zr),this.observeArray(e)}else this.walk(e)};Yr.prototype.walk=function(e){for(var t=Object.keys(e),n=0;n<t.length;n++)E(e,t[n],e[t[n]])},Yr.prototype.observeArray=function(e){for(var t=0,n=e.length;t<n;t++)S(e[t])};var Qr={enumerable:!0,configurable:!0,get:p,set:p},Xr=function(e,t,n,r,i,o,a,s){this.tag=e,this.data=t,this.children=n,this.text=r,this.elm=i,this.ns=o,this.context=a,this.key=t&&t.key,this.componentOptions=s,this.child=void 0,this.parent=void 0,this.raw=!1,this.isStatic=!1,this.isRootInsert=!0,this.isComment=!1,this.isCloned=!1},ei=function(){var e=new Xr;return e.text="",e.isComment=!0,e},ti=null,ni={init:oe,prepatch:ae,insert:se,destroy:ce},ri=Object.keys(ni),ii=0;$e(we),H(we),be(we),ee(we),ge(we);var oi,ai=p,si=xr.optionMergeStrategies;si.data=function(e,t,n){return n?e||t?function(){var r="function"==typeof t?t.call(n):t,i="function"==typeof e?e.call(n):void 0;return r?Ce(r,i):i}:void 0:t?"function"!=typeof t?e:e?function(){return Ce(t.call(this),e.call(this))}:t:e},xr._lifecycleHooks.forEach(function(e){si[e]=xe}),xr._assetTypes.forEach(function(e){si[e+"s"]=ke}),si.watch=function(e,t){if(!t)return e;if(!e)return t;var n={};u(n,e);for(var r in t){var i=n[r],o=t[r];i&&!Array.isArray(i)&&(i=[i]),n[r]=i?i.concat(o):[o]}return n},si.props=si.methods=si.computed=function(e,t){if(!t)return e;if(!e)return t;var n=Object.create(null);return u(n,e),u(n,t),n};var ci=function(e,t){return void 0===t?e:t},ui=Object.freeze({defineReactive:E,_toString:e,toNumber:t,makeMap:n,isBuiltInTag:vr,remove:r,hasOwn:i,isPrimitive:o,cached:a,camelize:gr,capitalize:yr,hyphenate:br,bind:s,toArray:c,extend:u,isObject:l,isPlainObject:f,toObject:d,noop:p,no:Cr,genStaticKeys:v,looseEqual:h,looseIndexOf:m,isReserved:g,def:y,parsePath:_,hasProto:Ar,inBrowser:Or,UA:Tr,isIE:Sr,isIE9:Er,isEdge:jr,isAndroid:Lr,isIOS:Dr,devtools:Nr,nextTick:Mr,get _Set(){return pr},mergeOptions:Se,resolveAsset:Ee,warn:ai,formatComponentName:oi,validateProp:je}),li={name:"keep-alive",abstract:!0,created:function(){this.cache=Object.create(null)},render:function(){var e=W(this.$slots.default);if(e&&e.componentOptions){var t=e.componentOptions,n=null==e.key?t.Ctor.cid+"::"+t.tag:e.key;this.cache[n]?e.child=this.cache[n].child:this.cache[n]=e,e.data.keepAlive=!0}return e},destroyed:function(){var e=this;for(var t in this.cache){var n=e.cache[t];te(n.child,"deactivated"),n.child.$destroy()}}},fi={KeepAlive:li};Ie(we),Object.defineProperty(we.prototype,"$isServer",{get:function(){return xr._isServer}}),we.version="2.0.1";var di,pi=n("value,selected,checked,muted"),vi=n("contenteditable,draggable,spellcheck"),hi=n("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),mi="http://www.w3.org/1999/xlink",gi=function(e){return":"===e.charAt(5)&&"xlink"===e.slice(0,5)},yi=function(e){return gi(e)?e.slice(6,e.length):""},_i=function(e){return null==e||e===!1},bi={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML"},$i=n("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template"),wi=n("area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr",!0),Ci=n("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source",!0),xi=n("address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track",!0),ki=n("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font,font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view",!0),Ai=function(e){return"pre"===e},Oi=function(e){return $i(e)||ki(e)},Ti=Object.create(null),Si=Object.freeze({createElement:Ke,createElementNS:We,createTextNode:Ze,createComment:Ge,insertBefore:Ye,removeChild:Qe,appendChild:Xe,parentNode:et,nextSibling:tt,tagName:nt,setTextContent:rt,childNodes:it,setAttribute:ot}),Ei={create:function(e,t){at(t)},update:function(e,t){e.data.ref!==t.data.ref&&(at(e,!0),at(t))},destroy:function(e){at(e,!0)}},ji={},Li=new Xr("",ji,[]),Di=["create","update","postpatch","remove","destroy"],Ni={create:function(e,t){var n=!1;dt(e,t,function(r,i){vt(r,i,"bind",t,e),r.inserted&&(n=!0)}),n&&Z(t.data.hook||(t.data.hook={}),"insert",function(){pt(e,t,"inserted")})},update:function(e,t){pt(e,t,"update"),e.data.directives&&!t.data.directives&&pt(e,e,"unbind")},postpatch:function(e,t){pt(e,t,"componentUpdated")},destroy:function(e){pt(e,e,"unbind")}},Mi=Object.create(null),Pi=[Ei,Ni],Ri={create:ht,update:ht},Ii={create:gt,update:gt},Fi={create:yt,update:yt},Bi={create:_t,update:_t},Hi=["Webkit","Moz","ms"],Ui=a(function(e){if(di=di||document.createElement("div"),e=gr(e),"filter"!==e&&e in di.style)return e;for(var t=e.charAt(0).toUpperCase()+e.slice(1),n=0;n<Hi.length;n++){var r=Hi[n]+t;if(r in di.style)return r}}),zi={create:bt,update:bt},Vi=Or&&!Er,Ji="transition",qi="animation",Ki="transition",Wi="transitionend",Zi="animation",Gi="animationend";Vi&&(void 0===window.ontransitionend&&void 0!==window.onwebkittransitionend&&(Ki="WebkitTransition",Wi="webkitTransitionEnd"),void 0===window.onanimationend&&void 0!==window.onwebkitanimationend&&(Zi="WebkitAnimation",Gi="webkitAnimationEnd"));var Yi=Or&&window.requestAnimationFrame||setTimeout,Qi=/\b(transform|all)(,|$)/,Xi=a(function(e){return{enterClass:e+"-enter",leaveClass:e+"-leave",appearClass:e+"-enter",enterActiveClass:e+"-enter-active",leaveActiveClass:e+"-leave-active",appearActiveClass:e+"-enter-active"}}),eo=Or?{create:function(e,t){t.data.show||Et(t)},remove:function(e,t){e.data.show?t():jt(e,t)}}:{},to=[Ri,Ii,Fi,Bi,zi,eo],no=to.concat(Pi),ro=ft({nodeOps:Si,modules:no});Er&&document.addEventListener("selectionchange",function(){var e=document.activeElement;e&&e.vmodel&&Ft(e,"input")});var io={bind:function(e,t,n){if("select"===n.tag){if(Nt(e,t,n.context),Sr||jr){var r=function(){Nt(e,t,n.context)};Mr(r),setTimeout(r,0)}}else"textarea"!==n.tag&&"text"!==e.type||(Lr||(e.addEventListener("compositionstart",Rt),e.addEventListener("compositionend",It)),Er&&(e.vmodel=!0))},componentUpdated:function(e,t,n){if("select"===n.tag){Nt(e,t,n.context);var r=e.multiple?t.value.some(function(t){return Mt(t,e.options)}):Mt(t.value,e.options);r&&Ft(e,"change")}}},oo={bind:function(e,t,n){var r=t.value;n=Bt(n);var i=n.data&&n.data.transition;r&&i&&!Er&&Et(n);var o="none"===e.style.display?"":e.style.display;e.style.display=r?o:"none",e.__vOriginalDisplay=o},update:function(e,t,n){var r=t.value,i=t.oldValue;if(r!==i){n=Bt(n);var o=n.data&&n.data.transition;o&&!Er?r?(Et(n),e.style.display=e.__vOriginalDisplay):jt(n,function(){e.style.display="none"}):e.style.display=r?e.__vOriginalDisplay:"none"}}},ao={model:io,show:oo},so={name:String,appear:Boolean,css:Boolean,mode:String,type:String,enterClass:String,leaveClass:String,enterActiveClass:String,leaveActiveClass:String,appearClass:String,appearActiveClass:String},co={name:"transition",props:so,abstract:!0,render:function(e){var t=this,n=this.$slots.default;if(n&&(n=n.filter(function(e){return e.tag}),n.length)){var r=this.mode,i=n[0];if(Vt(this.$vnode))return i;var o=Ht(i);if(!o)return i;if(this._leaving)return zt(e,i);o.key=null==o.key||o.isStatic?"__v"+(o.tag+this._uid)+"__":o.key;var a=(o.data||(o.data={})).transition=Ut(this),s=this._vnode,c=Ht(s);if(o.data.directives&&o.data.directives.some(function(e){return"show"===e.name})&&(o.data.show=!0),c&&c.data&&c.key!==o.key){var l=c.data.transition=u({},a);if("out-in"===r)return this._leaving=!0,Z(l,"afterLeave",function(){t._leaving=!1,t.$forceUpdate()}),zt(e,i);if("in-out"===r){var f,d=function(){f()};Z(a,"afterEnter",d),Z(a,"enterCancelled",d),Z(l,"delayLeave",function(e){f=e})}}return i}}},uo=u({tag:String,moveClass:String},so);delete uo.mode;var lo={props:uo,render:function(e){for(var t=this.tag||this.$vnode.data.tag||"span",n=Object.create(null),r=this.prevChildren=this.children,i=this.$slots.default||[],o=this.children=[],a=Ut(this),s=0;s<i.length;s++){var c=i[s];c.tag&&null!=c.key&&0!==String(c.key).indexOf("__vlist")&&(o.push(c),n[c.key]=c,(c.data||(c.data={})).transition=a)}if(r){for(var u=[],l=[],f=0;f<r.length;f++){var d=r[f];d.data.transition=a,d.data.pos=d.elm.getBoundingClientRect(),n[d.key]?u.push(d):l.push(d)}this.kept=e(t,null,u),this.removed=l}return e(t,null,o)},beforeUpdate:function(){this.__patch__(this._vnode,this.kept,!1,!0),this._vnode=this.kept},updated:function(){var e=this.prevChildren,t=this.moveClass||this.name+"-move";if(e.length&&this.hasMove(e[0].elm,t)){e.forEach(Jt),e.forEach(qt),e.forEach(Kt);document.body.offsetHeight;e.forEach(function(e){if(e.data.moved){var n=e.elm,r=n.style;xt(n,t),r.transform=r.WebkitTransform=r.transitionDuration="",n.addEventListener(Wi,n._moveCb=function e(r){r&&!/transform$/.test(r.propertyName)||(n.removeEventListener(Wi,e),n._moveCb=null,kt(n,t))})}})}},methods:{hasMove:function(e,t){if(!Vi)return!1;if(null!=this._hasMove)return this._hasMove;xt(e,t);var n=Ot(e);return kt(e,t),this._hasMove=n.hasTransform}}},fo={Transition:co,TransitionGroup:lo};we.config.isUnknownElement=Je,we.config.isReservedTag=Oi,we.config.getTagNamespace=Ve,we.config.mustUseProp=pi,u(we.options.directives,ao),u(we.options.components,fo),we.prototype.__patch__=xr._isServer?p:ro,we.prototype.$mount=function(e,t){return e=e&&!xr._isServer?qe(e):void 0,this._mount(e,t)},setTimeout(function(){xr.devtools&&Nr&&Nr.emit("init",we)},0);var po=!!Or&&Wt(">","&gt;"),vo=!!Or&&Wt("\n","&#10;"),ho=document.createElement("div"),mo=/([^\s"'<>\/=]+)/,go=/(?:=)/,yo=[/"([^"]*)"+/.source,/'([^']*)'+/.source,/([^\s"'=<>`]+)/.source],_o=new RegExp("^\\s*"+mo.source+"(?:\\s*("+go.source+")\\s*(?:"+yo.join("|")+"))?"),bo="[a-zA-Z_][\\w\\-\\.]*",$o="((?:"+bo+"\\:)?"+bo+")",wo=new RegExp("^<"+$o),Co=/^\s*(\/?)>/,xo=new RegExp("^<\\/"+$o+"[^>]*>"),ko=/^<!DOCTYPE [^>]+>/i,Ao=!1;"x".replace(/x(.)?/g,function(e,t){Ao=""===t});var Oo,To,So,Eo,jo,Lo,Do,No,Mo,Po,Ro,Io,Fo,Bo,Ho,Uo,zo,Vo=n("script,style",!0),Jo={},qo=/&lt;/g,Ko=/&gt;/g,Wo=/&#10;/g,Zo=/&amp;/g,Go=/&quot;/g,Yo=/\{\{((?:.|\n)+?)\}\}/g,Qo=/[-.*+?^${}()|[\]\/\\]/g,Xo=a(function(e){var t=e[0].replace(Qo,"\\$&"),n=e[1].replace(Qo,"\\$&");return new RegExp(t+"((?:.|\\n)+?)"+n,"g")}),ea=/^v-|^@|^:/,ta=/(.*)\s+(?:in|of)\s+(.*)/,na=/\(([^,]*),([^,]*)(?:,([^,]*))?\)/,ra=/^:|^v-bind:/,ia=/^@|^v-on:/,oa=/:(.*)$/,aa=/\.[^\.]+/g,sa=a(Zt),ca=/^xmlns:NS\d+/,ua=/^NS\d+:/,la=a(Sn),fa=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/,da={esc:27,tab:9,enter:13,space:32,up:38,left:37,right:39,down:40,delete:[8,46]},pa={stop:"$event.stopPropagation();",prevent:"$event.preventDefault();",self:"if($event.target !== $event.currentTarget)return;"},va={bind:Rn,cloak:p},ha=(new RegExp("\\b"+"do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments".split(",").join("\\b|\\b")+"\\b"),{staticKeys:["staticClass"],transformNode:Qn,genData:Xn}),ma={transformNode:er,genData:tr},ga=[ha,ma],ya={model:nr,text:sr,html:cr},_a=Object.create(null),ba={isIE:Sr,expectHTML:!0,modules:ga,staticKeys:v(ga),directives:ya,isReservedTag:Oi,isUnaryTag:wi,mustUseProp:pi,getTagNamespace:Ve,isPreTag:Ai},$a=a(function(e){var t=qe(e);return t&&t.innerHTML}),wa=we.prototype.$mount;return we.prototype.$mount=function(e,t){if(e=e&&qe(e),e===document.body||e===document.documentElement)return this;var n=this.$options;if(!n.render){var r=n.template,i=!1;if(r)if("string"==typeof r)"#"===r.charAt(0)&&(i=!0,r=$a(r));else{if(!r.nodeType)return this;i=!0,r=r.innerHTML}else e&&(i=!0,r=dr(e));if(r){var o=lr(r,{warn:ai,isFromDOM:i,shouldDecodeTags:po,shouldDecodeNewlines:vo,delimiters:n.delimiters},this),a=o.render,s=o.staticRenderFns;n.render=a,n.staticRenderFns=s}}return wa.call(this,e,t)},we.compile=lr,we});
$(document).ready(function() {
    var e = $('.c-portfolio__img');
    var width = 5;
    for (var i = 0; i < width; i++) {
//        console.log(this);
      e.appendTo($(e).parent());
    }
});

Vue.config.devtools = true;

Vue.component('card', {
  template: `
    <div class="card-wrap"
      @mousemove="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      ref="card">
      <div class="card"
        :style="cardStyle">
        <div class="card-bg" :style="[cardBgTransform, cardBgImage]"></div>
        <div class="card-info">
          <slot name="header"></slot>
          <slot name="content"></slot>
        </div>
      </div>
    </div>`,
  mounted() {
    this.width = this.$refs.card.offsetWidth;
    this.height = this.$refs.card.offsetHeight;
  },
  props: ['dataImage'],
  data: () => ({
    width: 0,
    height: 0,
    mouseX: 0,
    mouseY: 0,
    mouseLeaveDelay: null
  }),
  computed: {
    mousePX() {
      return this.mouseX / this.width;
    },
    mousePY() {
      return this.mouseY / this.height;
    },
    cardStyle() {
      const rX = this.mousePX * 30;
      const rY = this.mousePY * -30;
      return {
        transform: `rotateY(${rX}deg) rotateX(${rY}deg)`
      };
    },
    cardBgTransform() {
      const tX = this.mousePX; // * -40
      const tY = this.mousePY; //* -40
      return {
        transform: `translateX(${tX}px) translateY(${tY}px)`
      }
    },
    cardBgImage() {
      return {
        backgroundImage: `url(${this.dataImage})`
      }
    }
  },
  methods: {
    handleMouseMove(e) {
      // this.mouseX = e.pageX - this.$refs.card.offsetLeft - this.width/2;
      // this.mouseY = e.pageY - this.$refs.card.offsetTop - this.height/2;
    },
    handleMouseEnter() {
      // clearTimeout(this.mouseLeaveDelay);
    },
    handleMouseLeave() {
      // this.mouseLeaveDelay = setTimeout(()=>{
      //   this.mouseX = 0;
      //   this.mouseY = 0;
      // }, 1000);
    }
  }
});

const portfolio_App = new Vue({
  el: '#portfolioApp'
});
const portfolio_Ipad = new Vue({
  el: '#portfolioIpad'
});

$( document ).ready(function() {

  // Get started!
  $('body').removeClass('no-js');
});
