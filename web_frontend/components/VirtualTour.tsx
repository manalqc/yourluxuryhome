'use client';

import { useEffect, useRef, useState } from 'react';

interface VirtualTourProps {
  panoramaUrl?: string;
  className?: string;
}

const VirtualTour: React.FC<VirtualTourProps> = ({ 
  panoramaUrl = "https://yourluxuryhometanger.com/wp-content/uploads/2025/04/P1079215-1140x760.jpg", 
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMouseDown = useRef(false);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const lon = useRef(0);
  const lat = useRef(0);
  const phi = useRef(0);
  const theta = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load Three.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = initVirtualTour;
    document.head.appendChild(script);

    return () => {
      if (rendererRef.current) {
        containerRef.current?.removeChild(rendererRef.current.domElement);
      }
      document.head.removeChild(script);
    };
  }, []);

  const initVirtualTour = () => {
    const THREE = (window as any).THREE;
    if (!containerRef.current || !THREE) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    sceneRef.current = new THREE.Scene();

    // Camera
    cameraRef.current = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    cameraRef.current.position.set(0, 0, 0);

    // Geometry and Material
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert sphere

    const loader = new THREE.TextureLoader();
    // try to allow CORS
    if (loader.setCrossOrigin) loader.setCrossOrigin('anonymous');
    loader.load(
      panoramaUrl,
      (texture: any) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        sceneRef.current.add(mesh);
        setIsLoading(false);
      },
      undefined,
      (err: any) => {
        console.error('Failed to load panorama texture', err);
        setError('Failed to load the 360° image.');
        setIsLoading(false);
      }
    );

    // Renderer
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    container.appendChild(rendererRef.current.domElement);

    // Event listeners
    const canvas = rendererRef.current.domElement;
    
    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      isMouseDown.current = true;
      mouseX.current = event.clientX;
      mouseY.current = event.clientY;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isMouseDown.current) return;
      
      const deltaX = event.clientX - mouseX.current;
      const deltaY = event.clientY - mouseY.current;
      
      lon.current += deltaX * 0.1;
      lat.current -= deltaY * 0.1;
      
      mouseX.current = event.clientX;
      mouseY.current = event.clientY;
    };

    const onMouseUp = () => {
      isMouseDown.current = false;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        event.preventDefault();
        mouseX.current = event.touches[0].clientX;
        mouseY.current = event.touches[0].clientY;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        event.preventDefault();
        const deltaX = event.touches[0].clientX - mouseX.current;
        const deltaY = event.touches[0].clientY - mouseY.current;
        
        lon.current += deltaX * 0.1;
        lat.current -= deltaY * 0.1;
        
        mouseX.current = event.touches[0].clientX;
        mouseY.current = event.touches[0].clientY;
      }
    };

    const onWheel = (event: WheelEvent) => {
      const fov = cameraRef.current.fov + event.deltaY * 0.05;
      cameraRef.current.fov = Math.max(10, Math.min(75, fov));
      cameraRef.current.updateProjectionMatrix();
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('wheel', onWheel);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      lat.current = Math.max(-85, Math.min(85, lat.current));
      phi.current = THREE.MathUtils.degToRad(90 - lat.current);
      theta.current = THREE.MathUtils.degToRad(lon.current);

      cameraRef.current.position.x = 100 * Math.sin(phi.current) * Math.cos(theta.current);
      cameraRef.current.position.y = 100 * Math.cos(phi.current);
      cameraRef.current.position.z = 100 * Math.sin(phi.current) * Math.sin(theta.current);

      cameraRef.current.lookAt(0, 0, 0);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', onMouseUp);
    };
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={containerRef} 
        className="w-full h-96 bg-black/20 border border-white/10 rounded-sm overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ minHeight: '400px' }}
      >
        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm">
            Loading 360° Tour...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-300/90 text-sm px-4 text-center">
            {error}
          </div>
        )}
      </div>
      
      {/* Controls overlay */}
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm border border-white/20 rounded-sm px-3 py-2 text-white/80 text-xs">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
          </svg>
          <span>Drag to look around • Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;
