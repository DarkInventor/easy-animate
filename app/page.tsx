"use client";

import React, { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, Play, Pause, RotateCw, Download, Layers, Type, Image as ImageIcon } from 'lucide-react';
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
  flip: {
    animate: { rotateY: [0, 180, 360] },
  },
  jello: {
    animate: { skew: ['0deg, 0deg', '-12.5deg, -12.5deg', '6.25deg, 6.25deg', '-3.125deg, -3.125deg', '1.5625deg, 1.5625deg', '0deg, 0deg'] },
  },
  rubberBand: {
    animate: { 
      scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1],
      scaleY: [1, 0.75, 1.25, 0.85, 1.05, 1],
    },
  },
  tada: {
    animate: {
      scale: [1, 0.9, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
      rotate: [0, -3, -3, 3, -3, 3, -3, 3, -3, 0],
    },
  },
  heartbeat: {
    animate: { scale: [1, 1.3, 1, 1.3, 1] },
  },
  glitch: {
    animate: {
      x: [-2, 2, -2, 2, 0],
      y: [2, -2, 2, -2, 0],
      filter: [
        'hue-rotate(0deg)',
        'hue-rotate(90deg)',
        'hue-rotate(180deg)',
        'hue-rotate(270deg)',
        'hue-rotate(0deg)',
      ],
    },
  },
  wobble: {
    animate: {
      rotate: [0, -5, 3, -3, 2, -1, 0],
      x: [0, -25, 20, -15, 10, -5, 0],
    },
  },
  bounce: {
    animate: {
      y: [0, -30, 0, -15, 0, -5, 0],
    },
  },
};

export default function Component() {
  const [file, setFile] = useState<string | null>(null);
  const [animation, setAnimation] = useState<AnimationVariant>('fadeIn');
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [repeat, setRepeat] = useState(0);
  const [yoyo, setYoyo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [color, setColor] = useState('#000000');
  const [scale, setScale] = useState(0.45);
  const [rotate, setRotate] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(1);
  const [isText, setIsText] = useState(false);
  const [textContent, setTextContent] = useState('Your Text Here');
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textStroke, setTextStroke] = useState(0);
  const [textStrokeColor, setTextStrokeColor] = useState('#000000');
  const [blur, setBlur] = useState(0);
  const [glow, setGlow] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [layers, setLayers] = useState<Array<{ type: 'image' | 'text', content: string }>>([]);
  const [selectedLayer, setSelectedLayer] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.startsWith('image/svg') || file.type.startsWith('image/png'))) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof e.target?.result === 'string') {
          setFile(e.target.result);
          setLayers([...layers, { type: 'image', content: e.target.result }]);
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
    if (layers.length > 0) {
      let svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
          <style>
            @keyframes ${animation} {
              ${getKeyframesForAnimation(animation)}
            }
            .animated-element {
              animation: ${animation} ${duration}s ${delay}s ${repeat === -1 ? 'infinite' : repeat} ${yoyo ? 'alternate' : 'normal'} linear;
              transform-origin: center;
              opacity: ${opacity};
              filter: blur(${blur}px) drop-shadow(0 0 ${glow}px ${color})
                      hue-rotate(${hueRotate}deg) saturate(${saturation}%)
                      brightness(${brightness}%) contrast(${contrast}%)
                      grayscale(${grayscale}%);
            }
          </style>
          <rect width="100%" height="100%" fill="${backgroundColor}" />
      `;

      layers.forEach((layer, index) => {
        if (layer.type === 'image') {
          svgContent += `
            <g class="animated-element" transform="translate(250, 250)">
              <image xlink:href="${layer.content}" width="100%" height="100%" x="-250" y="-250"
                     transform="scale(${scale}) rotate(${rotate}) translate(${position.x}, ${position.y})" />
            </g>
          `;
        } else if (layer.type === 'text') {
          svgContent += `
            <g class="animated-element" transform="translate(250, 250)">
              <text class="animated-text" text-anchor="middle" dominant-baseline="middle"
                    transform="scale(${scale}) rotate(${rotate}) translate(${position.x}, ${position.y})"
                    font-family="${fontFamily}" font-size="${fontSize}px" fill="${color}"
                    stroke="${textStrokeColor}" stroke-width="${textStroke}px">
                ${layer.content}
              </text>
            </g>
          `;
        }
      });

      svgContent += `</svg>`;

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'animated_layers.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert('No content to export. Please add at least one layer.');
    }
  };

  const getKeyframesForAnimation = (animationType: AnimationVariant) => {
    switch (animationType) {
      case 'fadeIn':
        return `
          0% { opacity: 0; }
          100% { opacity: 1; }
        `;
      case 'scaleIn':
        return `
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        `;
      case 'rotateIn':
        return `
          0% { transform: rotate(-180deg); opacity: 0; }
          100% { transform: rotate(0deg); opacity: 1; }
        `;
      case 'slideInLeft':
        return `
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        `;
      case 'slideInRight':
        return `
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        `;
      case 'bounceIn':
        return `
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        `;
      case 'shake':
        return `
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        `;
      case 'pulse':
        return `
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        `;
      case 'swing':
        return `
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(5deg); }
          80% { transform: rotate(-5deg); }
        `;
      case 'flip':
        return `
          0% { transform: perspective(400px) rotateY(0); }
          100% { transform: perspective(400px) rotateY(360deg); }
        `;
      case 'jello':
        return `
          0%, 100% { transform: skew(0deg, 0deg); }
          30% { transform: skew(-12.5deg, -12.5deg); }
          40% { transform: skew(6.25deg, 6.25deg); }
          50% { transform: skew(-3.125deg, -3.125deg); }
          65% { transform: skew(1.5625deg, 1.5625deg); }
        `;
      case 'rubberBand':
        return `
          0% { transform: scale(1, 1); }
          30% { transform: scale(1.25, 0.75); }
          40% { transform: scale(0.75, 1.25); }
          50% { transform: scale(1.15, 0.85); }
          65% { transform: scale(0.95, 1.05); }
          75% { transform: scale(1.05, 0.95); }
          100% { transform: scale(1, 1); }
        `;
      case 'tada':
        return `
          0% { transform: scale(1) rotate(0deg); }
          10%, 20% { transform: scale(0.9) rotate(-3deg); }
          30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
          40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); }
        `;
      case 'heartbeat':
        return `
          0% { transform: scale(1); }
          14% { transform: scale(1.3); }
          28% { transform: scale(1); }
          42% { transform: scale(1.3); }
          70% { transform: scale(1); }
        `;
      case 'glitch':
        return `
          0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
          20% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
          40% { transform: translate(2px, -2px); filter: hue-rotate(180deg); }
          60% { transform: translate(-2px, 2px); filter: hue-rotate(270deg); }
          80% { transform: translate(2px, -2px); filter: hue-rotate(360deg); }
        `;
      case 'wobble':
        return `
          0% { transform: translate(0, 0) rotate(0deg); }
          15% { transform: translate(-25px, 0) rotate(-5deg); }
          30% { transform: translate(20px, 0) rotate(3deg); }
          45% { transform: translate(-15px, 0) rotate(-3deg); }
          60% { transform: translate(10px, 0) rotate(2deg); }
          75% { transform: translate(-5px, 0) rotate(-1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        `;
      case 'bounce':
        return `
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-30px); }
          60% { transform: translateY(-15px); }
        `;
      default:
        return '';
    }
  };

  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

  const handleRotateChange = (value: number[]) => {
    setRotate(value[0]);
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number[]) => {
    setPosition(prev => ({ ...prev, [axis]: value[0] }));
  };

  const handleOpacityChange = (value: number[]) => {
    setOpacity(value[0]);
  };

  const handleTextContentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextContent(e.target.value);
    if (layers[selectedLayer]?.type === 'text') {
      const newLayers = [...layers];
      newLayers[selectedLayer].content = e.target.value;
      setLayers(newLayers);
    }
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
  };

  const handleTextStrokeChange = (value: number[]) => {
    setTextStroke(value[0]);
  };

  const handleBlurChange = (value: number[]) => {
    setBlur(value[0]);
  };

  const handleGlowChange = (value: number[]) => {
    setGlow(value[0]);
  };

  const handleHueRotateChange = (value: number[]) => {
    setHueRotate(value[0]);
  };

  const handleSaturationChange = (value: number[]) => {
    setSaturation(value[0]);
  };

  const handleBrightnessChange = (value: number[]) => {
    setBrightness(value[0]);
  };

  const handleContrastChange = (value: number[]) => {
    setContrast(value[0]);
  };

  const handleGrayscaleChange = (value: number[]) => {
    setGrayscale(value[0]);
  };

  const addTextLayer = () => {
    setLayers([...layers, { type: 'text', content: 'New Text Layer' }]);
    setSelectedLayer(layers.length);
  };

  const removeLayer = (index: number) => {
    const newLayers = layers.filter((_, i) => i !== index);
    setLayers(newLayers);
    if (selectedLayer >= newLayers.length) {
      setSelectedLayer(newLayers.length - 1);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-100 p-4 overflow-y-auto border-r border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-center">Animation Type</h2>
        <div className="grid grid-cols-3 gap-2">
          {Object.keys(animationVariants).map((anim) => (
            <div
              key={anim}
              className={`aspect-square bg-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${
                animation === anim ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setAnimation(anim as AnimationVariant)}
            >
              <motion.div
                className="w-8 h-8 bg-blue-500 rounded-md"
                animate={animationVariants[anim as AnimationVariant].animate}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Image Animator</h1>
          <div className="flex space-x-2">
            <Button onClick={handlePlayPause} disabled={layers.length === 0} variant="outline">
              {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={() => {
              setIsPlaying(false);
              setTimeout(() => setIsPlaying(true), 50);
            }} disabled={layers.length === 0} variant="outline">
              <RotateCw className="mr-2 h-4 w-4" /> Restart
            </Button>
            <Button onClick={handleExport} disabled={layers.length === 0} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </header>

        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
          <div className="aspect-square w-full max-w-2xl bg-white flex items-center justify-center rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor }}>
            <AnimatePresence>
              {isPlaying && layers.map((layer, index) => (
                <motion.div
                  key={index}
                  initial={animationVariants[animation].initial}
                  animate={animationVariants[animation].animate}
                  exit={animationVariants[animation].initial}
                  transition={{
                    duration,
                    delay,
                    repeat: repeat === -1 ? Infinity : repeat,
                    repeatType: yoyo ? "reverse" : "loop",
                  }}
                  style={{
                    position: 'absolute',
                    fontSize: `${fontSize}px`,
                    fontFamily,
                    color,
                    WebkitTextStroke: `${textStroke}px ${textStrokeColor}`,
                    scale,
                    rotate,
                    x: position.x,
                    y: position.y,
                    opacity,
                    filter: `blur(${blur}px) drop-shadow(0 0 ${glow}px ${color}) 
                             hue-rotate(${hueRotate}deg) saturate(${saturation}%) 
                             brightness(${brightness}%) contrast(${contrast}%) 
                             grayscale(${grayscale}%)`,
                  }}
                >
                  {layer.type === 'text' ? layer.content : <img src={layer.content} alt="Animated layer" className="max-w-[600px] max-h-auto" />}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-gray-100 p-4 overflow-y-auto border-l border-gray-200">
        <Tabs defaultValue="layers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="animation">Animation</TabsTrigger>
          </TabsList>
          <TabsContent value="layers">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  <ImageIcon className="mr-2 h-4 w-4" /> Add Image
                </Button>
                <Button onClick={addTextLayer} variant="outline">
                  <Type className="mr-2 h-4 w-4" /> Add Text
                </Button>
              </div>
              <Input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                accept=".svg,.png"
              />
              {layers.map((layer, index) => (
                <div key={index} className={`flex items-center justify-between p-2 rounded ${selectedLayer === index ? 'bg-blue-100' : 'bg-white'}`}>
                  <div className="flex items-center">
                    {layer.type === 'image' ? <ImageIcon className="mr-2 h-4 w-4" /> : <Type className="mr-2 h-4 w-4" />}
                    <span className="truncate w-40">{layer.type === 'text' ? layer.content : `Image ${index + 1}`}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeLayer(index)}>Remove</Button>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="animation">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="animation" className="border-b border-gray-200">
                <AccordionTrigger className="text-lg font-semibold">Animation</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Duration: {duration.toFixed(1)}s</Label>
                      <Slider
                        min={0.1}
                        max={5}
                        step={0.1}
                        value={[duration]}
                        onValueChange={(value) => setDuration(value[0])}
                        className="mt-2"
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
                        className="mt-2"
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
                        className="mt-2"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="yoyo" checked={yoyo} onCheckedChange={setYoyo} />
                      <Label htmlFor="yoyo">Yoyo Effect</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="transform" className="border-b border-gray-200">
                <AccordionTrigger className="text-lg font-semibold">Transform</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Scale: {scale.toFixed(2)}</Label>
                      <Slider
                        min={0.1}
                        max={3}
                        step={0.05}
                        value={[scale]}
                        onValueChange={handleScaleChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Rotate: {rotate}°</Label>
                      <Slider
                        min={-180}
                        max={180}
                        step={1}
                        value={[rotate]}
                        onValueChange={handleRotateChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Position X: {position.x}px</Label>
                      <Slider
                        min={-100}
                        max={100}
                        step={1}
                        value={[position.x]}
                        onValueChange={(value) => handlePositionChange('x', value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Position Y: {position.y}px</Label>
                      <Slider
                        min={-100}
                        max={100}
                        step={1}
                        value={[position.y]}
                        onValueChange={(value) => handlePositionChange('y', value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="style" className="border-b border-gray-200">
                <AccordionTrigger className="text-lg font-semibold">Style</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Opacity: {opacity.toFixed(2)}</Label>
                      <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={[opacity]}
                        onValueChange={handleOpacityChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Background Color</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-12 h-12 p-1 bg-transparent"
                        />
                        <Input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-grow"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Overlay Color</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-12 h-12 p-1 bg-transparent"
                        />
                        <Input
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="flex-grow"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="effects" className="border-b border-gray-200">
                <AccordionTrigger className="text-lg font-semibold">Effects</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Blur: {blur}px</Label>
                      <Slider
                        min={0}
                        max={20}
                        step={1}
                        value={[blur]}
                        onValueChange={handleBlurChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Glow: {glow}px</Label>
                      <Slider
                        min={0}
                        max={20}
                        step={1}
                        value={[glow]}
                        onValueChange={handleGlowChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Hue Rotate: {hueRotate}°</Label>
                      <Slider
                        min={0}
                        max={360}
                        step={1}
                        value={[hueRotate]}
                        onValueChange={handleHueRotateChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Saturation: {saturation}%</Label>
                      <Slider
                        min={0}
                        max={200}
                        step={1}
                        value={[saturation]}
                        onValueChange={handleSaturationChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Brightness: {brightness}%</Label>
                      <Slider
                        min={0}
                        max={200}
                        step={1}
                        value={[brightness]}
                        onValueChange={handleBrightnessChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Contrast: {contrast}%</Label>
                      <Slider
                        min={0}
                        max={200}
                        step={1}
                        value={[contrast]}
                        onValueChange={handleContrastChange}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Grayscale: {grayscale}%</Label>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[grayscale]}
                        onValueChange={handleGrayscaleChange}
                        className="mt-2"
                      />
                    </div>
                    <Image src="/animated_text.svg" width="100" height="100" />
                  </div>
                </AccordionContent>
              </AccordionItem>
              {layers[selectedLayer]?.type === 'text' && (
                <AccordionItem value="text" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-semibold">Text Options</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Text Content</Label>
                        <Input
                          type="text"
                          value={layers[selectedLayer].content}
                          onChange={handleTextContentChange}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Font Size: {fontSize}px</Label>
                        <Slider
                          min={12}
                          max={120}
                          step={1}
                          value={[fontSize]}
                          onValueChange={handleFontSizeChange}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Font Family</Label>
                        <Select onValueChange={setFontFamily} value={fontFamily}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Verdana">Verdana</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Courier">Courier</SelectItem>
                            <SelectItem value="serif">Serif</SelectItem>
                            <SelectItem value="sans-serif">Sans-serif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Text Stroke Width: {textStroke}px</Label>
                        <Slider
                          min={0}
                          max={20}
                          step={1}
                          value={[textStroke]}
                          onValueChange={handleTextStrokeChange}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Text Stroke Color</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Input
                            type="color"
                            value={textStrokeColor}
                            onChange={(e) => setTextStrokeColor(e.target.value)}
                            className="w-12 h-12 p-1 bg-transparent"
                          />
                          <Input
                            type="text"
                            value={textStrokeColor}
                            onChange={(e) => setTextStrokeColor(e.target.value)}
                            className="flex-grow"
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}