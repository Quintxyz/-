let move_speed = 2, grativy = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
// ลบตัวแปรเสียง
// let sound_point = new Audio('sounds effect/point.mp3');
// let sound_die = new Audio('sounds effect/die.mp3');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

// เพิ่มการแจ้งเตือนก่อนเริ่มเกม
showPreGameAlert();

function showPreGameAlert() {
    const alertBox = document.createElement('div');
    alertBox.classList.add('message', 'messageStyle');
    alertBox.innerHTML = 'ทำคะแนนให้ได้ 10 คะแนนเพื่อรับของรางวัล!<br><br>คลิกที่หน้าจอเพื่อเริ่มเล่น';
    document.body.appendChild(alertBox);
    message.style.display = 'none'; // ซ่อนข้อความเดิม
}

// เปลี่ยนจากการกด Enter เป็นคลิกที่หน้าจอ
document.addEventListener('click', () => {
    if (game_state !== 'Play') {
        // ลบ alert box ก่อนเริ่มเกม
        const alertBox = document.querySelector('.message.messageStyle');
        if (alertBox) {
            alertBox.remove();
        }
        
        document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        message.style.display = 'block'; // แสดงข้อความอีกครั้ง
        play();
    }
});

function play() {
    function move() {
        if (game_state !== 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (
                    bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    bird_props.left + bird_props.width > pipe_sprite_props.left &&
                    bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    bird_props.top + bird_props.height > pipe_sprite_props.top
                ) {
                    game_state = 'End';
                    message.innerHTML = 'UFO Crashed! <br>คลิกที่หน้าจอเพื่อเล่นอีกครั้ง';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    // ลบเสียง
                    // sound_die.play();
                    return;
                } else {
                    if (
                        pipe_sprite_props.right < bird_props.left &&
                        pipe_sprite_props.right + move_speed >= bird_props.left &&
                        element.increase_score === '1'
                    ) {
                        score_val.innerHTML = +score_val.innerHTML + 1;
                        // ลบเสียง
                        // sound_point.play();
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    function apply_gravity() {
        if (game_state !== 'Play') return;
        bird_dy += grativy;

        document.addEventListener('click', () => {
            img.src = 'img/UFO.png';
            bird_dy = -7.6; // เมื่อคลิกให้ UFO ขึ้นไป
        });

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            game_state = 'End';
            message.innerHTML = 'UFO Crashed! <br>คลิกที่หน้าจอเพื่อเล่นอีกครั้ง';
            message.classList.add('messageStyle');
            img.style.display = 'none';
            // ลบเสียง
            // sound_die.play();
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;
    let pipe_gap = 60;

    function create_pipe() {
        if (game_state !== 'Play') return;

        if (pipe_seperation > 115) {
            pipe_seperation = 0;
            let pipe_posi = Math.floor(Math.random() * 43) + 8;

            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.height = (pipe_posi + 10) + 'vh';
            pipe_sprite_inv.style.top = (pipe_posi - 40) + 'vh';
            pipe_sprite_inv.style.left = '100vw';
            pipe_sprite_inv.style.backgroundColor = '#00ffcc';
            pipe_sprite_inv.style.width = '120px';
            document.body.appendChild(pipe_sprite_inv);

            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.height = (100 - pipe_posi - pipe_gap) + 'vh';
            pipe_sprite.style.top = (pipe_posi + pipe_gap) + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';
            pipe_sprite.style.backgroundColor = '#00ffcc';
            pipe_sprite.style.width = '120px';
            document.body.appendChild(pipe_sprite);
        }

        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
