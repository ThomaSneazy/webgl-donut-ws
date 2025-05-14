import './styles/style.css'

console.log('HELLO boiler')

const canvas = document.getElementById('webgl-canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl');
if (!gl) {
  alert('WebGL non supporté');
}

// Vertex shader source
const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0, 1);
}
`;

// Fragment shader source
const fragmentShaderSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv = uv * 2.0 - 1.0;
    uv.y = -uv.y;

    // Paramètres du donut
    float outerRadius = 0.9;
    float innerRadius = 0.6;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // Masque pour demi-donut (angle entre -PI et 0)
    float inAngle = step(-3.14159, angle) * step(angle, 0.0);
    float inRadius = smoothstep(innerRadius, innerRadius + 0.08, r) * (1.0 - smoothstep(outerRadius - 0.08, outerRadius, r));
    float mask = inAngle * inRadius;

    // Dégradé le long de l'anneau (par angle)
    float t = (angle + 3.14159) / 3.14159;
    vec3 color1 = vec3(0.2, 0.8, 1.0);
    vec3 color2 = vec3(0.8, 0.9, 0.2);
    vec3 color = mix(color1, color2, t);

    // Glow doux (plus lumineux au centre du donut)
    float glow = smoothstep(innerRadius, innerRadius + 0.15, r) * (1.0 - smoothstep(outerRadius - 0.15, outerRadius, r));
    color += vec3(0.2, 0.3, 0.1) * glow * 0.7;

    // Grain subtil
    float grain = (random(uv * u_time) - 0.5) * 0.08;

    // Alpha doux pour le fondu
    float alpha = mask * 0.7 + glow * 0.3;

    gl_FragColor = vec4(color + grain, alpha);
}
`;

// Création des shaders
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// Création du programme
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  return program;
}

const program = createProgram(gl, vertexShader, fragmentShader);

// Création du buffer de positions (2 triangles pour couvrir tout l'écran)
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1,
  ]),
  gl.STATIC_DRAW
);

// Utilisation du programme
gl.useProgram(program);

// Attribut de position
const positionLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Uniforme de résolution
const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

// Uniforme de temps
const timeLocation = gl.getUniformLocation(program, "u_time");
gl.uniform1f(timeLocation, Date.now() / 1000);

// Dessin
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 6);




// import './styles/style.css'

// console.log('HELLO boiler')
// import gsap from 'gsap'



//   document.addEventListener('DOMContentLoaded', function() {
//     // Définir les couleurs à animer
//     const colors = [
//       { top: "rgb(35, 0, 176)", middle: "rgb(1, 131, 253)" },      // Bleu
//       { top: "rgb(0, 80, 255)", middle: "rgb(100, 180, 255)" },    // Bleu clair
//       { top: "rgb(0, 150, 50)", middle: "rgb(20, 220, 100)" },     // Vert
//       { top: "rgb(200, 200, 0)", middle: "rgb(255, 255, 0)" },     // Jaune
//       { top: "rgb(255, 100, 0)", middle: "rgb(255, 150, 50)" },    // Orange
//       { top: "rgb(130, 0, 200)", middle: "rgb(180, 80, 255)" },    // Violet
//     ];

//     // Sélectionner l'élément à animer
//     const donut = document.querySelector('.demi-donut');
    
//     // Configuration de l'animation
//     let currentIndex = 0;
    
//     // Fonction pour mettre à jour le dégradé
//     function updateGradient() {
//       const nextIndex = (currentIndex + 1) % colors.length;
      
//       gsap.to(donut, {
//         duration: 3,  // Durée de la transition en secondes
//         ease: "power2.inOut",  // Easing (slow start and end)
//         onUpdate: function() {
//           // Interpolation entre les couleurs actuelles et suivantes
//           const progress = this.progress();
          
//           // Mélange des couleurs actuelles avec les suivantes
//           const topColor = interpolateColor(colors[currentIndex].top, colors[nextIndex].top, progress);
//           const middleColor = interpolateColor(colors[currentIndex].middle, colors[nextIndex].middle, progress);
          
//           // Application du nouveau dégradé
//           donut.style.backgroundImage = `linear-gradient(176deg, ${topColor}, ${middleColor} 49%, black 75%)`;
//         },
//         onComplete: function() {
//           // Passer à la couleur suivante
//           currentIndex = nextIndex;
//           // Continuer l'animation
//           updateGradient();
//         }
//       });
//     }
    
//     // Fonction pour interpoler entre deux couleurs RGB
//     function interpolateColor(color1, color2, factor) {
//       // Extraire les composantes RGB
//       const r1 = parseInt(color1.match(/\d+/g)[0]);
//       const g1 = parseInt(color1.match(/\d+/g)[1]);
//       const b1 = parseInt(color1.match(/\d+/g)[2]);
      
//       const r2 = parseInt(color2.match(/\d+/g)[0]);
//       const g2 = parseInt(color2.match(/\d+/g)[1]);
//       const b2 = parseInt(color2.match(/\d+/g)[2]);
      
//       // Interpoler les valeurs
//       const r = Math.round(r1 + factor * (r2 - r1));
//       const g = Math.round(g1 + factor * (g2 - g1));
//       const b = Math.round(b1 + factor * (b2 - b1));
      
//       return `rgb(${r}, ${g}, ${b})`;
//     }
    
//     // Animation de mouvement vertical
//     gsap.to(donut, {
//         y: -20,           // Déplacement de 20 pixels vers le haut
//         duration: 2,      // Durée de 2 secondes
//         ease: "power1.inOut",  // Type d'animation fluide
//         yoyo: true,       // Retour à la position initiale
//         repeat: -1        // Répétition infinie
//     });
    
//     // Démarrer l'animation
//     updateGradient();
//   });
