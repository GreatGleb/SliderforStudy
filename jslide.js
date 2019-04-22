$(document).ready(function() {
	const $cont = $(".cont");
	const $slider = $(".slider");
	const $nav = $(".nat");
	const winW = $(window).width();
	const animSpd = 750; // Change also in CSS
	const distOfLetGo = winW * 0.2;
	let curSlide = 1;
	let animation = false;
	let autoScrollVar = true;
	let diff = 0;
	var counter = 0;

	// Generating slides
	let arrCities = ['Сэндвич "Капрезе"',
"Сэндвич с ветчиной и сыром", "Сэндвич с курицей, беконом и авокадо",
"Сэндвич с яйцом и шпинатом", "Бургер по-мексикански",
"Клубный сэндвич", "Быстрый куриный пирог",
"Бутерброд с сыром и копчёным лососем"]; // Change number of slides in CSS also
	let numOfCities = arrCities.length;
	let arrCitiesDivided = [];

	arrCities.map(city => {
		let length = city.length;
		let letters = Math.floor(length);
		let exp = new RegExp(".{1," + letters + "}", "g");

		arrCitiesDivided.push(city.match(exp));
	});

	let generateSlide = function(city) {
		let frag1 = $(document.createDocumentFragment());
		let frag2 = $(document.createDocumentFragment());
		const numSlide = arrCities.indexOf(arrCities[city]) + 1;

		const $slide = $(`<div data-target="${numSlide}" class="slide slide--${numSlide}">
							<div class="slide__darkbg slide--${numSlide}__darkbg"></div>
							<div class="slide__text-wrapper slide--${numSlide}__text-wrapper">
								<div class="text-dark slide-${numSlide}_dark"></div>
							</div>
							<div data-target='right' class="side-nav side-nav--right"></div>
							<div data-target='left' class="side-nav side-nav--left"></div>
						</div>`);

		for (let i = 0, length = arrCitiesDivided[city].length; i < length; i++) {
			const text = $(`<div class="slide__text slide__text--${i + 1}">
								${arrCitiesDivided[city][i]}
							</div>`);
			frag1.append(text);
		}

		const navSlide = $(
			`<li data-target="${numSlide}" class="nav__slide nav__slide--${numSlide}"></li>`
		);
		frag2.append(navSlide);
		$nav.append(frag2);

		$slide
			.find(`.slide-${numSlide}_dark`)			
			.append(frag1);
		$slider.append($slide);
	};

	for (let i = 0, length = numOfCities; i < length; i++) {
		generateSlide(i);
	}

	$(".nav__slide--1").addClass("nav-active");

	// Navigation
	function bullets(dir) {
		$(".nav__slide--" + curSlide).removeClass("nav-active");
		$(".nav__slide--" + dir).addClass("nav-active");
	}

	function timeout() {
		animation = false;
	}
	
	var counter;
var timerId = setInterval(function() {
		navigateRight();
		if(counter<8){
		counter=curSlide;}
	if((counter>7)&&(counter<10)) {
		counter++;
	}
	if(counter==10) {
		bullets(1);
		curSlide=0;
		counter=1;
		if (!autoScrollVar) return;
		if (curSlide >= numOfCities) return;
		pagination(0);
		setTimeout(timeout, animSpd);
	}
}, 8000);

	function pagination(direction) {
		animation = true;
		diff = 0;
		$slider.addClass("animation");
		$slider.css({
			transform: "translate3d(-" + (curSlide - direction) * 100 + "%, 0, 0)"
		});

		$slider.find(".slide__darkbg").css({
			transform: "translate3d(" + (curSlide - direction) * 50 + "%, 0, 0)"
		});

		$slider.find(".slide__text").css({
			transform: "translate3d(0, 0, 0)"
		});
	}

	function navigateRight() {
		if (!autoScrollVar) return;
		if (curSlide >= numOfCities) return;
		pagination(0);
		setTimeout(timeout, animSpd);
		bullets(curSlide + 1);
		curSlide++;
	}

	function navigateLeft() {
		if (curSlide <= 1) return;
		pagination(2);
		setTimeout(timeout, animSpd);
		bullets(curSlide - 1);
		curSlide--;
	}

	function toDefault() {
		pagination(1);
		setTimeout(timeout, animSpd);
	}

	// Events
	$(document).on("mousedown touchstart", ".slide", function(e) {
		if (animation) return;
		let target = +$(this).attr("data-target");
		let startX = e.pageX || e.originalEvent.touches[0].pageX;
		$slider.removeClass("animation");

		$(document).on("mousemove touchmove", function(e) {
			let x = e.pageX || e.originalEvent.touches[0].pageX;
			diff = startX - x;
			if ((target === 1 && diff < 0) || (target === numOfCities && diff > 0))
				return;

			$slider.css({
				transform: "translate3d(-" + ((curSlide - 1) * 100 + diff / 30) + "%, 0, 0)"
			});

			$slider.find(".slide__darkbg").css({
				transform: "translate3d(" + ((curSlide - 1) * 50 + diff / 60) + "%, 0, 0)"
			});

			$slider.find(".slide__text").css({
				transform: "translate3d(" + diff / 15 + "px, 0, 0)"
			});
		});
	});

	$(document).on("mouseup touchend", function(e) {
		$(document).off("mousemove touchmove");

		if (animation) return;

		if (diff >= distOfLetGo) {
			navigateRight();
		} else if (diff <= -distOfLetGo) {
			navigateLeft();
		} else {
			toDefault();
		}
	});

	$(document).on("click", ".nav__slide:not(.nav-active)", function() {
		let target = +$(this).attr("data-target");
		bullets(target);
		curSlide = target;
		pagination(1);
	});

	$(document).on("click", ".side-nav", function() {
		let target = $(this).attr("data-target");

		if (target === "right") navigateRight();
		if (target === "left") navigateLeft();
	});

	$(document).on("keydown", function(e) {
		if (e.which === 39) navigateRight();
		if (e.which === 37) navigateLeft();
	});

	$(document).on("mousewheel DOMMouseScroll", function(e) {
		if (animation) return;
		let delta = e.originalEvent.wheelDelta;

		if (delta > 0 || e.originalEvent.detail < 0) navigateLeft();
		if (delta < 0 || e.originalEvent.detail > 0) navigateRight();
	});
});
