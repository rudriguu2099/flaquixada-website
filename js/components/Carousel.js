class Carousel extends HTMLElement {
    async connectedCallback() {
        try {
            // Busca o arquivo HTML
            const resposta = await fetch('./components_html/carousel.html');
            const htmlPuro = await resposta.text();

            // Injeta o CSS e o HTML
            this.innerHTML = `
                <link rel="stylesheet" href="./css/components/carousel.css">
                ${htmlPuro}
            `;

            // Inicializa toda a lógica do carrossel após injetar o HTML
            this.initCarousel();

        } catch (error) {
            console.error('Erro ao carregar o HTML do Carousel:', error);
        }
    }

    initCarousel() {
        const track = this.querySelector('#carousel-track');
        const indicators = this.querySelectorAll('.indicator');
        const slides = this.querySelectorAll('.carousel-slide');
        
        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoPlayTimer = null;

        // Função central para mudar de slide
        const goToSlide = (index) => {
            // Faz o carrossel ser infinito (volta pro começo ou vai pro fim)
            currentIndex = (index + totalSlides) % totalSlides;

            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            indicators.forEach((indicator, i) => {
                if (i === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        };

        const startAutoPlay = () => {
            autoPlayTimer = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 3000);
        };

        const stopAutoPlay = () => {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
        };

        startAutoPlay();


        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopAutoPlay();    // Para o tempo para não pular duas vezes seguido
                goToSlide(index);  // Vai para o slide clicado
                startAutoPlay();   // Reinicia o tempo do zero
            });
        });


        let startX = 0;
        let isDragging = false;

        const handleStart = (e) => {
            isDragging = true;
            stopAutoPlay();
            startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        };

        const handleEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;

            const endX = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
            const diffX = startX - endX; 

            const threshold = 50; 

            if (diffX > threshold) {
                goToSlide(currentIndex + 1);
            } else if (diffX < -threshold) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(currentIndex);
            }

            startAutoPlay(); // Reinicia o timer
        };

        track.addEventListener('touchstart', handleStart, { passive: true });
        track.addEventListener('touchend', handleEnd, { passive: true });

        track.addEventListener('mousedown', handleStart);
        track.addEventListener('mouseup', handleEnd);
        
        track.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                startAutoPlay();
            }
        });
    }
}

customElements.define('carousel-fla', Carousel);