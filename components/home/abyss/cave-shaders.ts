export const caveVertex = /* glsl */ `
  varying vec3 positionInCave;
  varying vec3 rockNormal;
  varying vec2 rockUv;
  void main() {
    positionInCave = position;
    rockNormal = normal;
    rockUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const caveFragment = /* glsl */ `
  uniform sampler2D rock;
  uniform float time;
  uniform float descent;
  varying vec3 positionInCave;
  varying vec3 rockNormal;
  varying vec2 rockUv;
  void main() {
    vec3 p = positionInCave;
    vec3 groove = vec3(.09*sin(p.z*17.+p.y*8.), .13*sin(p.y*38.+p.z*13.), .07*cos(p.x*20.+p.z*10.));
    vec3 n = normalize(rockNormal + groove);
    vec3 inward = gl_FrontFacing ? n : -n;
    vec3 lightDirection = normalize(vec3(1.9 + .14 * sin(time * .55), 1.8, -8.4) - p);
    vec3 viewDirection = normalize(cameraPosition - p);
    float face = abs(dot(inward, lightDirection));
    float laminatedShadow = smoothstep(-.85, .35, sin(p.y * 12.0 + p.z * 3.2 + sin(p.x * 4.0)));
    float oblique = pow(max(0.0, dot(inward, normalize(vec3(-.5, .7, .22)))), 2.0);
    float rim = pow(1.0 - abs(dot(inward, viewDirection)), 2.6);
    vec2 grain = vec2(rockUv.x * 4.7 + .04 * sin(p.z * 2.5), rockUv.y * 5.3 + rockUv.x * .2);
    vec3 detail = texture2D(rock, fract(grain)).rgb;
    float textureValue = dot(detail, vec3(.2126, .7152, .0722));
    float bands = pow(.5 + .5 * sin(p.y * 9.5 + p.z * 2.2 + sin(p.x * 2.3) * 2.1), 4.0);
    float finer = .5 + .5 * sin(p.x * 21.0 + p.y * 27.0 + p.z * 12.5 + sin(p.z * 13.0));
    float distanceIn = length(p - cameraPosition);
    float fog = 1.0 - exp(-max(0.0,distanceIn-3.8)*(.035+descent*.035));
    float spill = max(0.0, 1.0 - length(vec2(p.x - 1.5, p.y) * vec2(.22, .31)));
    float calcite = pow(max(0., sin(p.y * 15. + p.z * 5. - sin(p.x * 7.) * .42)), 19.);
    vec3 pigment = mix(vec3(.005, .007, .010), vec3(.235, .229, .214), clamp(textureValue * 2.62 + bands * .10 + finer * .03, 0.0, 1.0));
    pigment += vec3(.075,.067,.052) * calcite * smoothstep(.1,.78,textureValue);
    vec3 stone = pigment * (.105 + face*.64 + rim*.23) * (.54 + laminatedShadow*.46);
    float damp = (1.-smoothstep(-1.25,.1,p.y)) * (1.-bands*.4);
    float reflected = pow(max(0.,dot(reflect(-lightDirection,inward),viewDirection)),18.);
    stone += reflected * damp * vec3(.065,.085,.092);
    stone += vec3(.018, .051, .065) * spill * (.48 + face * .46 + descent * .29) * (.95 + .05 * sin(time * .9));
    stone += vec3(.17,.095,.047) * oblique * (1.0 - fog) * (.40 + bands * .60);
    stone += vec3(.007, .014, .019) * rim;
    float vault = exp(-abs(p.x*.68+p.y*.36-1.15)*1.8) * smoothstep(-25.,-8.,p.z);
    stone += vec3(.028,.037,.035)*vault*(.45+.55*face)*(1.-descent*.62);
    vec3 grading = mix(vec3(.009,.023,.033),vec3(.006,.015,.023),descent);
    gl_FragColor = vec4(mix(stone, grading, fog*.77), 1.0);
    #include <colorspace_fragment>
  }
`;

export const shaftFragment = /* glsl */ `
  uniform float time;
  varying vec2 rockUv;
  void main() {
    vec2 p = rockUv - vec2(.5);
    float face = exp(-abs(p.x + p.y * .29 + sin(time * .38) * .08) * 9.0);
    float fade = smoothstep(0.0, .32, rockUv.y) * (1.0 - smoothstep(.48, 1.0, rockUv.y));
    float alpha = face * fade * (.19 + .019*sin(rockUv.y*23.+time*.2));
    gl_FragColor = vec4(.77,.52,.29,alpha);
  }
`;

export const moteVertex = /* glsl */ `
  uniform float time;
  uniform float pixelRatio;
  varying float brightness;
  void main() {
    vec3 point = position;
    float offset = point.x * 4.0 + point.z * 3.0;
    point.x += sin(time * .29 + offset) * .19;
    point.y += cos(time * .23 + offset) * .16;
    brightness = .26 + (.5 + .5 * sin(time * .7 + offset)) * .52;
    vec4 viewPoint = modelViewMatrix * vec4(point, 1.0);
    gl_Position = projectionMatrix * viewPoint;
    gl_PointSize = pixelRatio * clamp(18.0 / -viewPoint.z, 1.2, 3.1);
  }
`;

export const moteFragment = /* glsl */ `
  varying float brightness;
  void main() {
    float glow = 1.0 - smoothstep(.06, .49, length(gl_PointCoord - .5));
    gl_FragColor = vec4(.65,.75,.81,glow*brightness*.49);
  }
`;
