// Custom Function
$(document).ready(function () {

  new WOW().init();

  $('#myCarousel').carousel({
  interval:   4000
	});
	
  var clickEvent = false;
  $('#site-carousel').on('click', '.nav a', function () {
    clickEvent = true;
    $('.nav li').removeClass('active');
    $(this).parent().addClass('active');
  }).on('slid.bs.carousel', function (e) {
    if (!clickEvent) {
      var count = $('.nav').children().length - 1;
      var current = $('.nav li.active');
      current.removeClass('active').next().addClass('active');
      var id = parseInt(current.data('slide-to'));
      if (count == id) {
        $('.nav li').first().addClass('active');
      }
    }
    clickEvent = false;
  });

  $('.owl-carousel').owlCarousel({
    loop: true,
    margin: 30,
    nav: true,
    autoplay: true,
    dots: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2
      },
      992: {
        items: 4
      }
    }
  });

  // Back to top button

  if ($(".js-go-top").length) {
    var scrollTrigger = 200, // px
      backToTop = function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > scrollTrigger) {
          $(".js-go-top").addClass("show");
          $('.site-menu, .site-menu-mobile').addClass("fixed-menu");
        } else {
          $(".js-go-top").removeClass("show");
          $('.site-menu, .site-menu-mobile').removeClass("fixed-menu");
        }
      };

    backToTop();
    $(window).on("scroll", function () {
      backToTop();
    });

    $(".js-go-top").on("click", function (e) {
      e.preventDefault();
      $("html,body").animate(
        {
          scrollTop: 0
        },
        1000
      );
    });
  }

  // Toggle menu mobile

  $('.js-menu-toggle').click(function () {
    $('.js-canvas-menu').addClass('side-nav-show');
    $('.overlay-mobile').addClass('d-block');
    $('body').css('overflow-y', 'hidden');
  });

  $('.js-close-menu, .overlay-mobile').click(function () {
    $('.js-canvas-menu').removeClass('side-nav-show');
    $('.overlay-mobile').removeClass('d-block');
    $('body').css('overflow-y', '');
  });

  // Change icon when click
  $('.js-change-icon').each(function () {
    $(this).on('click', function (event) {
      event.preventDefault();
      $(this).toggleClass('change-icon');
      $(this).prev().toggleClass('change-color');
    })
  })

  // Show/hide contact content
  $(".js-contact").each( function () {
    $(this).on('click', function () {
      $('.js-contact-content, .js-contact-close').toggleClass('show');
    });
  });

  $(".js-contact-close").each( function () {
    $(this).on('click', function () {
      $('.js-contact-content, .js-contact-close').toggleClass('show');
    });
  });
});
