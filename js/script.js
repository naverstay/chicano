var wnd, doc, html, body, ie = 11,
    minFPwidth = 1024,
    minFPheight = 650,
    pageSlider,
    scrolling = false;

ieCheck();

function docScrollTo(pos, speed, callback) {

    $('html,body').animate({'scrollTop': pos}, speed, function () {
        if (typeof(callback) == 'function') {
            callback();
        }
    });
}

$(function ($) {

    if (ie < 9) {
        alert('Обновите браузер');

        return;
    }

    wnd = $(window);
    doc = $(document);
    html = $('html');
    body = $('body');

    $('.scrollToLink').on ('click', function () {
        docScrollTo($($(this).attr('href')).offset().top, 800);
        return false;
    });

    $('.openMenu').on ('click', function () {
        body.toggleClass('open_menu');
        return false;
    });

    $('.menuBtn').fancybox({
        padding: 0,
        maxWidth: 900,
        //maxHeight: 600,
        fitToView: true,
        width: '70%',
        //height: '70%',
        //autoSize: false,
        //closeClick: false,
        openEffect: 'none',
        closeEffect: 'none',
        helpers: {
            overlay: {
                locked: false
            }
        }
    });

    $('.closeMenu').on ('click', function () {
        body.removeClass('open_menu');
        return false;
    });

    body.delegate('.scrollDown', 'click', function () {
        var curSection = $(this).closest('.slide_section');

        if (pageSliderLoaded) {
            $.fn.fullpage.moveTo(curSection.index() + 2);
        } else {
            if (curSection.next().length) {
                scrolling = true;
                docScrollTo(curSection.next().offset().top, 600, function () {
                    scrolling = false;
                });
            }
        }

        return false;

    }).delegate('.menuLink', 'click', function () {
        var firedEl = $(this), targetSection = $(firedEl.attr('href'));

        if (pageSliderLoaded) {
            $.fn.fullpage.moveTo(targetSection.index() + 1);
        } else {
            docScrollTo(targetSection.offset().top, 600, function () {
                scrolling = false;
                //firedEl.parent().addClass('active').siblings().removeClass('active');
            });
        }

        return false;
    });

    initGallery();

    initFancy();

});

function docScrollTo(pos, speed, callback) {

    $('html,body').animate({'scrollTop': pos}, speed, function () {
        if (typeof(callback) == 'function') {
            callback();
        }
    });
}

function initFancy() {
    $(".fancybox").fancybox({
        padding: 35,
        openEffect: 'none',
        closeEffect: 'none',
        afterShow: function (opts) {
            //console.log('beforeShow title helper', opts, this);

            var fb = $(this.wrap), el = $(this.element),
                elTitle = $('<div class="dish_name" />').text(el.attr('data-fb-title')),
                elText = $('<p/>').text(el.attr('data-fb-text'));

            fb.find('.fancybox-title').addClass('dish_info').html('').append(elTitle).append(elText);

        },
        helpers: {
            overlay: {
                locked: false
            },
            title: {
                type: 'inner'
            }
        }
    });
}

function getPseudoAttr(el, prop, val) {
    var ret = window.getComputedStyle(
        el[0], prop
    ).getPropertyValue(val);

    return ret;
}

function ieCheck() {

    var myNav = navigator.userAgent.toLowerCase(),
        html = document.documentElement;

    if ((myNav.indexOf('msie') != -1)) {
        ie = ((myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false);
        html.className += ' mustdie';
        html.className += ' ie' + ie;
    } else if (!!myNav.match(/trident.*rv\:11\./)) {
        ie = 11;
        html.className += ' ie' + ie;
    }

    if (myNav.indexOf('safari') != -1) {
        if (myNav.indexOf('chrome') == -1) {
            html.className += ' safari';
        } else {
            html.className += ' chrome';
        }
    }

    if (myNav.indexOf('firefox') != -1) {
        html.className += ' firefox';
    }

    if ((myNav.indexOf('windows') != -1)) {
        html.className += ' windows';
    }
}

function setSectionBS() {
    var section = $('.slide_section');

    //console.log(section.attr('data-bs'), section);

    section.each(function () {
        var sctn = $(this);
        if (!sctn.hasClass('noBS')) {
            sctn.backstretch(getBSImg(sctn), {fade: 0});
        }
    });
}

function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}

function fitSectionH() {

    var screen = wnd.width(), scrollBar = getScrollbarWidth();

    if (screen >= (768 - scrollBar) && screen < (1265 - scrollBar)) {
        html.css('fontSize', '5px');
    } else {
        html.css('fontSize', '10px');
    }

    var section = $('.slide_section');

    section.each(function () {
        $(this).find('.section_table').css('height', Math.max(490, wnd.height()));
    });
}

function getBSImg(el) {

    if (wnd.width() < 768 && el.attr('data-bs-320') != void 0) {
        return el.attr('data-bs-320');
    }

    if (wnd.width() < 1024 && el.attr('data-bs-768') != void 0) {
        return el.attr('data-bs-768');
    }

    return el.attr('data-bs');
}

$(window).on('load', function () {
    if (ie < 9) return;

    //initMainSlider();

    //fitMainSlider();

    setSectionBS();

    fitSectionH();

}).on('resize', function () {
    if (ie < 9) return;

    //fitMainSlider();

    //setSectionBS();

    fitSectionH();

}).on('scroll', function () {
    if (ie < 9) return;

    if (!scrolling) {

        setTimeout(function () {
            var activeSctn = 0, sctn = $('.slide_section');

            for (var i = 0; i < sctn.length; i++) {
                if (doc.scrollTop() >= $(sctn[i]).offset().top) {
                    activeSctn = i;
                    continue;
                }
            }

            $('.menuLink[href=#' + $(sctn[activeSctn]).attr('id') + ']').parent().addClass('active').siblings().removeClass('active');
        }, 10);
    }

});

function initGallery() {

    $('.gallerySlider').slick({
        dots: true,
        mobileFirst: true,
        centerMode: false,
        infinite: false,
        arrows: false,
        //variableWidth: true,
        speed: 600,
        zIndex: 1,
        initialSlide: 0,
        //centerPadding: '0',
        slide: '.gal_slide',
        //appendDots: sld.parent().find('.slider_dots'),
        slidesToShow: 1,
        touchThreshold: 10,
        //asNavFor: sld.prevAll('.popupObjectSlider').first(),
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToScroll: 3,
                    slidesToShow: 3
                }
            }
        ]
    });

    $('.dishSlider').slick({
        dots: true,
        mobileFirst: true,
        centerMode: false,
        infinite: false,
        arrows: false,
        //variableWidth: true,
        speed: 600,
        zIndex: 1,
        initialSlide: 0,
        //centerPadding: '0',
        slide: '.dish_li',
        //appendDots: sld.parent().find('.slider_dots'),
        slidesToShow: 1,
        slidesToScroll: 1,
        touchThreshold: 10,
        //asNavFor: sld.prevAll('.popupObjectSlider').first(),
        responsive: [
            {
                breakpoint: 767,
                settings: "unslick"
            }
        ]
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

