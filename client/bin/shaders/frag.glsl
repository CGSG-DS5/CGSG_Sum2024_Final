#version 300 es

precision highp float;

uniform samplerCube CubeMap0;

#define PI 3.14159265359

uniform Utils // 1
{
  vec4 TimeGlobalTimeDeltaTimeGlobalDeltaTime;
  vec4 CamLoc4;
  vec4 CamUp4;
  vec4 CamRight4;
  vec4 CamDir4;
  vec4 FrameWFrameHWpHp;
  vec4 FarClipProjDistProjSize;
};

#define Time TimeGlobalTimeDeltaTimeGlobalDeltaTime.x
#define GlobalTime TimeGlobalTimeDeltaTimeGlobalDeltaTime.y
#define DeltaTime TimeGlobalTimeDeltaTimeGlobalDeltaTime.z
#define GlobalDeltaTime TimeGlobalTimeDeltaTimeGlobalDeltaTime.w

#define CamLoc CamLoc4.xyz
#define CamUp CamUp4.xyz
#define CamRight CamRight4.xyz
#define CamDir CamDir4.xyz
#define CamAt vec3(CamUp4.w, CamRight4.w, CamDir4.w)

#define FrameW FrameWFrameHWpHp.x
#define FrameH FrameWFrameHWpHp.y
#define Wp FrameWFrameHWpHp.z
#define Hp FrameWFrameHWpHp.w

#define FarClip FarClipProjDistProjSize.x
#define ProjDist FarClipProjDistProjSize.y
#define ProjSize FarClipProjDistProjSize.z

uniform Material // 2
{
  vec4 KaPh;
  vec4 KdTrans;
  vec4 Ks4;
  vec4 Ke4;
};

#define MtlKa KaPh.xyz
#define Ph KaPh.w
#define MtlKd KdTrans.xyz
#define Trans KdTrans.w
#define MtlKs Ks4.xyz
#define MtlKe Ke4.xyz

struct star
{
  vec4 RaDecMagnParal;
};

#define MAX_STARS 9110

uniform Stars // 3
{
  vec4 LonLatLMST4;
  star StarList[MAX_STARS];
};

out vec4 OutColor;

void main( void )
{
  // OutColor = vec4(vec2(gl_FragCoord.xy) * abs(sin(Time)) / vec2(FrameW, FrameH), 0.0, 1.0);

  float
    px = ((2.0 * gl_FragCoord.x + 1.0) / FrameW - 1.0) * Wp,
    py = ((2.0 * gl_FragCoord.y + 1.0) / FrameH - 1.0) * Hp;
  vec3
    RayDir = CamDir * ProjDist + px * CamRight + py * CamUp,
    RayOrg = CamLoc + RayDir;
  RayDir = normalize(RayDir);

  float t, x, theta, phi, siph, coph, sith, coth;
  vec3 r;

  theta = StarList[0].RaDecMagnParal.x * 7.5 / 180.0 * PI;
  phi = (90.0 - StarList[0].RaDecMagnParal.y) / 180.0 * PI;
  siph = sin(phi);
  coph = cos(phi);
  sith = sin(theta);
  coth = cos(theta);

  r = vec3(siph * sith, coph, siph * coth);
  x = dot(r, RayDir);

  t = x;

  for (int i = 1; i < 100; i++)
  {
    theta = StarList[i].RaDecMagnParal.x * 7.5 / 180.0 * PI;
    phi = (90.0 - StarList[i].RaDecMagnParal.y) / 180.0 * PI;
    siph = sin(phi);
    coph = cos(phi);
    sith = sin(theta);
    coth = cos(theta);

    r = vec3(siph * sith, coph, siph * coth);
    x = dot(r, RayDir);

    t = mix(t, x, x > t);
  }

  if (t > 0.0)
    OutColor = vec4(texture(CubeMap0, RayDir).xyz + vec3(pow(t / 1.0, 100000.0)), 1);
  else
    OutColor = vec4(texture(CubeMap0, RayDir).xyz, 1);
}