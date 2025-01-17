import { forwardRef } from 'react';
import Canvas from './Canvas';
import styles from './data/styles';
import { Axis, MarkStyle, NumberStyle, SlideRuleProps } from './data/type';

const DEFAULT_X_AXIS_PROPS: SlideRuleProps = {
  width: 300,
  height: 55,
  cursor: <div style={{ width: 4, height: 35, backgroundColor: '#2AA' }} />,
  markStyle: { color: '#C4C4C4', width: 3, height: 30, top: 0 },
  smallerMarkStyle: { color: '#E4E4E4', width: 2, height: 15, top: 0 },
  numberStyle: {
    size: '1.25em',
    family: 'Arial',
    color: 'rgba(0, 0, 0, 0.87)',
    top: 36,
    textAlign: 'center',
    textBaseline: 'top',
    rotate: 0,
  },
  pointers: [],
  onPointerUp: () => {}
};

const DEFAULT_Y_AXIS_PROPS: SlideRuleProps = {
  width: 75,
  height: 300,
  cursor: <div style={{ width: 35, height: 4, backgroundColor: '#2AA' }} />,
  markStyle: { color: '#C4C4C4', width: 30, height: 3, left: 0 },
  smallerMarkStyle: { color: '#E4E4E4', width: 15, height: 2, left: 0 },
  numberStyle: {
    size: '1.25em',
    family: 'Arial',
    color: 'rgba(0, 0, 0, 0.87)',
    left: 36,
    textAlign: 'left',
    textBaseline: 'middle',
    rotate: 0,
  },
  pointers: [],
};

const _isXAxis = (axis: Axis): boolean => axis === 'x' || axis === 'x-reverse';

const _getOrMerge = (
  source: MarkStyle | NumberStyle = {},
  target?: MarkStyle | NumberStyle
): MarkStyle | NumberStyle => {
  try {
    return target ? { ...source, ...target } : source;
  } catch (e) {
    return source;
  }
};

const SlideRule = forwardRef<HTMLDivElement, SlideRuleProps>(function SlideRule(
  props,
  ref
) {
  const {
    onChange = (v: number) => v,
    gap = 10,
    step = 1,
    max = 300,
    min = 0,
    value = 150,
    axis = 'x',
    markStyle,
    smallerMarkStyle,
    numberStyle,
    unit = '',
    style,
    showWarning = false,
    pointers = [],
    onPointerUp, // no default here
    ...rest
  } = props;

  if (showWarning) validate({ value, min, max, step });

  const defaults = _isXAxis(axis) ? DEFAULT_X_AXIS_PROPS : DEFAULT_Y_AXIS_PROPS;

  const {
    width = defaults.width!,
    height = defaults.height!,
    cursor = defaults.cursor,
  } = rest;

  // Handle onPointerUp event, using the passed prop if available
  const handlePointerUp = () => {
    if (onPointerUp) {
      onPointerUp();
    } else {
      console.log('onPointerUp detected');
    }
  };

  return (
    <div ref={ref} style={styles.createRootStyle(style) as React.CSSProperties}>
      <Canvas
        onPointerUp={handlePointerUp} // Pass the event handler
        onChange={onChange}
        gap={gap}
        step={step}
        max={max}
        min={min}
        value={Number(value)}
        axis={axis}
        markStyle={_getOrMerge(defaults.markStyle, markStyle)}
        smallerMarkStyle={_getOrMerge(defaults.smallerMarkStyle, smallerMarkStyle)}
        numberStyle={_getOrMerge(defaults.numberStyle, numberStyle) as NumberStyle}
        width={width}
        height={height}
        unit={unit}
        pointers={pointers}
      />
      <div style={styles.createCenterStyle(_isXAxis(axis)) as React.CSSProperties}>{cursor}</div>
    </div>
  );
});

export default SlideRule;

function validate(options: {
  value: number;
  min: number;
  max: number;
  step: number;
}) {
  const { value, min, max, step } = options;
  if (typeof value !== 'number') console.warn('value prop should be number!');
  if (!Number.isInteger(min / step))
    console.warn('min prop should be a multiple of the step prop');
  if (!Number.isInteger(max / step))
    console.warn('max prop should be a multiple of the step prop');
  if (!Number.isInteger(value / step))
    console.warn('value prop should be a multiple of the step prop');
}