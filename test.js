
document.addEventListener("DOMContentLoaded", () => {
    const mainDiameter = 2700;
    const ratio = -0.08;
    const sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', () => {
        document.querySelector(':root').style.setProperty('--rotation', `${(window.scrollY * ratio) % 360}deg`)

        if (window.scrollY >= document.querySelector('body').clientHeight * 0.8) {
            document.querySelector('body').style.height = window.scrollY * 1.5 + 'px'
        }
    })

    window.onhashchange = () => {
        if (window.innerWidth > 1000) {
            const target = document.querySelector(location.hash);
            const i = parseInt(target.getAttribute('data-i'));

            const fullRotation = Math.PI * mainDiameter / 2 * 1.055;
            window.scrollTo(0, fullRotation + (Math.PI * mainDiameter / 2 * (i / sections.length) * 1.071))
        }
    }

    if (window.innerWidth > 1000) {
        if (location.hash) {
            const target = document.querySelector(location.hash);
            const i = parseInt(target.getAttribute('data-i'));

            const fullRotation = Math.PI * mainDiameter / 2 * 1.055;
            window.scrollTo(0, fullRotation + (Math.PI * mainDiameter / 2 * (i / sections.length) * 1.071))
        }
    }

    // add mouse over event to each section
    sections.forEach((section, i) => {
        if (!section.classList.contains('section--chapter')) {
            section.onmouseover = () => {
                const id = section.getAttribute('id');

                document.querySelector(`a[href="#${id}"]`).classList.add('hovered')
            }

            section.onmouseleave = () => {
                const id = section.getAttribute('id');

                document.querySelector(`a[href="#${id}"]`).classList.remove('hovered')
            }
        }
    })

    document.querySelectorAll('iframe').forEach(iframe => {
        iframe.style.display = 'block';
    })
})