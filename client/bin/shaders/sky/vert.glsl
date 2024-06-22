#version 300 es

precision highp float;

uniform Matrs // 0
{
  mat4 W;
  mat4 WInv;
  mat4 WVP;
};

in vec3 InPos;

void main( void )
{
  gl_Position = vec4(InPos, 0);
}