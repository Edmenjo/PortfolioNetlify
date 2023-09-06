import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    mobileAndTabletCheck,
    BloomPlugin,
    // @ts-ignore
    Vector3, GammaCorrectionPlugin, MeshBasicMaterial2, Color, AssetImporter
} from "webgi";

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
// @ts-ignore
import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t:any) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical', // vertical, horizontal
  gestureDirection: 'vertical', // vertical, horizontal, both
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

lenis.stop()

function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  
  requestAnimationFrame(raf)

gsap.registerPlugin(ScrollTrigger)

async function setupViewer(){

    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        // isAntialiased: true,
    })

    const isMobile = mobileAndTabletCheck()
    // console.log(isMobile)

    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target

    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(true))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    await viewer.addPlugin(BloomPlugin)

    // Loader
    const importer = manager.importer as AssetImporter

    importer.addEventListener("onProgress", (ev) => {
        const progressRatio = (ev.loaded / ev.total)
        // console.log(progressRatio)
        document.querySelector('.progress')?.setAttribute('style', `transform: scaleX(${progressRatio})`)
    })
    // @ts-ignore
    importer.addEventListener("onLoad", (ev) => {
        gsap.to('.loader', {x: '100%', duration: 0.8, ease: 'power4.inOut', delay: 1, onComplete: () =>{
            document.body.style.overflowY = 'auto'
            lenis.start()

        }})
    })



    viewer.renderer.refreshPipeline()

    await manager.addFromPath("./public/headphones.glb")

    viewer.getPlugin(TonemapPlugin)!.config!.clipBackground = true // in case its set to false in the glb

    viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})

    if (isMobile){
        position.set(-3.5, -1.1, 5.5)
        target.set(-0.8, 1.55, -0.7)
        camera.setCameraOptions({ fov: 40 })
    }

    let needsUpdate = true;
    onUpdate()
    
    window.scrollTo(0,0)

    function setupScrollanimation(){

        const tl = gsap.timeline()

        // FIRST SECTION

        tl
        .to(position, {x: isMobile ? -6.0 : 9.98, y: isMobile ?  5.5 :  -2.84, z: isMobile ? -3.3 :  11.29,
            scrollTrigger: {
                trigger: ".onePoint",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }, onUpdate})

        
        .to(target, {x: isMobile ? -1.1 : -0.57, y: isMobile ? 1.0 : 0.27 , z: isMobile ? -0.1 : 2.5,
            scrollTrigger: {
                trigger: ".onePoint",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }})
        ////BACKGROUND CHANGE
        .to(".section", { backgroundColor: 'purple',
            scrollTrigger: {
                trigger: ".first",
                start:"bottom bottom",
                end: "bottom 80%", 
                scrub: 1,
        }})
        ////BACKGROUND EXPANDING ANIMATION
        .to(".section--one--container", { opacity:0, scale: 1.5,
            scrollTrigger: {
                trigger: ".first",
                start:"bottom bottom",
                end: "bottom 80%", 
                scrub: 1,
        }})

        ////LOGOS ANIMATIONS
        .from(".firstLogo", { xPercent:'-125' , yPercent:'-90', opacity:0, scale: 0.72,
            scrollTrigger: {
                trigger: ".second",
                start:"35% bottom",
                end: "70% 80%", scrub: 1,
                immediateRender: false,
        }})
        .from(".secLogo", { opacity:1, scale: 0.3,
            scrollTrigger: {
                trigger: ".second",
                start:"35% bottom",
                end: "70% 80%", scrub: 1,
                immediateRender: false,
        }})
        .from(".thirdLogo", { xPercent:'125' , yPercent:'90', opacity:0, scale: 0.72,
            scrollTrigger: {
                trigger: ".second",
                start:"35% bottom",
                end: "70% 80%", scrub: 1,
                immediateRender: false,
        }})
        .from(".fourthLogo", { xPercent:'185' , yPercent:'-120', opacity:0, 
            scrollTrigger: {
                trigger: ".logosTwo",
                start:"70% bottom",
                end: "70% 80%", scrub: 2,
                immediateRender: false,
        }})
        .from(".fifthLogo", { xPercent:'185' , yPercent:'-120', opacity:0, 
            scrollTrigger: {
                trigger: ".logosTwo",
                start:"70% bottom",
                end: "70% 80%", scrub: 2,
                immediateRender: false,
        }})
        .from(".sixthLogo", { xPercent:'185' , yPercent:'-120', opacity:0, 
            scrollTrigger: {
                trigger: ".logosTwo",
                start:"70% bottom",
                end: "70% 80%", scrub: 2,
                immediateRender: false,
        }})
            
        // SECOND ANIMATION

        .to(position, {x: -7.49, y: 2.68, z: -6.51,
            scrollTrigger: {
                trigger: ".second",
                start:"top bottom",
                end: "bottom bottom", scrub: true,
                immediateRender: false
        }, onUpdate})

        .to(target, {x: -0.62, y: -0.24 , z: 2.37,
            scrollTrigger: {
                trigger: ".second",
                start:"top bottom",
                end: "bottom bottom", scrub: true,
                immediateRender: false
        }})


        // THIRD ANIMATION

        .to(position, {x: -15.95, y: 9.56, z: -2.19,
            scrollTrigger: {
                trigger: ".third",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }, onUpdate})

        .to(target, {x: 0.26, y: -0.54 , z: 1.63,
            scrollTrigger: {
                trigger: ".third",
                start:"top bottom",
                end: "top top", scrub: true,
                immediateRender: false
        }})

    }

    setupScrollanimation()
    
    // WEBGI UPDATE
    

    function onUpdate() {
        needsUpdate = true;
        // viewer.renderer.resetShadows()
        viewer.setDirty()
    }

    viewer.addEventListener('preFrame', () =>{
        if(needsUpdate){
            camera.positionTargetUpdated(true)
            needsUpdate = false
        }
    })

	// SCROLL TO TOP
	document.querySelectorAll('.button--footer')?.forEach(item => {
		item.addEventListener('click', () => {
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
		})
	})

    


}

setupViewer()
