
varying vec3 f_position;
varying float f_life;
varying float f_time;
void main()
{
    // float posZ = step( 0.25,abs(f_position.z * f_position.x));
    // float green = smoothstep(0.3 , posZ  , 0.9);
    // float blue = smoothstep(0.6, posZ , 0.8);
    vec3 color = vec3( 0.56 * f_position.y  , 0.4 * (f_position.y), 0.3 * (f_position.y ));

    gl_FragColor = vec4(color , 1.0);
}