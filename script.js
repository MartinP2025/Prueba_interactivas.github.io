// Velocidad del movimiento y gravedad
let move_speed = 3, gravity = 0.5;

// Selección de elementos del DOM
let bird = document.querySelector('.bird');
let img = document.getElementById('bird'); // Debe coincidir con tu HTML

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

// --- INICIO DEL JUEGO ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && game_state !== 'Play') {
    document.querySelectorAll('.pipe_sprite').forEach((el) => el.remove());

    img.style.display = 'block';
    bird.style.top = '40vh';
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score: ';
    score_val.innerHTML = '0';
    message.classList.remove('messageStyle');
    play();
  }
});

function play() {
  let bird_dy = 0;
  let pipe_separation = 0;
  let pipe_gap = 35;

  // --- MOVIMIENTO DE LAS TUBERÍAS ---
  function move() {
    if (game_state !== 'Play') return;

    let pipe_sprite = document.querySelectorAll('.pipe_sprite');
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      // Si la tubería sale de la pantalla, eliminarla
      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        // Detección de colisión
        if (
          bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
          bird_props.left + bird_props.width > pipe_sprite_props.left &&
          bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
          bird_props.top + bird_props.height > pipe_sprite_props.top
        ) {
          game_state = 'End';
          message.innerHTML =
            '<span style="color:red;">Game Over</span><br>Press Enter to Restart';
          message.classList.add('messageStyle');
          img.style.display = 'none';
          return;
        } else {
          // Aumentar puntaje cuando el pájaro pasa una tubería
          if (
            pipe_sprite_props.right < bird_props.left &&
            element.increase_score === '1'
          ) {
            score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
            element.increase_score = '0';
          }
          element.style.left = pipe_sprite_props.left - move_speed + 'px';
        }
      }
    });

    requestAnimationFrame(move);
  }

  requestAnimationFrame(move);

  // --- GRAVEDAD Y CONTROL DEL PÁJARO ---
  function apply_gravity() {
    if (game_state !== 'Play') return;

    bird_dy += gravity;

    document.addEventListener('keydown', (e) => {
      if (game_state === 'Play' && (e.key === 'ArrowUp' || e.key === ' ')) {
        img.src = 'pinkb.png'; // Cambia por imagen de "alas arriba"
        bird_dy = -7.6;
      }
    });

    document.addEventListener('keyup', (e) => {
      if(game_state === 'Play' && (e.key === 'ArrowUp' || e.key === ' ')){
        img.src = 'pinkAlas.png'; // Cambia por imagen de "alas abajo"
      }
    });

    // Si el pájaro toca arriba o abajo
    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      game_state = 'End';
      message.innerHTML =
        '<span style="color:red;">Game Over</span><br>Press Enter to Restart';
      message.classList.add('messageStyle');
      img.style.display = 'none';
      return;
    }

    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }

  requestAnimationFrame(apply_gravity);

  // --- CREACIÓN DE LAS TUBERÍAS ---
  function create_pipe() {
    if (game_state !== 'Play') return;

    if (pipe_separation > 115) {
      pipe_separation = 0;
      let pipe_posi = Math.floor(Math.random() * 43) + 8;

      // Tubería superior
      let pipe_sprite_inv = document.createElement('div');
      pipe_sprite_inv.className = 'pipe_sprite';
      pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
      pipe_sprite_inv.style.left = '100vw';
      document.body.appendChild(pipe_sprite_inv);

      // Tubería inferior
      let pipe_sprite = document.createElement('div');
      pipe_sprite.className = 'pipe_sprite';
      pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_sprite.style.left = '100vw';
      pipe_sprite.increase_score = '1';
      document.body.appendChild(pipe_sprite);
    }

    pipe_separation++;
    requestAnimationFrame(create_pipe);
  }

  requestAnimationFrame(create_pipe);
}

