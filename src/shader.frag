precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D image;
uniform sampler2D backbuffer;

float random(in vec2 p) {
  return fract(sin(dot(p, vec2(5395.3242, 38249.2348))) * 248.24);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0-2.0*f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

// Util functions copied from http://glslsandbox.com/e#43153.1
mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}
mat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534);
float tri(in float x){return clamp(abs(fract(x)-.5),0.01,0.49);}
vec2 tri2(in vec2 p){return vec2(tri(p.x)+tri(p.y),tri(p.y+tri(p.x)));}

float triNoise2d(in vec2 p, float spd)
{
  float z=1.8;
  float z2=2.5;
  float rz = 0.;
  p *= mm2(p.x*0.06);
  vec2 bp = p;
  for (float i=0.; i<5.; i++ )
  {
    vec2 dg = tri2(bp*1.85)*.75;
    dg *= mm2(time*spd);
    p -= dg/z2;

    bp *= 1.3;
    z2 *= .45;
    z *= .42;
    p *= 1.21 + (rz-1.0)*.02;

    rz += tri(p.x+tri(p.y))*z;
    p*= -m2;
  }
  return clamp(1./pow(rz*29., 1.3),0.,.55);
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 uv0 = (uv - .5) * 1. + .5;

    float z = 23.01;
    float t = time * .4;
    vec2 uv1 = uv0 + vec2(noise(uv0 * z - t)*cos(uv.x+t+2.4), noise(uv0 * z + t)) * .03 * sin(time * .07);
    vec2 uv2 = uv1 + vec2(noise(uv1 * z - t)*sin(uv.y+t+.2), noise(uv1 * z + t)) * .04 * cos(time * .04 + .3);

    vec2 v = vec2(0, .001);
    gl_FragColor = mix(vec4(
      texture2D(image, uv1 +v).r,
      texture2D(image, uv2 +v).g,
      texture2D(image, uv0 +v).b,
      1.
    ), vec4(
      texture2D(backbuffer, uv2 + v * mod(t, 7.)).b,
      texture2D(backbuffer, uv0 + v * mod(t, 8.)).r,
      texture2D(backbuffer, uv1 + v * mod(t, 2.)).g,
      1.
    ), cos(triNoise2d(uv0 * .3, t * .001) * 20.) - .2);

    // gl_FragColor.a = triNoise2d(uv2 * .3, t * .001) - 8.;
}
