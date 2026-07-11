Shader "Kotosh360/AROverlay"
{
    Properties
    {
        _MainTex   ("Texture", 2D)      = "white" {}
        _Color     ("Tint",    Color)   = (1,1,1,0.85)
        _EdgeGlow  ("Edge Glow",Float)  = 0.5
    }

    SubShader
    {
        Tags { "Queue"="Transparent" "RenderType"="Transparent" }
        Blend SrcAlpha OneMinusSrcAlpha
        ZWrite Off
        Cull Off

        Pass
        {
            CGPROGRAM
            #pragma vertex   vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            sampler2D _MainTex;
            fixed4    _Color;
            float     _EdgeGlow;

            struct appdata { float4 vertex:POSITION; float2 uv:TEXCOORD0; float3 normal:NORMAL; };
            struct v2f     { float4 pos:SV_POSITION; float2 uv:TEXCOORD0; float  rim:TEXCOORD1; };

            v2f vert(appdata v)
            {
                v2f o;
                o.pos = UnityObjectToClipPos(v.vertex);
                o.uv  = v.uv;
                float3 viewDir = normalize(ObjSpaceViewDir(v.vertex));
                o.rim = 1.0 - saturate(dot(normalize(v.normal), viewDir));
                return o;
            }

            fixed4 frag(v2f i) : SV_Target
            {
                fixed4 col = tex2D(_MainTex, i.uv) * _Color;
                col.rgb   += _EdgeGlow * pow(i.rim, 3.0) * fixed3(0.8, 0.65, 0.2);
                return col;
            }
            ENDCG
        }
    }
}
