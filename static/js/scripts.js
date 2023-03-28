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
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: false },
            resize: true,
        },
        modes: {
            repulse: {
                distance: 100, // Distance at which the particles will be repelled
                duration: 0.4, // The higher the value, the more "lazily" the particles will react
            },
        },
    },
    retina_detect: true,
});

function positionSocialLinksInArc(radius, startAngle, endAngle) {
    const angleRange = endAngle - startAngle;
    const numberOfLinks = $('.social-links a').length;
    const angleStep = angleRange / (numberOfLinks - 1);

    $('.social-links a').each(function (index) {
        const angle = startAngle + angleStep * index;
        const x = radius * Math.cos(angle * (Math.PI / 180));
        const y = radius * Math.sin(angle * (Math.PI / 180));

        $(this).css({
            position: 'absolute',
            right: `${50 - x}px`,
            top: `${50 - y}px`,
            transform: 'translate(50%, -50%)'
        });
    });
}
  
  
// Parallax effect
$(document).ready(function () {
    $(window).scroll(function () {
        let scrollPos = $(this).scrollTop();

        $('.project-tile img').each(function () {
            let parallaxSpeed = $(this).data('speed');
            $(this).css('transform', 'translateY(' + scrollPos * parallaxSpeed + 'px)');
        });
    });

    positionSocialLinksInArc(250, 180, 270);
});
