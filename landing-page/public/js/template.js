(function ($) {
    "use strict";
    $(function () {
        $(".owl-carousel-projects").owlCarousel({
            loop: true,
            stagePadding: 100,
            margin: 20,
            nav: false,
            responsive: {
                0: {
                    items: 2,
                },
                600: {
                    items: 3,
                },
                1000: {
                    items: 4,
                },
            },
        });
        var wWidth = $(window).width();
        var menuWidth = $(".navbar-collapse").width();
        $(".navbar-toggler").click(function () {
            $(".collapsing").toggleClass("show");
            $("body").addClass("sidebar-overlay");
        });
        $("#mobile-menu-overlay, .close-menu, .nav-link").click(function () {
            $(".collapse").toggleClass("show");
            $("body").removeClass("sidebar-overlay");
        });

        $("a.nav-link").on("click", function (event) {
            if (this.hash !== "") {
                event.preventDefault();
                var hash = this.hash;
                $("html, body").animate(
                    {
                        scrollTop: $(hash).offset().top,
                    },
                    800,
                    function () {
                        window.location.hash = hash;
                    }
                );
            }
        });

        AOS.init({
            offset: 0,
            duration: 800,
            easing: "ease-in-quad",
            delay: 100,
        });

        $("#testimonial-flipster").flipster({
            style: "coverflow",
            spacing: -0.9,
            nav: false,
            loop: true,
            buttons: false,
        });

        $(".flipster-custom-nav-link").click(function () {
            var navlinkSelected = parseInt(this.title);
            $(".flipster-custom-nav-link").removeClass("active");
            $(this).addClass("active");
            $("#testimonial-flipster").flipster("jump", navlinkSelected);
        });

        // $("#toggle-switch").click(function () {
        //     if ($("#toggle-switch").is(":checked")) {
        //         $(".monthly").addClass("text-active");
        //         $(".yearly").removeClass("text-active");
        //         $("#toggle-switch").attr("checked", "checked");
        //     } else {
        //         $(".monthly").removeClass("text-active");
        //         $(".yearly").addClass("text-active");
        //         $("#toggle-switch").removeAttr("checked");
        //     }
        // });

        // counter Satisfied clients
        // var maxScVal = 97;
        // var isc = parseInt($(".scVal").text());
        // var tim;
        // function run() {
        //     tim = setInterval(function () {
        //         if (isc >= maxScVal) {
        //             clearInterval(tim);
        //             return;
        //         }
        //         $(".scVal").text(++isc);
        //     }, 100);
        // }
        // run();
        // //Counters

        // // counter finished Projects
        // var maxfPVal = 1000;
        // var ifP = parseInt($(".fpVal").text());
        // var timfP;
        // function runfP() {
        //     timfP = setInterval(function () {
        //         if (ifP >= maxfPVal) {
        //             clearInterval(timfP);
        //             return;
        //         }
        //         $(".fpVal").text(++ifP);
        //     }, 1);
        // }
        // runfP();
        // //finished Projects

        // //counter Team Members
        // var maxtMVal = 125;
        // var itm = parseInt($(".tMVal").text());
        // var timtM;
        // function runtM() {
        //     timtM = setInterval(function () {
        //         if (itm >= maxtMVal) {
        //             clearInterval(timtM);
        //             return;
        //         }
        //         $(".tMVal").text(++itm);
        //     }, 100);
        // }
        // runtM();
        // //Team Members

        // //counter blog post
        // var maxbPVal = 10;
        // var ibP = parseInt($(".bPVal").text());
        // var timbP;
        // function runbP() {
        //     timbP = setInterval(function () {
        //         if (ibP >= maxbPVal) {
        //             clearInterval(timbP);
        //             return;
        //         }
        //         $(".bPVal").text(++ibP);
        //     }, 1);
        // }
        // runbP();
        // //blog post
    });
})(jQuery);
