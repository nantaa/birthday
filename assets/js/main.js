document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('js-envelope');
    const heartsLayer = document.getElementById('js-hearts');
    const framesLayer = document.getElementById('js-frames');
    const doodlesLayer = document.getElementById('js-doodles');
    const replayBtn = document.getElementById('js-replay');
    const hintText = document.getElementById('js-hint');
    const instructionText = document.getElementById('js-instruction');
    
    let isOpen = false;
    let bgMusic = new Audio('assets/audio/Selamat Ulang Tahun.mp3');

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
        // Play song
        bgMusic.play().catch(e => console.log("Audio play failed:", e));

        // Create flying hearts effect
        createHearts();

        // Create scattering frames effect
        scatterFrames();

        // UI adjustments
        hintText.hidden = true;
        
        // Show buttons gently after animation starts to finish
        setTimeout(() => {
            replayBtn.hidden = false;
            instructionText.hidden = false;
        }, 1200);
    }

    function closeEnvelope() {
        isOpen = false;
        
        // Remove open class
        envelope.classList.remove('is-open');

        // Pause song and reset time
        bgMusic.pause();
        bgMusic.currentTime = 0;

        // UI adjustments
        replayBtn.hidden = true;
        instructionText.hidden = true;
        
        // Let it settle before showing hint again
        setTimeout(() => {
            hintText.hidden = false;
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
                if(heartsLayer.contains(heart)){
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
            { tx: -35, ty: 30, rot: 10, img: 'assets/img/6156929352642269387.jpg' },  // Bottom left
            { tx: 35, ty: -35, rot: 20, img: 'assets/img/6156929352642269388.jpg' },  // Top right
            { tx: 40, ty: 0, rot: 30, img: 'assets/img/6156929352642269389.jpg' },   // Middle right
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

        const numDoodles = 15;
        const doodleTexts = ['Love', 'Forever', '❤', 'Happy', 'Smile', 'Joy', '23', '🎉', 'Cutie'];

        for (let i = 0; i < numDoodles; i++) {
            const doodle = document.createElement('div');
            doodle.classList.add('doodle');
            doodle.innerText = doodleTexts[Math.floor(Math.random() * doodleTexts.length)];
            
            // Random position mostly around edges, not dead center
            let left, top;
            if (Math.random() > 0.5) {
                // Left or right side
                left = Math.random() > 0.5 ? Math.random() * 20 : 80 + Math.random() * 20;
                top = Math.random() * 100;
            } else {
                // Top or bottom side
                left = Math.random() * 100;
                top = Math.random() > 0.5 ? Math.random() * 20 : 80 + Math.random() * 20;
            }

            // Random rotation and size
            const rot = Math.random() * 360;
            const size = 1 + Math.random() * 2; // 1rem to 3rem

            doodle.style.left = `${left}vw`;
            doodle.style.top = `${top}vh`;
            doodle.style.transform = `rotate(${rot}deg)`;
            doodle.style.fontSize = `${size}rem`;

            doodlesLayer.appendChild(doodle);
        }
    }
});
