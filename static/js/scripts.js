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
            right: `${35 - x}px`,
            top: `${35 - y}px`,
            transform: 'translate(50%, -50%) rotate(45deg)'
        });
    });
}

// Show All Projects
function showAllProjects() {
    $('#projects-all').removeClass('hidden');
    $('#projects-by-category').addClass('hidden');
}

// Show Projects by Category
function showProjectsByCategory() {
    $('#projects-all').addClass('hidden');
    $('#projects-by-category').removeClass('hidden');
}

// Sort Projects
function sortProjects(sortFunction) {
    // Fetch projects data and sort them
    let sortedProjects = JSON.parse(JSON.stringify(window.projectsData));
    sortedProjects.sort(sortFunction);

    // Render sorted projects
    renderProjects(sortedProjects);
}

function sortByDate(a, b) {
    return new Date(a.released_at) - new Date(b.released_at);
}

function sortByName(a, b) {
    return a.title.localeCompare(b.title);
}

function renderProjects(projects) {
    const allProjectsContainer = $("#projects-all .row");
    allProjectsContainer.empty();

    projects.forEach((project) => {
        const projectTile = `
            <div class="col-lg-4 col-md-6 col-sm-12 project-tile">
                <img src="${project.image}" alt="${project.title}" data-speed="0.1">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
            </div>`;
        allProjectsContainer.append(projectTile);
    });
}


$(document).ready(function () {
    $(window).scroll(function () {
        let scrollPos = $(this).scrollTop();

        $('.project-tile img').each(function () {
            let parallaxSpeed = $(this).data('speed');
            $(this).css('transform', 'translateY(' + scrollPos * parallaxSpeed + 'px)');
        });
    });

    positionSocialLinksInArc(300, 180, 270);

    // Event Listeners
    $('#all-projects-btn').on('click', function(e) {
        showAllProjects();
        e.preventDefault();
    });
    $('#by-category-btn').on('click', function(e) {
        showProjectsByCategory();
        e.preventDefault();
    });
    $('#sort-date').on('click', function (e) {
        sortProjects(sortByDate);
        e.preventDefault();
    });
    $('#sort-name').on('click', function (e) {
        sortProjects(sortByName);
        e.preventDefault();
    });
});
