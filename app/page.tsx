// "use client";

// import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import { Switch } from "@/components/ui/switch";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { FileUp, Play, Pause, RotateCw, Repeat, ArrowLeftRight, Download, Palette } from 'lucide-react';
// type AnimationVariant = keyof typeof animationVariants;

// const animationVariants = {
//   fadeIn: {
//     initial: { opacity: 0 },
//     animate: { opacity: 1 },
//   },
//   scaleIn: {
//     initial: { scale: 0 },
//     animate: { scale: 1 },
//   },
//   rotateIn: {
//     initial: { rotate: -180, opacity: 0 },
//     animate: { rotate: 0, opacity: 1 },
//   },
//   slideInLeft: {
//     initial: { x: -100, opacity: 0 },
//     animate: { x: 0, opacity: 1 },
//   },
//   slideInRight: {
//     initial: { x: 100, opacity: 0 },
//     animate: { x: 0, opacity: 1 },
//   },
//   bounceIn: {
//     initial: { scale: 0 },
//     animate: { scale: [0, 1.2, 1] },
//   },
//   shake: {
//     animate: { x: [-10, 10, -10, 10, 0] },
//   },
//   pulse: {
//     animate: { scale: [1, 1.1, 1] },
//   },
//   swing: {
//     animate: { rotate: [0, 15, -15, 15, -15, 0] },
//   },
// };

// const presetAnimations = {
//   heartbeat: {
//     animation: 'pulse',
//     duration: 0.8,
//     repeat: Infinity,
//     yoyo: true,
//   },
//   attention: {
//     animation: 'shake',
//     duration: 0.5,
//     repeat: 2,
//     yoyo: false,
//   },
//   pendulum: {
//     animation: 'swing',
//     duration: 2,
//     repeat: Infinity,
//     yoyo: true,
//   },
// };

// const ImageAnimator = () => {
//   const [file, setFile] = useState<string | null>(null);
//   const [animation, setAnimation] = useState<AnimationVariant>('fadeIn');
//   const [duration, setDuration] = useState(1);
//   const [delay, setDelay] = useState(0);
//   const [repeat, setRepeat] = useState(0);
//   const [yoyo, setYoyo] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [color, setColor] = useState('#000000');
//   const [preset, setPreset] = useState<keyof typeof presetAnimations | ''>('');
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (preset) {
//       const presetConfig = presetAnimations[preset];
//       setAnimation(presetConfig.animation as AnimationVariant);
//       setDuration(presetConfig.duration);
//       setRepeat(presetConfig.repeat === Infinity ? -1 : presetConfig.repeat);
//       setYoyo(presetConfig.yoyo);
//     }
//   }, [preset]);

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file && (file.type.startsWith('image/svg') || file.type.startsWith('image/png'))) {
//       const reader = new FileReader();
//       reader.onload = (e: ProgressEvent<FileReader>) => {
//         if (typeof e.target?.result === 'string') {
//           setFile(e.target.result);
//         }
//       };
//       reader.readAsDataURL(file);
//     } else {
//       alert('Please upload an SVG or PNG file.');
//     }
//   };

//   const handlePlayPause = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const handleExport = () => {
//     if (file) {
//       const svgElement = document.querySelector('svg');
//       if (svgElement) {
//         const svgData = new XMLSerializer().serializeToString(svgElement);
//         const animatedSvg = addAnimationToSvg(svgData);
//         const blob = new Blob([animatedSvg], { type: 'image/svg+xml' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'animated_image.svg';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//       } else {
//         alert('SVG element not found.');
//       }
//     } else {
//       alert('No file to export.');
//     }
//   };

//   const addAnimationToSvg = (svgData: string) => {
//     const parser = new DOMParser();
//     const svgDoc = parser.parseFromString(svgData, 'image/svg+xml');
//     const svgElement = svgDoc.documentElement;

//     // Add animation attributes
//     svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

//     const animateElement = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'animate');
//     animateElement.setAttribute('attributeName', getAnimationAttribute());
//     animateElement.setAttribute('dur', `${duration}s`);
//     animateElement.setAttribute('begin', `${delay}s`);
//     animateElement.setAttribute('repeatCount', repeat === -1 ? 'indefinite' : repeat.toString());
//     animateElement.setAttribute('values', getAnimationValues());
//     animateElement.setAttribute('keyTimes', '0;1');
//     if (yoyo) {
//       animateElement.setAttribute('keySplines', '0.5 0 0.5 1; 0.5 0 0.5 1');
//       animateElement.setAttribute('calcMode', 'spline');
//     }

//     svgElement.appendChild(animateElement);

//     return new XMLSerializer().serializeToString(svgDoc);
//   };

//   const getAnimationAttribute = () => {
//     switch (animation) {
//       case 'fadeIn':
//         return 'opacity';
//       case 'scaleIn':
//       case 'bounceIn':
//         return 'transform';
//       case 'rotateIn':
//         return 'transform';
//       case 'slideInLeft':
//       case 'slideInRight':
//         return 'transform';
//       case 'shake':
//       case 'pulse':
//       case 'swing':
//         return 'transform';
//       default:
//         return 'opacity';
//     }
//   };

//   const getAnimationValues = () => {
//     switch (animation) {
//       case 'fadeIn':
//         return '0;1';
//       case 'scaleIn':
//         return 'scale(0);scale(1)';
//       case 'bounceIn':
//         return 'scale(0);scale(1.2);scale(1)';
//       case 'rotateIn':
//         return 'rotate(-180) scale(0);rotate(0) scale(1)';
//       case 'slideInLeft':
//         return 'translateX(-100%);translateX(0)';
//       case 'slideInRight':
//         return 'translateX(100%);translateX(0)';
//       case 'shake':
//         return 'translateX(-10px);translateX(10px);translateX(-10px);translateX(10px);translateX(0)';
//       case 'pulse':
//         return 'scale(1);scale(1.1);scale(1)';
//       case 'swing':
//         return 'rotate(0);rotate(15deg);rotate(-15deg);rotate(15deg);rotate(-15deg);rotate(0)';
//       default:
//         return '0;1';
//     }
//   };

//   return (
//     <div className="max-w-full mx-auto p-10 bg-white rounded-lg shadow-lg">

//       <div className="flex flex-col md:flex-row gap-20">
//         {/* Left side - Preview and Play/Pause buttons */}
//         <div className="w-full md:w-1/2">
//           <div className="mb-4">
//             <Label htmlFor="file-upload" className="mb-2 block">
//               <FileUp className="inline mr-2" />
//               Upload SVG/PNG
//             </Label>
//             <Input
//               id="file-upload"
//               type="file"
//               onChange={handleFileChange}
//               accept=".svg,.png"
//               ref={fileInputRef}
//               className="hidden"
//             />
//             <Button onClick={() => fileInputRef.current?.click()} className="w-full">
//               Choose File
//             </Button>
//           </div>

//           <div className="mb-4 border-4 border-dashed border-gray-200 rounded-lg p-4 flex items-center justify-center bg-gray-50" style={{ height: '300px' }}>
//             <AnimatePresence mode="wait">
//               {file && (
//                 <motion.img
//                   key={file}
//                   src={file}
//                   alt="Animated content"
//                   initial={animationVariants[animation].initial}
//                   animate={isPlaying ? animationVariants[animation].animate : animationVariants[animation].initial}
//                   transition={{
//                     duration: duration,
//                     delay: delay,
//                     repeat: repeat === -1 ? Infinity : repeat,
//                     repeatType: yoyo ? "reverse" : "loop",
//                   }}
//                   className="max-w-full max-h-full object-contain"
//                   style={{ filter: `hue-rotate(${parseInt(color.slice(1), 16)}deg)` }}
//                 />
//               )}
//             </AnimatePresence>
//             {!file && <p className="text-gray-400">Upload an SVG or PNG to preview animation</p>}
//           </div>

//           <div className="flex gap-4 mb-4">
//             <Button
//               onClick={handlePlayPause}
//               className="w-1/3"
//               disabled={!file}
//             >
//               {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
//               {isPlaying ? 'Pause' : 'Play'}
//             </Button>
//             <Button
//               onClick={() => {
//                 setIsPlaying(false);
//                 setTimeout(() => setIsPlaying(true), 50);
//               }}
//               className="w-1/3"
//               disabled={!file}
//             >
//               <RotateCw className="mr-2" />
//               Restart
//             </Button>
//             <Button
//               onClick={handleExport}
//               className="w-1/3"
//               disabled={!file}
//             >
//               <Download className="mr-2" />
//               Export
//             </Button>
//           </div>

//           <div>
//             <Label htmlFor="preset-select" className="mb-2 block">Preset Animations</Label>
//             <Select onValueChange={(value) => setPreset(value as keyof typeof presetAnimations)}>
//               <SelectTrigger id="preset-select">
//                 <SelectValue placeholder="Select preset" />
//               </SelectTrigger>
//               <SelectContent>
//                 {Object.keys(presetAnimations).map((presetName) => (
//                   <SelectItem key={presetName} value={presetName}>{presetName}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Right side - Animation options */}
//         <div className="w-full md:w-1/2 space-y-6">
//           <div>
//             <Label htmlFor="animation-select" className="mb-2 block">Animation Type</Label>
//             <Select onValueChange={value => setAnimation(value as AnimationVariant)} value={animation}>
//               <SelectTrigger id="animation-select">
//                 <SelectValue placeholder="Select animation" />
//               </SelectTrigger>
//               <SelectContent>
//                 {Object.keys(animationVariants).map((anim) => (
//                   <SelectItem key={anim} value={anim}>{anim}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label className="mb-2 block">
//               <RotateCw className="inline mr-2" />
//               Duration: {duration.toFixed(1)}s
//             </Label>
//             <Slider
//               min={0.1}
//               max={5}
//               step={0.1}
//               value={[duration]}
//               onValueChange={(value) => setDuration(value[0])}
//             />
//           </div>

//           <div>
//             <Label className="mb-2 block">
//               <RotateCw className="inline mr-2" />
//               Delay: {delay.toFixed(1)}s
//             </Label>
//             <Slider
//               min={0}
//               max={5}
//               step={0.1}
//               value={[delay]}
//               onValueChange={(value) => setDelay(value[0])}
//             />
//           </div>

//           <div>
//             <Label className="mb-2 block">
//               <Repeat className="inline mr-2" />
//               Repeat: {repeat === -1 ? "Infinite" : repeat}
//             </Label>
//             <Slider
//               min={-1}
//               max={10}
//               step={1}
//               value={[repeat]}
//               onValueChange={(value) => setRepeat(value[0])}
//             />
//           </div>

//           <div className="flex items-center">
//             <Label htmlFor="yoyo-switch" className="mr-4">
//               <ArrowLeftRight className="inline mr-2" />
//               Yoyo Effect
//             </Label>
//             <Switch
//               id="yoyo-switch"
//               checked={yoyo}
//               onCheckedChange={setYoyo}
//             />
//           </div>

//           <div>
//             <Label htmlFor="color-input" className="mb-2 block">
//               <Palette className="inline mr-2" />
//               Color Overlay
//             </Label>
//             <Input
//               id="color-input"
//               type="color"
//               value={color}
//               onChange={(e) => setColor(e.target.value)}
//               className="w-full h-10"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageAnimator;



// Best Version


// "use client";

// import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import { Switch } from "@/components/ui/switch";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { FileUp, Play, Pause, RotateCw, Repeat, ArrowLeftRight, Download, Palette } from 'lucide-react';

// type AnimationVariant = keyof typeof animationVariants;

// const animationVariants = {
//   fadeIn: {
//     initial: { opacity: 0 },
//     animate: { opacity: 1 },
//   },
//   scaleIn: {
//     initial: { scale: 0 },
//     animate: { scale: 1 },
//   },
//   rotateIn: {
//     initial: { rotate: -180, opacity: 0 },
//     animate: { rotate: 0, opacity: 1 },
//   },
//   slideInLeft: {
//     initial: { x: -100, opacity: 0 },
//     animate: { x: 0, opacity: 1 },
//   },
//   slideInRight: {
//     initial: { x: 100, opacity: 0 },
//     animate: { x: 0, opacity: 1 },
//   },
//   bounceIn: {
//     initial: { scale: 0 },
//     animate: { scale: [0, 1.2, 1] },
//   },
//   shake: {
//     animate: { x: [-10, 10, -10, 10, 0] },
//   },
//   pulse: {
//     animate: { scale: [1, 1.1, 1] },
//   },
//   swing: {
//     animate: { rotate: [0, 15, -15, 15, -15, 0] },
//   },
// };

// const presetAnimations = {
//   heartbeat: {
//     animation: 'pulse',
//     duration: 0.8,
//     repeat: Infinity,
//     yoyo: true,
//   },
//   attention: {
//     animation: 'shake',
//     duration: 0.5,
//     repeat: 2,
//     yoyo: false,
//   },
//   pendulum: {
//     animation: 'swing',
//     duration: 2,
//     repeat: Infinity,
//     yoyo: true,
//   },
// };

// const ImageAnimator = () => {
//   const [file, setFile] = useState<string | null>(null);
//   const [animation, setAnimation] = useState<AnimationVariant>('fadeIn');
//   const [duration, setDuration] = useState(1);
//   const [delay, setDelay] = useState(0);
//   const [repeat, setRepeat] = useState(0);
//   const [yoyo, setYoyo] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [color, setColor] = useState('#000000');
//   const [preset, setPreset] = useState('');

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (preset) {
//       const presetConfig = presetAnimations[preset as keyof typeof presetAnimations];
//       setAnimation(presetConfig.animation as AnimationVariant);
//       setDuration(presetConfig.duration);
//       setRepeat(presetConfig.repeat === Infinity ? -1 : presetConfig.repeat);
//       setYoyo(presetConfig.yoyo);
//     }
//   }, [preset]);

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file && (file.type.startsWith('image/svg') || file.type.startsWith('image/png'))) {
//       const reader = new FileReader();
//       reader.onload = (e: ProgressEvent<FileReader>) => {
//         if (typeof e.target?.result === 'string') {
//           setFile(e.target.result);
//         }
//       };
//       reader.readAsDataURL(file);
//     } else {
//       alert('Please upload an SVG or PNG file.');
//     }
//   };

//   const handlePlayPause = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const handleExport = () => {
//     if (file) {
//       const img = document.querySelector('img');
//       if (img) {
//         const svgString = `
//           <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${img.width}" height="${img.height}">
//             <image xlink:href="${file}" width="100%" height="100%" />
//             <animate
//               attributeName="${getAnimationAttribute()}"
//               dur="${duration}s"
//               begin="${delay}s"
//               repeatCount="${repeat === -1 ? 'indefinite' : repeat}"
//               values="${getAnimationValues()}"
//               keyTimes="0;1"
//               ${yoyo ? 'keySplines="0.5 0 0.5 1; 0.5 0 0.5 1" calcMode="spline"' : ''}
//             />
//             <filter id="colorOverlay">
//               <feFlood flood-color="${color}" flood-opacity="0.5" />
//               <feBlend in="SourceGraphic" mode="multiply" />
//             </filter>
//           </svg>
//         `;

//         const blob = new Blob([svgString], { type: 'image/svg+xml' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'animated_image.svg';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//       } else {
//         alert('Image element not found.');
//       }
//     } else {
//       alert('No file to export.');
//     }
//   };

//   const getAnimationAttribute = () => {
//     switch (animation) {
//       case 'fadeIn':
//         return 'opacity';
//       case 'scaleIn':
//       case 'bounceIn':
//       case 'rotateIn':
//       case 'slideInLeft':
//       case 'slideInRight':
//       case 'shake':
//       case 'pulse':
//       case 'swing':
//         return 'transform';
//       default:
//         return 'opacity';
//     }
//   };

//   const getAnimationValues = () => {
//     switch (animation) {
//       case 'fadeIn':
//         return '0;1';
//       case 'scaleIn':
//         return 'scale(0);scale(1)';
//       case 'bounceIn':
//         return 'scale(0);scale(1.2);scale(1)';
//       case 'rotateIn':
//         return 'rotate(-180) scale(0);rotate(0) scale(1)';
//       case 'slideInLeft':
//         return 'translate(-100%,0);translate(0,0)';
//       case 'slideInRight':
//         return 'translate(100%,0);translate(0,0)';
//       case 'shake':
//         return 'translate(-10px,0);translate(10px,0);translate(-10px,0);translate(10px,0);translate(0,0)';
//       case 'pulse':
//         return 'scale(1);scale(1.1);scale(1)';
//       case 'swing':
//         return 'rotate(0);rotate(15deg);rotate(-15deg);rotate(15deg);rotate(-15deg);rotate(0)';
//       default:
//         return '0;1';
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row gap-8 p-6">
//       <div className="w-full md:w-1/2 space-y-4">
//         <Input
//           type="file"
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           className="hidden"
//           accept=".svg,.png"
//         />
//         <Button onClick={() => fileInputRef.current?.click()} className="w-full">
//           <FileUp className="mr-2 h-4 w-4" /> Choose File
//         </Button>
//         <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
//           {file ? (
//             <AnimatePresence>
//               {isPlaying && (
//                 <motion.img
//                   key={file}
//                   src={file}
//                   alt="Animated image"
//                   initial={animationVariants[animation].initial}
//                   animate={animationVariants[animation].animate}
//                   exit={animationVariants[animation].initial}
//                   transition={{
//                     duration,
//                     delay,
//                     repeat: repeat === -1 ? Infinity : repeat,
//                     yoyo: yoyo,
//                   }}
//                   className="max-w-full max-h-full"
//                   style={{ filter: `opacity(0.5) drop-shadow(0 0 0 ${color})` }}
//                 />
//               )}
//             </AnimatePresence>
//           ) : (
//             <p className="text-gray-500">Upload an SVG or PNG to preview animation</p>
//           )}
//         </div>
//         <div className="flex gap-2">
//           <Button onClick={handlePlayPause} className="flex-1" disabled={!file}>
//             {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
//             {isPlaying ? 'Pause' : 'Play'}
//           </Button>
//           <Button
//             onClick={() => {
//               setIsPlaying(false);
//               setTimeout(() => setIsPlaying(true), 50);
//             }}
//             className="flex-1"
//             disabled={!file}
//           >
//             <RotateCw className="mr-2 h-4 w-4" /> Restart
//           </Button>
//           <Button onClick={handleExport} className="flex-1" disabled={!file}>
//             <Download className="mr-2 h-4 w-4" /> Export
//           </Button>
//         </div>
//       </div>
//       <div className="w-full md:w-1/2 space-y-4">
//         <div>
//           <Label>Preset Animations</Label>
//           <Select onValueChange={(value) => setPreset(value as keyof typeof presetAnimations)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select a preset" />
//             </SelectTrigger>
//             <SelectContent>
//               {Object.keys(presetAnimations).map((presetName) => (
//                 <SelectItem key={presetName} value={presetName}>
//                   {presetName}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label>Animation Type</Label>
//           <Select onValueChange={(value) => setAnimation(value as AnimationVariant)} value={animation}>
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {Object.keys(animationVariants).map((anim) => (
//                 <SelectItem key={anim} value={anim}>
//                   {anim}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label>Duration: {duration.toFixed(1)}s</Label>
//           <Slider
//             min={0.1}
//             max={5}
//             step={0.1}
//             value={[duration]}
//             onValueChange={(value) => setDuration(value[0])}
//           />
//         </div>
//         <div>
//           <Label>Delay: {delay.toFixed(1)}s</Label>
//           <Slider
//             min={0}
//             max={5}
//             step={0.1}
//             value={[delay]}
//             onValueChange={(value) => setDelay(value[0])}
//           />
//         </div>
//         <div>
//           <Label>Repeat: {repeat === -1 ? "Infinite" : repeat}</Label>
//           <Slider
//             min={-1}
//             max={10}
//             step={1}
//             value={[repeat]}
//             onValueChange={(value) => setRepeat(value[0])}
//           />
//         </div>
//         <div className="flex items-center space-x-2">
//           <Switch id="yoyo" checked={yoyo} onCheckedChange={setYoyo} />
//           <Label htmlFor="yoyo">Yoyo Effect</Label>
//         </div>
//         <div>
//           <Label>Color Overlay</Label>
//           <Input
//             type="color"
//             value={color}
//             onChange={(e) => setColor(e.target.value)}
//             className="w-full h-10"
//           />
//         </div>
//         <img src="animated_image.svg" />
//       </div>
//     </div>
//   );
// };

// export default ImageAnimator;


// "use client";

// import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import { Switch } from "@/components/ui/switch";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { FileUp, Play, Pause, RotateCw, Repeat, ArrowLeftRight, Download, Palette } from 'lucide-react';
// import Image from 'next/image';



// type AnimationVariant = keyof typeof animationVariants;

// const animationVariants = {
//   fadeIn: {
//     initial: { opacity: 0 },
//     animate: { opacity: 1 },
//   },
//   scaleIn: {
//     initial: { scale: 0 },
//     animate: { scale: 1 },
//   },
//   rotateIn: {
//     initial: { rotate: -180, opacity: 0 },
//     animate: { rotate: 0, opacity: 1 },
//   },
//   slideInLeft: {
//     initial: { x: -100, opacity: 0 },
//     animate: { x: 0, opacity: 1 },
//   },
//   slideInRight: {
//     initial: { x: 100, opacity: 0 },
//     animate: { x: 0, opacity: 1 },
//   },
//   bounceIn: {
//     initial: { scale: 0 },
//     animate: { scale: [0, 1.2, 1] },
//   },
//   shake: {
//     animate: { x: [-10, 10, -10, 10, 0] },
//   },
//   pulse: {
//     animate: { scale: [1, 1.1, 1] },
//   },
//   swing: {
//     animate: { rotate: [0, 15, -15, 15, -15, 0] },
//   },
// };

// const presetAnimations = {
//   heartbeat: {
//     animation: 'pulse',
//     duration: 0.8,
//     repeat: Infinity,
//     yoyo: true,
//   },
//   attention: {
//     animation: 'shake',
//     duration: 0.5,
//     repeat: 2,
//     yoyo: false,
//   },
//   pendulum: {
//     animation: 'swing',
//     duration: 2,
//     repeat: Infinity,
//     yoyo: true,
//   },
// };

// const ImageAnimator = () => {
//   const [file, setFile] = useState<string | null>(null);
//   const [animation, setAnimation] = useState<AnimationVariant>('fadeIn');
//   const [duration, setDuration] = useState(1);
//   const [delay, setDelay] = useState(0);
//   const [repeat, setRepeat] = useState(0);
//   const [yoyo, setYoyo] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [color, setColor] = useState('#000000');
//   const [preset, setPreset] = useState('');

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (preset) {
//       const presetConfig = presetAnimations[preset as keyof typeof presetAnimations];
//       setAnimation(presetConfig.animation as AnimationVariant);
//       setDuration(presetConfig.duration);
//       setRepeat(presetConfig.repeat === Infinity ? -1 : presetConfig.repeat);
//       setYoyo(presetConfig.yoyo);
//     }
//   }, [preset]);

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file && (file.type.startsWith('image/svg') || file.type.startsWith('image/png'))) {
//       const reader = new FileReader();
//       reader.onload = (e: ProgressEvent<FileReader>) => {
//         if (typeof e.target?.result === 'string') {
//           setFile(e.target.result);
//         }
//       };
//       reader.readAsDataURL(file);
//     } else {
//       alert('Please upload an SVG or PNG file.');
//     }
//   };

//   const handlePlayPause = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const handleExport = () => {
//     if (file) {
//       const img = document.querySelector('img');
//       if (img) {
//         const svgString = `
//           <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${img.width}" height="${img.height}">
//             <defs>
//               <filter id="colorOverlay">
//                 <feFlood flood-color="${color}" flood-opacity="0.5"/>
//                 <feBlend in="SourceGraphic" in2="flood" mode="multiply"/>
//               </filter>
//             </defs>
//             <image xlink:href="${file}" width="100%" height="100%" filter="url(#colorOverlay)"/>
//             <animateTransform
//               attributeName="transform"
//               attributeType="XML"
//               type="${getAnimationType()}"
//               dur="${duration}s"
//               begin="${delay}s"
//               repeatCount="${repeat === -1 ? 'indefinite' : repeat}"
//               values="${getAnimationValues()}"
//               keyTimes="0;0.5;1"
//               calcMode="${yoyo ? 'spline' : 'linear'}"
//               keySplines="${yoyo ? '0.5 0 0.5 1; 0.5 0 0.5 1' : ''}"
//             />
//           </svg>
//         `;

//         const blob = new Blob([svgString], { type: 'image/svg+xml' });
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'animated_image.svg';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//       } else {
//         alert('Image element not found.');
//       }
//     } else {
//       alert('No file to export.');
//     }
//   };

//   const getAnimationType = () => {
//     switch (animation) {
//       case 'pulse':
//       case 'scaleIn':
//       case 'bounceIn':
//         return 'scale';
//       case 'rotateIn':
//       case 'swing':
//         return 'rotate';
//       case 'slideInLeft':
//       case 'slideInRight':
//       case 'shake':
//         return 'translate';
//       default:
//         return 'scale';
//     }
//   };

//   const getAnimationValues = () => {
//     switch (animation) {
//       case 'pulse':
//         return '1;1.1;1';
//       case 'scaleIn':
//         return '0;1;1';
//       case 'bounceIn':
//         return '0;1.2;1';
//       case 'rotateIn':
//         return '-180 0 0;0 0 0;0 0 0';
//       case 'swing':
//         return '0 0 0;15 0 0;-15 0 0';
//       case 'slideInLeft':
//         return '-100% 0;0 0;0 0';
//       case 'slideInRight':
//         return '100% 0;0 0;0 0';
//       case 'shake':
//         return '-10 0;10 0;0 0';
//       default:
//         return '1;1.1;1';
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row gap-8 p-6">
//       <div className="w-full md:w-1/2 space-y-4">
//         <Input
//           type="file"
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           className="hidden"
//           accept=".svg,.png"
//         />
//         <Button onClick={() => fileInputRef.current?.click()} className="w-full">
//           <FileUp className="mr-2 h-4 w-4" /> Choose File
//         </Button>
//         <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
//           {file ? (
//             <AnimatePresence>
//               {isPlaying && (
//                 <motion.img
//                   key={file}
//                   src={file}
//                   alt="Animated image"
//                   initial={animationVariants[animation].initial}
//                   animate={animationVariants[animation].animate}
//                   exit={animationVariants[animation].initial}
//                   transition={{
//                     duration,
//                     delay,
//                     repeat: repeat === -1 ? Infinity : repeat,
//                     yoyo: yoyo,
//                   }}
//                   className="max-w-full max-h-full"
//                   style={{ filter: `opacity(0.5) drop-shadow(0 0 0 ${color})` }}
//                 />
//               )}
//             </AnimatePresence>
//           ) : (
//             <p className="text-gray-500">Upload an SVG or PNG to preview animation</p>
//           )}
//         </div>
//         <div className="flex gap-2">
//           <Button onClick={handlePlayPause} className="flex-1" disabled={!file}>
//             {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
//             {isPlaying ? 'Pause' : 'Play'}
//           </Button>
//           <Button
//             onClick={() => {
//               setIsPlaying(false);
//               setTimeout(() => setIsPlaying(true), 50);
//             }}
//             className="flex-1"
//             disabled={!file}
//           >
//             <RotateCw className="mr-2 h-4 w-4" /> Restart
//           </Button>
//           <Button onClick={handleExport} className="flex-1" disabled={!file}>
//             <Download className="mr-2 h-4 w-4" /> Export
//           </Button>
//         </div>
//       </div>
//       <div className="w-full md:w-1/2 space-y-4">
//         <div>
//           <Label>Preset Animations</Label>
//           <Select onValueChange={(value) => setPreset(value as keyof typeof presetAnimations)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select a preset" />
//             </SelectTrigger>
//             <SelectContent>
//               {Object.keys(presetAnimations).map((presetName) => (
//                 <SelectItem key={presetName} value={presetName}>
//                   {presetName}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label>Animation Type</Label>
//           <Select onValueChange={(value) => setAnimation(value as AnimationVariant)} value={animation}>
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {Object.keys(animationVariants).map((anim) => (
//                 <SelectItem key={anim} value={anim}>
//                   {anim}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div>
//           <Label>Duration: {duration.toFixed(1)}s</Label>
//           <Slider
//             min={0.1}
//             max={5}
//             step={0.1}
//             value={[duration]}
//             onValueChange={(value) => setDuration(value[0])}
//           />
//         </div>
//         <div>
//           <Label>Delay: {delay.toFixed(1)}s</Label>
//           <Slider
//             min={0}
//             max={5}
//             step={0.1}
//             value={[delay]}
//             onValueChange={(value) => setDelay(value[0])}
//           />
//         </div>
//         <div>
//           <Label>Repeat: {repeat === -1 ? "Infinite" : repeat}</Label>
//           <Slider
//             min={-1}
//             max={10}
//             step={1}
//             value={[repeat]}
//             onValueChange={(value) => setRepeat(value[0])}
//           />
//         </div>
//         <div className="flex items-center space-x-2">
//           <Switch id="yoyo" checked={yoyo} onCheckedChange={setYoyo} />
//           <Label htmlFor="yoyo">Yoyo Effect</Label>
//         </div>
//         <div>
//           <Label>Color Overlay</Label>
//           <Input
//             type="color"
//             value={color}
//             onChange={(e) => setColor(e.target.value)}
//             className="w-full h-10"
//           />
//         </div>
//         <Image src="/try.svg" alt={'13'} width="500" height="200" />
//       </div>
//     </div>
//   );
// };

// export default ImageAnimator;









"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp, Play, Pause, RotateCw, Repeat, Download } from 'lucide-react';
import Image from 'next/image';


type AnimationVariant = keyof typeof animationVariants;

const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  scaleIn: {
    initial: { scale: 0 },
    animate: { scale: 1 },
  },
  rotateIn: {
    initial: { rotate: -180, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
  },
  slideInLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
  bounceIn: {
    initial: { scale: 0 },
    animate: { scale: [0, 1.2, 1] },
  },
  shake: {
    animate: { x: [-10, 10, -10, 10, 0] },
  },
  pulse: {
    animate: { scale: [1, 1.1, 1] },
  },
  swing: {
    animate: { rotate: [0, 15, -15, 15, -15, 0] },
  },
};

const presetAnimations = {
  heartbeat: {
    animation: 'pulse',
    duration: 0.8,
    repeat: Infinity,
    yoyo: true,
  },
  attention: {
    animation: 'shake',
    duration: 0.5,
    repeat: 2,
    yoyo: false,
  },
  pendulum: {
    animation: 'swing',
    duration: 2,
    repeat: Infinity,
    yoyo: true,
  },
};

const ImageAnimator = () => {
  const [file, setFile] = useState<string | null>(null);
  const [animation, setAnimation] = useState<AnimationVariant>('fadeIn');
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [repeat, setRepeat] = useState(0);
  const [yoyo, setYoyo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [color, setColor] = useState('#000000');
  const [preset, setPreset] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preset) {
      const presetConfig = presetAnimations[preset as keyof typeof presetAnimations];
      setAnimation(presetConfig.animation as AnimationVariant);
      setDuration(presetConfig.duration);
      setRepeat(presetConfig.repeat === Infinity ? -1 : presetConfig.repeat);
      setYoyo(presetConfig.yoyo);
    }
  }, [preset]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.startsWith('image/svg') || file.type.startsWith('image/png'))) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof e.target?.result === 'string') {
          setFile(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload an SVG or PNG file.');
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleExport = () => {
    if (file) {
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500" style="background: transparent;">
          <defs>
            <filter id="colorOverlay">
              <feFlood flood-color="${color}" flood-opacity="0.5"/>
              <feBlend in="SourceGraphic" in2="flood" mode="multiply"/>
            </filter>
          </defs>
          <image xlink:href="${file}" width="100%" height="100%"/>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="${getAnimationType()}"
            dur="${duration}s"
            begin="${delay}s"
            repeatCount="${repeat === -1 ? 'indefinite' : repeat}"
            values="${getAnimationValues()}"
            keyTimes="0;0.5;1"
            calcMode="${yoyo ? 'spline' : 'linear'}"
            keySplines="${yoyo ? '0.5 0 0.5 1; 0.5 0 0.5 1' : ''}"
          />
        </svg>
      `;

      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'animated_image.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert('No file to export.');
    }
  };

  const getAnimationType = () => {
    switch (animation) {
      case 'pulse':
      case 'scaleIn':
      case 'bounceIn':
        return 'scale';
      case 'rotateIn':
      case 'swing':
        return 'rotate';
      case 'slideInLeft':
      case 'slideInRight':
      case 'shake':
        return 'translate';
      default:
        return 'scale';
    }
  };

  const getAnimationValues = () => {
    switch (animation) {
      case 'pulse':
        return '1;1.1;1';
      case 'scaleIn':
        return '0;1;1';
      case 'bounceIn':
        return '0;1.2;1';
      case 'rotateIn':
        return '-180 0 0;0 0 0;0 0 0';
      case 'swing':
        return '0 0 0;15 0 0;-15 0 0';
      case 'slideInLeft':
        return '-100% 0;0 0;0 0';
      case 'slideInRight':
        return '100% 0;0 0;0 0';
      case 'shake':
        return '-10 0;10 0;0 0';
      default:
        return '1;1.1;1';
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      <div className="w-full md:w-1/2 space-y-4">
        <Input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          accept=".svg,.png"
        />
        <Button onClick={() => fileInputRef.current?.click()} className="w-full">
          <FileUp className="mr-2 h-4 w-4" /> Choose File
        </Button>
        <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
          {file ? (
            <AnimatePresence>
              {isPlaying && (
                <motion.img
                  key={file}
                  src={file}
                  alt="Animated image"
                  initial={animationVariants[animation].initial}
                  animate={animationVariants[animation].animate}
                  exit={animationVariants[animation].initial}
                  transition={{
                    duration,
                    delay,
                    repeat: repeat === -1 ? Infinity : repeat,
                    yoyo: yoyo,
                  }}
                  className="max-w-full max-h-full"
                  style={{ filter: `opacity(0.5) drop-shadow(0 0 0 ${color})` }}
                />
              )}
            </AnimatePresence>
          ) : (
            <p className="text-gray-500">Upload an SVG or PNG to preview animation</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePlayPause} className="flex-1" disabled={!file}>
            {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            onClick={() => {
              setIsPlaying(false);
              setTimeout(() => setIsPlaying(true), 50);
            }}
            className="flex-1"
            disabled={!file}
          >
            <RotateCw className="mr-2 h-4 w-4" /> Restart
          </Button>
          <Button onClick={handleExport} className="flex-1" disabled={!file}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <div>
          <Label>Preset Animations</Label>
          <Select onValueChange={(value) => setPreset(value as keyof typeof presetAnimations)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a preset" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(presetAnimations).map((presetName) => (
                <SelectItem key={presetName} value={presetName}>
                  {presetName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Animation Type</Label>
          <Select onValueChange={(value) => setAnimation(value as AnimationVariant)} value={animation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(animationVariants).map((anim) => (
                <SelectItem key={anim} value={anim}>
                  {anim}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Duration: {duration.toFixed(1)}s</Label>
          <Slider
            min={0.1}
            max={5}
            step={0.1}
            value={[duration]}
            onValueChange={(value) => setDuration(value[0])}
          />
        </div>
        <div>
          <Label>Delay: {delay.toFixed(1)}s</Label>
          <Slider
            min={0}
            max={5}
            step={0.1}
            value={[delay]}
            onValueChange={(value) => setDelay(value[0])}
          />
        </div>
        <div>
          <Label>Repeat: {repeat === -1 ? "Infinite" : repeat}</Label>
          <Slider
            min={-1}
            max={10}
            step={1}
            value={[repeat]}
            onValueChange={(value) => setRepeat(value[0])}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="yoyo" checked={yoyo} onCheckedChange={setYoyo} />
          <Label htmlFor="yoyo">Yoyo Effect</Label>
        </div>
        <div>
          <Label>Color Overlay</Label>
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10"
          />
        </div>
        <Image src="final-final.svg" width="500" height="200" className='bg-white'/>
      </div>
    </div>
  );
};

export default ImageAnimator;