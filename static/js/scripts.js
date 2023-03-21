// Particle effect
particlesJS('particles-js', {
    particles: {
        number: { value: 150, density: { enable: true, value_area: 1200 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle', stroke: { width: 0, color: '#000000' }, polygon: { nb_sides: 5 } },
        opacity: { value: 0.15, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
        size: { value: 2, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
        line_linked: { enable: false },
        move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: false },
            onclick: { enable: false },
            resize: true
        }
    },
    retina_detect: true
});
  
  
// Parallax effect
$(document).ready(function () {
    $(window).scroll(function () {
        let scrollPos = $(this).scrollTop();

        $('.project-tile img').each(function () {
            let parallaxSpeed = $(this).data('speed');
            $(this).css('transform', 'translateY(' + scrollPos * parallaxSpeed + 'px)');
        });
    });
});
  