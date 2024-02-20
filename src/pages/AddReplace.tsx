import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas'

import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

import { useInit } from '../hooks'

import Button from '../kit/Button'
import Input from '../kit/Input'
import Header from '../kit/Header'
import HelpButton from '../kit/HelpButton'
import Limiter from '../kit/Limiter'
import Range from '../kit/Range'
import Toggle from '../kit/Toggle'
import Tool from '../kit/Tool'
import ToolBar from '../kit/ToolBar'
import Screen from '../kit/Screen'

import testPhoto from '../assets/test-photo.jpg'

import { ReactComponent as IconSettings } from '../assets/settings.svg'

function AddReplace({ mode } : { mode?: 'ERASE'}) {
  useInit()

  const canvasRef = useRef<ReactSketchCanvasRef>(null)
  const [strokeWidth/*, setStrokeWidth */] = useState<number>(16)

  const DEFAULT = {
    strength: 4,
    negativePropmt: '',
    isForceInsert: true,
  }

  const [currentTool, setCurrentTool] = useState<'PEN' | 'ERASER'>('PEN')
  const [isSettingsOpen, setSettingsOpen] = useState(false)
  const [strength, setStrength] = useState(DEFAULT.strength)
  const [negativePropmt, setNegativePrompt] = useState(DEFAULT.negativePropmt)
  const [prompt, setPrompt] = useState('')
  const [isForceInsert, setIsForceInsert] = useState(DEFAULT.isForceInsert)
  const [animateParentRef] = useAutoAnimate()

  const resetSettings = () => {
    setStrength(DEFAULT.strength)
    setNegativePrompt(DEFAULT.negativePropmt)
    setIsForceInsert(DEFAULT.isForceInsert)
  }

  const save = () => {
    canvasRef.current?.exportImage('png')
      .then(data => {
        console.log(data);
        const image = new Image()
        image.src = data

        const w = window.open('')
        w?.document.write(image.outerHTML)
      })
      .catch(e => {
        console.log(e);
      })
  }

  const src = testPhoto;
  const scaleUp = true;
  const zoomFactor = 8;

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const [imageNaturalWidth, setImageNaturalWidth] = useState<number>(0);
  const [imageNaturalHeight, setImageNaturalHeight] = useState<number>(0);

  const imageScale = useMemo(() => {
    if (
      containerWidth === 0 ||
      containerHeight === 0 ||
      imageNaturalWidth === 0 ||
      imageNaturalHeight === 0
    )
      return 0;
    const scale = Math.min(
      containerWidth / imageNaturalWidth,
      containerHeight / imageNaturalHeight,
    );
    return scaleUp ? scale : Math.max(scale, 1);
  }, [
    scaleUp,
    containerWidth,
    containerHeight,
    imageNaturalWidth,
    imageNaturalHeight,
  ]);

  const handleResize = useCallback(() => {
    if (container !== null) {
      const rect = container.getBoundingClientRect();
      setContainerWidth(rect.width);
      setContainerHeight(rect.height);
    } else {
      setContainerWidth(0);
      setContainerHeight(0);
    }
  }, [container]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const handleImageOnLoad = (image: HTMLImageElement) => {
    setImageNaturalWidth(image.naturalWidth);
    setImageNaturalHeight(image.naturalHeight);
  };

  useEffect(() => {
    const image = new Image();
    image.onload = () => handleImageOnLoad(image);
    image.src = src;
  }, [src]);

  const scaleFactor = 1

  return (
    <Screen isBottomButton className="flex flex-col !pt-0">
      <Header onBack={() => { history.back() }} />

      <div className="flex-1 relative select-none">
        <div
          className="absolute w-[100%] h-[100%] bg-[#8881]"
          ref={(el: HTMLDivElement | null) => setContainer(el)}
        >
          {imageScale > 0 && (
            <TransformWrapper
              initialScale={scaleFactor || imageScale}
              minScale={scaleFactor || imageScale}
              maxScale={(scaleFactor || imageScale) * zoomFactor}
              centerOnInit

              doubleClick={{ excluded: [], step: 0.7 }}
              onInit={function noRefCheck(){}}
              onPanning={function noRefCheck(){}}
              onPanningStart={function noRefCheck(){}}
              onPanningStop={function noRefCheck(){}}
              onPinching={function noRefCheck(){}}
              onPinchingStart={function noRefCheck(){}}
              onPinchingStop={function noRefCheck(){}}
              onTransformed={function noRefCheck(){}}
              onWheel={function noRefCheck(){}}
              onWheelStart={function noRefCheck(){}}
              onWheelStop={function noRefCheck(){}}
              onZoom={function noRefCheck(){}}
              onZoomStart={function noRefCheck(){}}
              onZoomStop={function noRefCheck(){}}
              panning={{ activationKeys: [], excluded: [] }}
              pinch={{ excluded: [], step: 5 }}
              wheel={{ activationKeys: [], excluded: [], smoothStep: 0.001, step: 0.2 }}
            >
              <TransformComponent
                wrapperStyle={{ width: '100%', height: '100%' }}
              >
                <div className="EditorFieldWrapper inline relative ?outline-dotted">
                  <img
                    className="block"
                    src={src}
                  />
                  <ReactSketchCanvas
                    ref={canvasRef}
                    // width="100%"
                    // height="150px"
                    className="EditorField absolute left-0 top-0 w-full h-full border-none ?border-red-600 !rounded-none text-[#9e3e6caa]"
                    canvasColor="transparent"
                    strokeWidth={strokeWidth}
                    eraserWidth={strokeWidth}
                    strokeColor="currentColor"
                  />
                </div>
              </TransformComponent>
            </TransformWrapper>
          )}
        </div>
      </div>

      <div className="">
        <ToolBar groups={[
          <>
            <Tool
              type="Undo"
              onClick={() => {
                canvasRef.current?.undo()
              }}
            />
            <Tool
              type="Redo"
              onClick={() => {
                canvasRef.current?.redo()
              }}
            />
          </>,
          <>
            <Tool
              type="Draw"
              isActive={currentTool === 'PEN'}
              onClick={() => {
                setCurrentTool('PEN')
                canvasRef.current?.eraseMode(false)
              }} />
            <Tool
              type="Erase"
              isActive={currentTool === 'ERASER'}
              onClick={() => {
                setCurrentTool('ERASER')
                canvasRef.current?.eraseMode(true)
              }} />
          </>,
          <>
            <Tool
              type="Invert"
              onClick={() => {
                // canvasRef.current?.clearCanvas()
              }}
            />
            <Tool
              type="Clear"
              onClick={() => {
                canvasRef.current?.clearCanvas()
              }}
            />
          </>
        ]} />

        <div ref={animateParentRef} className="relative overflow-hidden">
          {mode !== 'ERASE' && (
            <div className="mt-4 flex gap-3 overflow-hidden">
              <Input
                placeholder="Prompt, e.g. darth vader"
                value={prompt}
                onChange={setPrompt}
              />
              <button
                className="w-[44px] h-[44px] flex items-center justify-center text-accent enabled:hover:brightness-[1.2] enabled:active:brightness-[1.4] enabled:active:scale-[90%] transition-all"
                onClick={() => { setSettingsOpen(true) }}
              >
                <IconSettings />
              </button>
            </div>
          )}
        </div>

        <BottomSheet
          open={isSettingsOpen}
          onDismiss={() => { setSettingsOpen(false) }}
        >
          <Limiter>
            <div className="px-4 pb-5">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <h3 className="text-[17px] font-semibold leading-[22px] tracking-[-0.5px]">Image strength</h3>
                      <HelpButton />
                    </div>
                    <div className="text-[15px] font-semibold leading-[20px] tracking-[-0.24px] text-accent">{strength}</div>
                  </div>
                  <Range
                    min={1}
                    max={10}
                    value={strength}
                    onInput={setStrength}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-start gap-1">
                    <h3 className="text-[17px] font-semibold leading-[22px] tracking-[-0.5px]">Negative prompt</h3>
                    <HelpButton />
                  </div>
                  <Input
                    placeholder="For example, black background"
                    value={negativePropmt}
                    onChange={setNegativePrompt}
                  />
                </div>

                <div className="flex items-center justify-start gap-3">
                  <Toggle
                    checked={isForceInsert}
                    onChange={setIsForceInsert}
                  />
                  <div className="flex items-center justify-start gap-1">
                    <h3 className="text-[17px] font-semibold leading-[22px] tracking-[-0.5px]">Forse insert</h3>
                    <HelpButton />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex-1">
                  <Button
                    theme="primary"
                    text="Save"
                    onClick={() => { setSettingsOpen(false) }}
                  />
                </div>
                <div className="flex-1">
                  <Button
                    theme="secondary"
                    text="Reset"
                    onClick={resetSettings}
                  />
                </div>
              </div>
            </div>
          </Limiter>
        </BottomSheet>
      </div>

    <Button
      isBottom
      text={mode === 'ERASE' ? 'Remove' : 'Generate'}
      onClick={save}
      // disabled={isButtonDisabled}
      // isBusy={isBusy}
    />
    </Screen>
  )
}

export default AddReplace
