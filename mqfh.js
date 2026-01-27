// mqfh.js - DEBUG VERSION (Shows Popup Every Time + Formspree Working)

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 100);
    }
});

// Scroll to Top Logic
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Reveal Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate').forEach(el => {
    observer.observe(el);
});


// --- POPUP & FORMSPREE LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('launchPopup');
    const closeBtn = document.getElementById('closePopup');
    const launchForm = document.getElementById('launchForm');

    // ==========================================
    // 1. POPUP TRIGGER (MODIFIED FOR TESTING)
    // ==========================================

    // We removed the "localStorage" check so it ALWAYS shows.
    // It will appear 1 second after page load.

    setTimeout(() => {
        if (popup) {
            popup.classList.add('show');
            console.log("Popup forced to show!");
        } else {
            console.error("Popup element not found. Check ID 'launchPopup' in HTML.");
        }
    }, 1000);

    // ==========================================
    // 2. CLOSE FUNCTION
    // ==========================================
    const closeModal = () => {
        if (popup) popup.classList.remove('show');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close if clicking on the dark background (outside the card)
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) closeModal();
        });
    }

    // ==========================================
    // 3. FORMSPREE SUBMISSION LOGIC
    // ==========================================
    if (launchForm) {
        launchForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Stop page reload

            const btn = launchForm.querySelector('button');
            const originalText = btn.innerText;
            const formData = new FormData(launchForm);

            // Change button to "Sending..."
            btn.innerText = 'Sending...';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            // Send data to Formspree using AJAX (Fetch)
            fetch(launchForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // SUCCESS: Turn button Green & Change Text
                    btn.innerText = 'Subscribed!';
                    btn.style.background = '#25D366'; // WhatsApp Green
                    btn.style.opacity = '1';
                    launchForm.reset();

                    // Close popup automatically after 2 seconds
                    setTimeout(() => {
                        closeModal();
                        // Reset button style for next time
                        setTimeout(() => {
                            btn.innerText = originalText;
                            btn.style.background = '';
                            btn.disabled = false;
                        }, 500);
                    }, 2000);
                } else {
                    // ERROR (Server side)
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            btn.innerText = 'Error!';
                            btn.style.background = '#dc3545'; // Red
                        }
                    });
                    resetButton(btn, originalText);
                }
            }).catch(error => {
                // ERROR (Network)
                console.error('Error:', error);
                btn.innerText = 'Net Error';
                btn.style.background = '#dc3545';
                resetButton(btn, originalText);
            });
        });
    }

    // Helper to reset button on error
    function resetButton(btn, originalText) {
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
            btn.disabled = false;
            btn.style.opacity = '1';
        }, 3000);
    }
});