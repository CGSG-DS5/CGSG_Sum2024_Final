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
  vec4 SinACosASinECosE;
};

#define MAX_STARS 200

uniform Stars // 3
{
  star StarList[MAX_STARS];
};

out vec4 OutColor;

void main( void )
{
  // OutColor = vec4(vec2(gl_FragCoord.xy) * abs(sin(Time)) / vec2(FrameW, FrameH), 0.0, 1.0);

  float
    px = ((2.0 * gl_FragCoord.x + 1.0) / (FrameW - 1.0) - 1.0) * Wp,
    py = ((2.0 * gl_FragCoord.y + 1.0) / (FrameH - 1.0) - 1.0) * Hp;
  vec3
    RayDir = CamDir * ProjDist + px * CamRight + py * CamUp,
    RayOrg = CamLoc + RayDir;
  RayDir = normalize(RayDir);

  float t, x, siph, coph, sith, coth;
  vec3 r;

  sith = StarList[0].SinACosASinECosE.x;
  coth = StarList[0].SinACosASinECosE.y;
  siph = StarList[0].SinACosASinECosE.z;
  coph = StarList[0].SinACosASinECosE.w;

  r = vec3(coph * coth, siph, coph * sith);
  x = dot(r, RayDir);

  t = x;

  for (int i = 1; i < MAX_STARS; i++)
  {
    sith = StarList[i].SinACosASinECosE.x;
    coth = StarList[i].SinACosASinECosE.y;
    siph = StarList[i].SinACosASinECosE.z;
    coph = StarList[i].SinACosASinECosE.w;

    r = vec3(coph * coth, siph, coph * sith);
    x = dot(r, RayDir);

    t = mix(t, x, x > t);
  }

  if (t > 0.0)
    OutColor = vec4(texture(CubeMap0, RayDir).xyz + vec3(pow(t / 1.0, 100000.0)), 1);
  else
    OutColor = vec4(texture(CubeMap0, RayDir).xyz, 1);
}