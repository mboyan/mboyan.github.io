function loadHydraScripts()
{
    // Hydra canvas instances
    var canvases = document.getElementsByClassName('hydra-canvas')

    hydras.push(new Hydra({ canvas: canvases[0], detectAudio: false }));
    solid(0, 0, 0).layer(
        gradient()
            .modulateKaleid(noise(2))
            .hue(0.5)
            .mask(
                osc(24, 0.15, 0.1)
                .layer(solid(0.9, 0.51, 0.15).add(noise(5)))
                .modulateKaleid(osc(18))
                .kaleid(120)
                .modulateHue(noise(5))
                .rotate(1, 0.1)
                .luma()
            )
            .mask(shape(6, 0.51, 0.25).rotate(1, 0.25).repeat(1,1).luma())
            .modulateScrollX(noise(1.5))
            .modulate(shape(4).repeat(12, 6))
        )
    .out()

    hydras.push(new Hydra({ canvas: canvases[1], detectAudio: false }));
    osc(64, 0.1, 0.2)
        .hue(0.75)
        .rotate(3.14/2)
        .modulateScrollY(osc(12).rotate(0.75))
        .mult(solid(0.2, 0.6, 0.7))
        .modulate(osc(82).rotate(0.15))
        .add(shape(6).mult(solid(0.5, 0.6, 0.1)).diff(shape(6, 0.35)).scale(({time}) => Math.sin(time*8), 0.6, 1).repeat(8, 6).luma())
        .hue(({time}) => Math.sin(time))
        .pixelate(1600, 48)
        .mask(osc(15, 0.8).thresh(0.25))
        .saturate(2)
        .brightness(-0.2)
        .mask(shape(100).scale(1, 1, () => width/height).luma())
    .out()

    hydras.push(new Hydra({ canvas: canvases[2], detectAudio: false }));
    solid(0, 0, 0).layer(
        shape(2, 0.00125)
            .scrollY(0.5)
            .kaleid(36)
            .mask(noise(14, 8).thresh(0.05))
            // .mask(noise(() => a.fft[0]*15+5).thresh(0.05))
            .add(solid(1,0,() => Math.cos(time*0.254)).mask(shape(2, 0.05)).rotate(() => Math.sin(time%2.1)*Math.PI))
    )
    .out()

    hydras.push(new Hydra({ canvas: canvases[3], detectAudio: false }));
    osc(2,0.1,2).luma(0.25)
        // .modulateScrollX(noise(6).kaleid(()=>3+3*a.fft[0]).scrollX(0.5))
        .add(src(s0).brightness(-0.2).luma(0.8))
        .mask(shape(4,0.5).add(shape(120,0.5).scrollX(0.25)).add(shape(120,0.5).scrollY(0.25)).rotate(3.14*0.25).luma(0.01))
        .scrollX(()=>(0.2*time)%width)
        .blend(src(o0).rotate(0.001).thresh(0.5))
        // .hue(()=>a.fft[1])
        .rotate(0.01,0.01)
        .mult(shape(4,0.9,0.1))
        .mask(osc(15,0.6).mask(osc(15,0.66).rotate(0.01,0.1)).thresh(0.2))
        .scale(1,1,width/height)
        .color(0.5,0.1,0.1)
    .out(o0)

    hydras.push(new Hydra({ canvas: canvases[4], detectAudio: false }));
    solid(0, 0, 0).layer(
        osc(150,0.5,0.5).luma(0.9)
            .mult(osc(55,0.23,0.8).rotate(Math.PI*0.5))
            .color(0.5,1,0.6)
            .layer(solid(1,0.2,1).mask(osc(18,0.5,0.1).thresh(0.9).kaleid(2).rotate(Math.PI*0.5)))
            .mult(shape(4,0.6,0.22))
            .layer(gradient(0.6).modulate(noise(666.6,0.5)).luma(0.666))
            .modulateHue(src(o0).scrollX(0.001).rotate(0.6))
            .modulateKaleid(src(o0).scale(1.5))
            .layer(shape(666,0.2).scale(1,1,width/height).color(1,1,0).luma(0.185))
            .modulate(gradient().rotate(0.1,0.6).sub(gradient().modulate(osc(120).mult(osc(123).rotate(0.1)))))
    )
    .out(o0)
}
