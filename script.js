document.addEventListener('DOMContentLoaded', () => {

    // --- การตั้งค่าหลัก ---
    const CORRECT_PASSWORD = "5768"; // รหัสผ่านคือ 5768
    
    // ข้อมูลสไลด์ทั้งหมด (มี 5 หน้าเท่านั้น)
    const SLIDE_DATA = [
        // ตรวจสอบว่ามีไฟล์รูปภาพ (photo-1.jpg, photo-2.jpg, ... photo-5.jpg) ในโฟลเดอร์ images/ แล้ว
        { title: "หน้า 1: รูปแรกของเรา 💖", image: "1.png", caption: "รูปนี้เป็นรูปแรกเลยที่ถ่าย เค้าคิดในใจว่าทำไมรู้จักกันวันแรกถึงอยู่ดึกขนาดนี้" },
        { title: "หน้า 2: รูปนี้คือรูปหลังจากที่เค้าเริ่มติดบี๋แล้ว", image: "2.png", caption: "เห็นไหมว่าเปลี่ยนสีผมด้วย ถึงทรงผมไม่เท่ก็เหอะๆๆ แต่ชอบสีมากกว่าทรงผม แล้วเป็นตอนที่เราถ่ายรูปด้วยกัน เริ่มเล่าที่ผ่านมาของกันเเละกัน" },
        { title: "หน้า 3: รูปนี้น่าจะเป็นตอนที่เราทะเลาะกัน😣", image: "3.png", caption: "เกือบเสียบี๋ไปแล้วเห็นไหมล่ะ ด้วยที่อารมณ์ร้อนใจร้อน แต่ขอบคุณน่ะที่ยังอยู่เคียงข้างเสมอ💙" },
        { title: "หน้า 4: หว่ายยใครจะลืมรูปนี้ๆ💍💙", image: "4.png", caption: "เขิลมากกตอนที่บอกว่าถ่ายรูปวันแต่งงาน ไม่เคยคิดจะแต่งงานเลย แล้วผู้หญิงขอผู้ชายแต่งงาน แต่สวยจริงๆ" },
        { title: "หน้า 5: สุขสันต์วันครบรอบ 5M! ✨", image: "5.png", caption: "ตั้งแต่เราเป็นแฟนกันก็ไม่เคยรักน้อยลงเลย อยากอยู่ด้วยทุกๆวันเลย แต่นั้นแหละ กลัวบี๋เบื่อความดื้อของเค้าแต่เค้าไม่เคยโกรธบี๋เลยที่บี๋ดุเค้า บี๋ก็แค่อยากให้เค้าทำในสิ่งที่เค้าทำไม่เป็น แต่อย่าพึ่งเบื่อกันได้ไหม5555 ฟังดูอาจเห็นแก่ตัว5555 แต่อยากอยู่ด้วยนานๆเลยยย ทุกๆวันของวันสำคัญ ที่บอกรักทุกวันไม่ได้บอกเพื่อให้บี๋สบายใจแต่บอกเพราะอยากให้บี๋รู้ว่ารักทุกวัน💙รักน่ะจุ๊ฟม๊วฟฟฟฟ  ❤️" }
    ];

    const NUM_SLIDES = SLIDE_DATA.length; // ระบบจะนับอัตโนมัติว่ามี 5 หน้า
    let currentPage = 1;

    // --- องค์ประกอบ DOM ---
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');
    const backgroundMusic = document.getElementById('background-music');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const pageIndicator = document.getElementById('page-indicator');
    const heartContainer = document.getElementById('heart-container');
    
    const slideContentWrapper = document.querySelector('.slide-content-wrapper');
    const slideTitle = document.getElementById('slide-title');
    const slideImage = document.getElementById('slide-image');
    const slideCaption = document.getElementById('slide-caption');
    

    // --- 1. ฟังก์ชันสร้างเอฟเฟกต์หัวใจ ---
    function createHearts() {
        const colors = ['#FF69B4', '#FF1493', '#FF00FF', '#FFB6C1', '#C71585'];
        
        for (let i = 0; i < 50; i++) { 
            const heart = document.createElement('div');
            heart.classList.add('heart');
            
            heart.style.left = `${Math.random() * 100}vw`; 
            heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]; 
            heart.style.width = heart.style.height = `${Math.random() * 1.5 + 0.5}rem`; 
            heart.style.animationDuration = `${Math.random() * 10 + 7}s`;
            heart.style.animationDelay = `${Math.random() * 5}s`; 
            
            heartContainer.appendChild(heart);
        }
    }

    // --- 2. ตรวจสอบรหัสผ่านและเริ่มหน้าหลัก ---
    if (passwordForm) {
        passwordForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const enteredCode = passwordInput.value.trim(); 

            if (enteredCode === CORRECT_PASSWORD) {
                // รหัสถูก:
                introScreen.classList.remove('active');
                mainContent.classList.add('active');
                
                // เล่นเพลงอัตโนมัติ
                if (backgroundMusic) {
                    backgroundMusic.play().catch(e => console.error("Error playing music:", e));
                }
                
                // เริ่มต้นสไลด์โชว์และเอฟเฟกต์หัวใจ
                updateSlider(currentPage);
                createHearts();
                errorMessage.textContent = ''; 

            } else {
                // รหัสผิด:
                errorMessage.textContent = 'รหัสไม่ถูกต้อง! ลองอีกครั้งนะ 🥺';
                passwordInput.value = ''; 
            }
        });
    }


    // --- 3. ฟังก์ชันควบคุมสไลด์ (พร้อมเอฟเฟกต์ Fade) ---
    function updateSlider(page) {
        if (page < 1 || page > NUM_SLIDES) return;

        // 1. ทำให้เนื้อหาปัจจุบันจางหายไป (Fade Out)
        slideContentWrapper.style.opacity = 0;

        setTimeout(() => {
            // 2. อัปเดตเนื้อหาเมื่อจางหายไปแล้ว
            currentPage = page;
            const data = SLIDE_DATA[currentPage - 1]; 

            slideTitle.textContent = data.title;
            slideImage.src = data.image;
            slideCaption.textContent = data.caption;
            pageIndicator.textContent = `หน้า ${currentPage} / ${NUM_SLIDES}`;
            
            // 3. ทำให้เนื้อหาใหม่ปรากฏขึ้น (Fade In)
            slideContentWrapper.style.opacity = 1;
        }, 500); 

    }


    // --- 4. การจัดการปุ่มควบคุม ---
    if (prevButton) {
        prevButton.addEventListener('click', () => updateSlider(currentPage - 1));
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => updateSlider(currentPage + 1));
    }
    
    // ตั้งค่าเริ่มต้นเมื่อโหลดหน้า
    updateSlider(currentPage);
});