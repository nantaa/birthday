document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('js-envelope');
    const heartsLayer = document.getElementById('js-hearts');
    const framesLayer = document.getElementById('js-frames');
    const doodlesLayer = document.getElementById('js-doodles');
    const replayBtn = document.getElementById('js-replay');
    let hintText = document.getElementById('js-hint');

    // Re-create the hint text if it was accidentally removed from HTML
    if (!hintText) {
        hintText = document.createElement('p');
        hintText.id = 'js-hint';
        hintText.className = 'hint';
        hintText.innerText = 'Tap the envelope to open your letter 💌';

        const controlsDiv = document.querySelector('.controls');
        if (controlsDiv) {
            controlsDiv.insertBefore(hintText, controlsDiv.firstChild);
        }
    }

    const instructionText = document.getElementById('js-instruction');

    // New Elements
    const introOverlay = document.getElementById('envelope-overlay');
    const bgMusic = new Audio('assets/audio/Selamat Ulang Tahun.mp3');
    const audioBtn = document.getElementById('btn-audio');
    const easterEggTrigger = document.getElementById('js-easter-egg');
    const secretPhoto = document.getElementById('js-secret-photo');
    const quizLayer = document.getElementById('js-quiz-layer');
    const gratitudeForm = document.getElementById('js-gratitude-form');

    let isOpen = false;
    let quizzesSolved = 0;

    // Show audio button immediately since intro is removed
    if (audioBtn) {
        audioBtn.hidden = false;
    }

    // 3. Music Toggle & Auto-play Logic
    const attemptAutoPlay = () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                if (audioBtn) audioBtn.textContent = 'Pause music ♪';
            }).catch(e => {
                console.log("Browser auto-play prevented. Waiting for user interaction.");
            });
        }
    };

    // Try playing immediately
    attemptAutoPlay();

    // Browser might block auto-play without user interaction, so we listen to the first interaction
    document.addEventListener('click', attemptAutoPlay, { once: true });
    document.addEventListener('touchstart', attemptAutoPlay, { once: true });

    if (audioBtn) {
        audioBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent document click from triggering if they click the button directly
            if (bgMusic.paused) {
                bgMusic.play().catch(e => console.log("Audio play failed:", e));
                audioBtn.textContent = 'Pause music ♪';
            } else {
                bgMusic.pause();
                audioBtn.textContent = 'Play song ♪';
            }
        });
    }

    // 4. Easter Egg
    if (easterEggTrigger && secretPhoto) {
        easterEggTrigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent letter from closing
            secretPhoto.classList.toggle('revealed');
        });
    }

    // Initialize Doodles
    createDoodles();

    // Raining love on cursor move
    document.addEventListener('mousemove', handleCursorMove);

    // Open envelope action
    envelope.addEventListener('click', () => {
        if (!isOpen) {
            openEnvelope();
        }
    });

    // Replay action
    replayBtn.addEventListener('click', () => {
        closeEnvelope();
    });

    function openEnvelope() {
        isOpen = true;

        // Add open class which triggers CSS transitons
        envelope.classList.add('is-open');

        // Handle music (if they opted in via button already, let it play, else maybe auto try)
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                audioBtn.textContent = 'Pause music ♪';
            }).catch(e => console.log("Auto-play prevented"));
        }

        // Create flying hearts effect
        createHearts();

        // Create scattering frames effect
        scatterFrames();

        // UI adjustments
        if (hintText) {
            hintText.hidden = true;
            hintText.style.display = 'none';
        }

        // Show buttons gently after animation starts to finish
        setTimeout(() => {
            replayBtn.hidden = false;
            instructionText.hidden = false;

            const saySomethingBtn = document.getElementById('js-say-something');
            if (saySomethingBtn) saySomethingBtn.hidden = false;

            // Reveal quiz
            if (quizLayer) quizLayer.hidden = false;
        }, 1200);
    }

    function closeEnvelope() {
        isOpen = false;

        // Remove open class
        envelope.classList.remove('is-open');

        // Pause song but don't reset unless you want to
        // bgMusic.pause();
        // audioBtn.textContent = 'Play our song ♪';

        // UI adjustments
        replayBtn.hidden = true;
        instructionText.hidden = true;

        const saySomethingBtn = document.getElementById('js-say-something');
        if (saySomethingBtn) saySomethingBtn.hidden = true;

        // Hide features
        if (quizLayer) quizLayer.hidden = true;
        if (gratitudeForm) gratitudeForm.hidden = true;

        // Let it settle before showing hint again
        setTimeout(() => {
            if (hintText) {
                hintText.hidden = false;
                hintText.style.display = '';
            }
        }, 800);

        // Clear hearts
        heartsLayer.innerHTML = '';

        // Clear frames
        if (framesLayer) {
            framesLayer.innerHTML = '';
        }
    }

    function createHearts() {
        // Number of hearts to generate
        const heartCount = 15;

        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');

            // Randomize position and animation delay
            const randomLeft = Math.floor(Math.random() * 100); // 0 to 100% width
            const randomDelay = Math.random() * 0.5; // 0 to 0.5s delay
            const randomScale = 0.5 + Math.random() * 0.7; // 0.5 to 1.2

            heart.style.left = `${randomLeft}%`;
            heart.style.animationDelay = `${randomDelay}s`;
            // Using transform scale on variable wasn't fully set up in my keyframe easily since the keyframe manages it.
            // Simplified custom variable for keyframes if we wanted, but let's stick to inline style tweak.
            heart.style.setProperty('--scale-factor', randomScale);

            heartsLayer.appendChild(heart);

            // Remove from DOM after animation completes to keep it clean (3s duration + max delay)
            setTimeout(() => {
                if (heartsLayer.contains(heart)) {
                    heart.remove();
                }
            }, 3500);
        }
    }

    function scatterFrames() {
        if (!framesLayer) return;

        // Target positions based on viewport center, and placeholder image arrays
        const frameTargets = [
            { tx: -35, ty: -35, rot: -15, img: 'assets/img/6156929352642269386.jpg' }, // Top left
            { tx: -35, ty: 30, rot: 10, img: 'assets/img/6169946256055144015.jpg' },  // Bottom left
            { tx: 35, ty: -35, rot: 20, img: 'assets/img/6156929352642269388.jpg' },  // Top right
            { tx: 40, ty: 0, rot: 30, img: 'assets/img/photo.jpg' },   // Middle right
            { tx: 30, ty: 35, rot: -10, img: 'assets/img/6169946256055144014.jpg' }   // Bottom right
        ];

        frameTargets.forEach((target, index) => {
            const frame = document.createElement('div');
            frame.classList.add('scatter-frame');

            // Allow polaroid style frame behind it, and the image nested nicely inside
            const innerPhoto = document.createElement('div');
            innerPhoto.classList.add('scatter-photo');
            innerPhoto.style.backgroundImage = `url("${target.img}")`;

            frame.appendChild(innerPhoto);

            framesLayer.appendChild(frame);

            // Trigger reflow to ensure the transition works from the starting scale(0.1)
            void frame.offsetWidth;

            // Add scatter class and final transform with a slight stagger
            setTimeout(() => {
                frame.style.transform = `translate(calc(-50% + ${target.tx}vw), calc(-50% + ${target.ty}vh)) rotate(${target.rot}deg) scale(1)`;
                frame.classList.add('is-scattered');
            }, 100 * index + 300); // Stagger animations
        });
    }

    function handleCursorMove(e) {
        // Create a love particle every few pixels to avoid lagging
        if (Math.random() > 0.3) return;

        const love = document.createElement('div');
        love.classList.add('cursor-love');
        // Randomize the character (hearts, stars, etc)
        const characters = ['❤', '💕', '💖', '💗', '💘', '✨'];
        love.innerText = characters[Math.floor(Math.random() * characters.length)];

        love.style.left = `${e.clientX}px`;
        love.style.top = `${e.clientY}px`;

        document.body.appendChild(love);

        // Remove after animation (1s)
        setTimeout(() => {
            love.remove();
        }, 1000);
    }

    function createDoodles() {
        if (!doodlesLayer) return;

        // Clear existing doodles
        doodlesLayer.innerHTML = '';

        const numDoodles = 12; // slightly reduced to give more breathing room
        const doodleTexts = ['Love', 'Forever', '❤', 'Happy', 'Smile', 'Joy', '23', '🎉', 'Cutie', 'Beautiful', 'Gorgeous', 'Lovely', 'Stunning', 'Pretty', 'Angel'];

        // Track positions to prevent overlap
        const placedPositions = [];
        const minDistance = 15; // minimum distance in viewport units (vw/vh)

        // Helper to check distance
        function isTooClose(x, y) {
            for (let pos of placedPositions) {
                const dx = pos.x - x;
                const dy = pos.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDistance) {
                    return true;
                }
            }
            return false;
        }

        for (let i = 0; i < numDoodles; i++) {
            let left, top;
            let attempts = 0;
            const maxAttempts = 50;
            let foundGoodPosition = false;

            while (attempts < maxAttempts && !foundGoodPosition) {
                // Try generating a position around the edges
                if (Math.random() > 0.5) {
                    // Left or right side (0-20vw or 80-100vw)
                    left = Math.random() > 0.5 ? Math.random() * 20 : 80 + Math.random() * 20;
                    top = Math.random() * 100; // anywhere vertically
                } else {
                    // Top or bottom side (0-100vw, 0-20vh or 80-100vh)
                    left = Math.random() * 100;
                    top = Math.random() > 0.5 ? Math.random() * 20 : 80 + Math.random() * 20;
                }

                if (!isTooClose(left, top)) {
                    foundGoodPosition = true;
                }
                attempts++;
            }

            if (foundGoodPosition) {
                placedPositions.push({ x: left, y: top });

                const doodle = document.createElement('div');
                doodle.classList.add('doodle');
                doodle.innerText = doodleTexts[Math.floor(Math.random() * doodleTexts.length)];

                // Random rotation and size
                const rot = Math.random() * 360;
                const size = 1.2 + Math.random() * 1.5; // 1.2rem to 2.7rem

                doodle.style.left = `${left}vw`;
                doodle.style.top = `${top}vh`;
                doodle.style.transform = `rotate(${rot}deg)`;
                doodle.style.fontSize = `${size}rem`;

                doodlesLayer.appendChild(doodle);
            }
        }
    }

    // 7. Global Quiz Checker for Multiple Choice
    window.checkQuiz = function (quizId, answer, buttonElement) {
        const feedback = document.getElementById(`quiz-feedback-${quizId}`);
        const polaroid = document.getElementById(`quiz-${quizId}`);
        const photo = polaroid.querySelector('.quiz-photo');

        if (!feedback || !polaroid) return;

        // If already solved, ignore clicks
        if (polaroid.classList.contains('solved')) return;

        // Correct answers
        const correctAnswers = {
            1: 'spiderman',
            2: 'bandung'
        };

        if (answer === correctAnswers[quizId]) {
            feedback.textContent = "Correct! ✨";
            feedback.style.color = "#4CAF50";

            // Reveal Photo
            if (photo) {
                photo.classList.remove('quiz-photo-hidden');
            }

            // Mark button green
            buttonElement.style.background = "#c8e6c9";
            buttonElement.style.borderColor = "#4CAF50";

            // Mark as solved
            setTimeout(() => {
                polaroid.classList.add('solved');
                quizzesSolved++;
            }, 1200);

        } else {
            feedback.textContent = "Not quite! Try again 💖";
            feedback.style.color = "var(--accent)";

            // Mark button red temporarily
            buttonElement.classList.add('selected-wrong');

            // Shake effect
            polaroid.style.transform = polaroid.style.transform + ' translateX(5px)';
            setTimeout(() => {
                polaroid.style.transform = polaroid.style.transform.replace(' translateX(5px)', '');
                buttonElement.classList.remove('selected-wrong');
            }, 400);
        }
    }

    // 8. Minimize Button Logic
    const minimizeBtns = document.querySelectorAll('.btn-minimize');

    const handleMinimize = function (e) {
        e.preventDefault();
        e.stopPropagation(); // Stop event from bubbling up to parents
        const polaroid = this.closest('.quiz-polaroid');
        if (polaroid) {
            // Add a class that triggers CSS animation
            polaroid.classList.add('minimized');
            // Additionally ensure it cannot be clicked while minimized
            polaroid.style.pointerEvents = 'none';
        }
    };

    minimizeBtns.forEach(btn => {
        btn.addEventListener('click', handleMinimize);
        // Specifically adding touchstart for mobile devices where clicks might be delayed or blocked
        btn.addEventListener('touchstart', handleMinimize, { passive: false });
    });

    // Gmail API via Google Apps Script Webhook
    const sendEmailBtn = document.getElementById('js-send-email');
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', async () => {
            const msgInput = document.getElementById('gratitude-message');
            const msg = msgInput ? msgInput.value.trim() : '';

            if (!msg) {
                alert("Please write a small message first! 💌");
                return;
            }

            const originalText = sendEmailBtn.textContent;
            sendEmailBtn.textContent = "Sending...";
            sendEmailBtn.disabled = true;

            try {
                // To securely send an email via Gmail API from the frontend, 
                // you must deploy a Google Apps Script as a Web App (instructions provided).
                // PASTE YOUR DEPLOYED WEB APP URL BELOW:
                const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz1oMgL3Mzn2sQGgIQlQW80QxfJxrhasOXt8CgsbpjHz34dr_x2cdFPlKC8GLNrU8Rz/exec";

                if (SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
                    alert("Developer note: You need to set the SCRIPT_URL in main.js to your actual Google Apps Script Web App URL! Please read the setup instructions.");
                    return;
                }

                const formData = new URLSearchParams();
                formData.append("message", msg);

                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                alert("Message safely sent to your beloved 💌");
                if (msgInput) msgInput.value = "";

                if (typeof gratitudeForm !== 'undefined' && gratitudeForm) {
                    gratitudeForm.hidden = true;
                }

            } catch (error) {
                console.error("Fetch error:", error);
                alert("Network error while trying to send the message.");
            } finally {
                sendEmailBtn.textContent = originalText;
                sendEmailBtn.disabled = false;
            }
        });
    }

    // Simple "Say Something" button logic connects to gratitude form
    const saySomethingBtnObj = document.getElementById('js-say-something');
    if (saySomethingBtnObj && gratitudeForm) {
        saySomethingBtnObj.addEventListener('click', () => {
            gratitudeForm.hidden = !gratitudeForm.hidden;
        });
    }
});
