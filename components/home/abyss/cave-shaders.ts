export const caveVertex = /* glsl */ `
  varying vec2 caveUv;
  void main() {
    caveUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const caveFragment = /* glsl */ `
  uniform sampler2D rock;
  uniform vec2 crop;
  uniform float layer;
  uniform float time;
  uniform float descent;
  varying vec2 caveUv;

  void main() {
    vec2 uv = caveUv;
    vec2 offset = (uv - vec2(0.74, 0.49)) * vec2(0.94, 1.0);
    float distanceToCore = length(offset);
    float ridge = distanceToCore + 0.014 * sin(uv.y * 19.0 + uv.x * 16.0);
    float opacity = 1.0;

    if (layer > 1.5) {
      opacity = smoothstep(0.35, 0.56, ridge) * 0.88;
    } else if (layer > 0.5) {
      opacity = smoothstep(0.15, 0.24, ridge) * (1.0 - smoothstep(0.42, 0.62, ridge)) * 0.73;
    }

    if (opacity < 0.012) discard;
    vec2 source = uv * crop + (1.0 - crop) * vec2(0.61, 0.49);
    vec3 stone = texture2D(rock, source).rgb;
    if (layer > 1.5) stone *= 0.94;

    // A soft pool of light and two moving shafts fade into the rock edge.
    float pool = (1.0 - smoothstep(0.035, 0.40, distanceToCore));
    float ray = exp(-abs(offset.x + offset.y * 0.53 - sin(time * 0.43) * 0.036) * 37.0);
    float rim = exp(-abs(offset.x - offset.y * 0.37 + 0.092) * 52.0);
    float light = pool * (0.18 + ray * 0.28 + rim * 0.12) * (0.7 + descent * 0.45);
    stone += vec3(0.030, 0.067, 0.31) * light;

    gl_FragColor = vec4(stone, opacity);
    #include <colorspace_fragment>
  }
`;

export const moteVertex = /* glsl */ `
  uniform float time;
  uniform float pixelRatio;
  varying float brightness;
  void main() {
    vec3 point = position;
    float offset = point.x * 4.0 + point.z * 3.0;
    point.x += sin(time * 0.29 + offset) * 0.19;
    point.y += cos(time * 0.23 + offset) * 0.16;
    brightness = 0.26 + (0.5 + 0.5 * sin(time * 0.7 + offset)) * 0.52;
    vec4 viewPoint = modelViewMatrix * vec4(point, 1.0);
    gl_Position = projectionMatrix * viewPoint;
    gl_PointSize = pixelRatio * clamp(11.0 / -viewPoint.z, 1.2, 3.1);
  }
`;

export const moteFragment = /* glsl */ `
  varying float brightness;
  void main() {
    float glow = 1.0 - smoothstep(0.06, 0.49, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(0.40, 0.56, 0.98, glow * brightness * 0.56);
  }
`;
