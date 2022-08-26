uniform float pointMultiplier;
uniform float u_time;
attribute float size;
attribute float life;

varying float f_life;
varying float f_time;
varying vec2 vUv;
varying vec3 f_position;

void main()
{
    float posY =  ((u_time * size)* 30.0);
    float number = step(posY,0.0);
    float stagger =  size / gl_Position.y ;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position.y +=  ( (size) ) * 0.5 ;
    gl_Position.x +=  sin( (size * 0.01)* (life * 0.3) )   ;
    gl_PointSize += (size * (life * 0.001)) * pointMultiplier / gl_Position.w;
    f_position = position;
    f_life =  life  ;
    f_time = u_time;
}