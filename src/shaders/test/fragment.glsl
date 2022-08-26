
varying vec3 f_position;
varying float f_life;
varying float f_time;
void main()
{
    float strength =  distance(gl_PointCoord, vec2(0.5)) ;
    strength = step(0.4, strength);
    strength = 1.0 - strength;  
vec3 color =vec3( ((f_life * 0.0018) )  , (f_life * 0.001) , (f_life * 0.001));

    gl_FragColor = vec4(color , 1.0);
}