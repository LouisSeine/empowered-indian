import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './RangeSlider.css';

/**
 * RangeSlider Component
 * 
 * A fully accessible, mobile-friendly dual-handle range slider component
 * with debounced onChange, keyboard navigation, and touch support.
 * 
 * Features:
 * - Smooth dragging with mouse and touch support
 * - Visual track with active range highlighting
 * - Real-time value labels with custom formatting
 * - Comprehensive keyboard navigation (arrows, page up/down, home/end)
 * - ARIA labels and screen reader support
 * - 44px touch targets for mobile accessibility
 * - 300ms debounced onChange to prevent excessive API calls
 * - Responsive design with breakpoints for different screen sizes
 * 
 * @param {Object} props
 * @param {number} props.min - Minimum value of the range
 * @param {number} props.max - Maximum value of the range
 * @param {Array} props.value - Current value as [minValue, maxValue]
 * @param {Function} props.onChange - Callback function with debounced updates (300ms delay)
 * @param {Function} props.format - Function to format display values (default: toString)
 * @param {string} props.label - Accessible label for the slider
 * @param {number} props.step - Increment size (default: 1)
 * @param {boolean} props.disabled - Whether the slider is disabled (default: false)
 * 
 * @example
 * // Basic usage
 * <RangeSlider
 *   min={0}
 *   max={100}
 *   value={[25, 75]}
 *   onChange={setRange}
 *   label="Basic Range"
 * />
 * 
 * @example
 * // Currency formatting for MPLADS funds
 * <RangeSlider
 *   min={0}
 *   max={1000000}
 *   value={fundRange}
 *   onChange={setFundRange}
 *   format={(val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val)}
 *   label="Fund Allocation Range"
 *   step={10000}
 * />
 * 
 * @example
 * // Percentage formatting for utilization rates
 * <RangeSlider
 *   min={0}
 *   max={100}
 *   value={utilizationRange}
 *   onChange={setUtilizationRange}
 *   format={(val) => `${val}%`}
 *   label="Utilization Rate"
 *   step={5}
 * />
 */
const RangeSlider = ({
  min = 0,
  max = 100,
  value = [min, max],
  onChange,
  format = (val) => val.toString(),
  label = 'Range Slider',
  step = 1,
  disabled = false
}) => {
  // Internal state for immediate UI updates
  const [internalValue, setInternalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(null);
  const [focusedHandle, setFocusedHandle] = useState(null);
  
  // Refs for DOM elements
  const sliderRef = useRef(null);
  const minHandleRef = useRef(null);
  const maxHandleRef = useRef(null);
  const debounceTimerRef = useRef(null);
  
  // Sync internal value with external value prop
  useEffect(() => {
    setInternalValue(value);
  }, [value]);
  
  // Debounced onChange function
  const debouncedOnChange = useCallback((newValue) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (onChange) {
        onChange(newValue);
      }
    }, 300);
  }, [onChange]);
  
  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  // Calculate percentage position for handles
  const getPercentage = useCallback((val) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);
  
  // Calculate value from percentage
  const getValueFromPercentage = useCallback((percentage) => {
    const rawValue = min + (percentage / 100) * (max - min);
    return Math.round(rawValue / step) * step;
  }, [min, max, step]);
  
  // Get client position from event (mouse or touch)
  const getClientX = useCallback((event) => {
    return event.touches ? event.touches[0].clientX : event.clientX;
  }, []);
  
  // Update value based on pointer position
  const updateValueFromPosition = useCallback((clientX, handleType) => {
    if (!sliderRef.current || disabled) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const newValue = getValueFromPercentage(percentage);
    
    setInternalValue(prevValue => {
      let newMinValue = prevValue[0];
      let newMaxValue = prevValue[1];
      
      if (handleType === 'min') {
        newMinValue = Math.min(newValue, prevValue[1]);
      } else {
        newMaxValue = Math.max(newValue, prevValue[0]);
      }
      
      const updatedValue = [newMinValue, newMaxValue];
      debouncedOnChange(updatedValue);
      return updatedValue;
    });
  }, [disabled, getValueFromPercentage, debouncedOnChange]);
  
  // Mouse/Touch event handlers
  const handlePointerDown = useCallback((event, handleType) => {
    if (disabled) return;
    
    event.preventDefault();
    setIsDragging(handleType);
    
    const clientX = getClientX(event);
    updateValueFromPosition(clientX, handleType);
    
    // Focus the appropriate handle for keyboard accessibility
    if (handleType === 'min') {
      minHandleRef.current?.focus();
    } else {
      maxHandleRef.current?.focus();
    }
  }, [disabled, getClientX, updateValueFromPosition]);
  
  const handlePointerMove = useCallback((event) => {
    if (!isDragging || disabled) return;
    
    event.preventDefault();
    const clientX = getClientX(event);
    updateValueFromPosition(clientX, isDragging);
  }, [isDragging, disabled, getClientX, updateValueFromPosition]);
  
  const handlePointerUp = useCallback(() => {
    setIsDragging(null);
  }, []);
  
  // Global event listeners for drag operations
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handlePointerMove(e);
      const handleMouseUp = () => handlePointerUp();
      const handleTouchMove = (e) => handlePointerMove(e);
      const handleTouchEnd = () => handlePointerUp();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((event, handleType) => {
    if (disabled) return;
    
    let delta = 0;
    const currentValue = handleType === 'min' ? internalValue[0] : internalValue[1];
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -step;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        delta = step;
        break;
      case 'PageDown':
        delta = -step * 10;
        break;
      case 'PageUp':
        delta = step * 10;
        break;
      case 'Home':
        delta = min - currentValue;
        break;
      case 'End':
        delta = max - currentValue;
        break;
      default:
        return;
    }
    
    event.preventDefault();
    
    const newValue = Math.max(min, Math.min(max, currentValue + delta));
    
    setInternalValue(prevValue => {
      let newMinValue = prevValue[0];
      let newMaxValue = prevValue[1];
      
      if (handleType === 'min') {
        newMinValue = Math.min(newValue, prevValue[1]);
      } else {
        newMaxValue = Math.max(newValue, prevValue[0]);
      }
      
      const updatedValue = [newMinValue, newMaxValue];
      debouncedOnChange(updatedValue);
      return updatedValue;
    });
  }, [disabled, internalValue, step, min, max, debouncedOnChange]);
  
  // Calculate positions and dimensions
  const minPercentage = getPercentage(internalValue[0]);
  const maxPercentage = getPercentage(internalValue[1]);
  const activeRangeWidth = maxPercentage - minPercentage;
  
  // Memoized styles for performance
  const trackStyle = useMemo(() => ({
    left: `${minPercentage}%`,
    width: `${activeRangeWidth}%`
  }), [minPercentage, activeRangeWidth]);
  
  const minHandleStyle = useMemo(() => ({
    left: `${minPercentage}%`
  }), [minPercentage]);
  
  const maxHandleStyle = useMemo(() => ({
    left: `${maxPercentage}%`
  }), [maxPercentage]);
  
  return (
    <div className={`range-slider ${disabled ? 'range-slider--disabled' : ''}`}>
      {/* Accessible label */}
      <div className="range-slider__label">
        {label}
      </div>
      
      {/* Value display */}
      <div className="range-slider__values">
        <span className="range-slider__value range-slider__value--min">
          {format(internalValue[0])}
        </span>
        <span className="range-slider__separator">-</span>
        <span className="range-slider__value range-slider__value--max">
          {format(internalValue[1])}
        </span>
      </div>
      
      {/* Slider container */}
      <div
        className="range-slider__container"
        ref={sliderRef}
        onMouseDown={(e) => {
          if (e.target === sliderRef.current) {
            // Determine which handle to move based on click position
            const rect = sliderRef.current.getBoundingClientRect();
            const clickPercentage = ((e.clientX - rect.left) / rect.width) * 100;
            const distanceToMin = Math.abs(clickPercentage - minPercentage);
            const distanceToMax = Math.abs(clickPercentage - maxPercentage);
            const handleType = distanceToMin <= distanceToMax ? 'min' : 'max';
            handlePointerDown(e, handleType);
          }
        }}
        onTouchStart={(e) => {
          if (e.target === sliderRef.current) {
            const rect = sliderRef.current.getBoundingClientRect();
            const clickPercentage = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
            const distanceToMin = Math.abs(clickPercentage - minPercentage);
            const distanceToMax = Math.abs(clickPercentage - maxPercentage);
            const handleType = distanceToMin <= distanceToMax ? 'min' : 'max';
            handlePointerDown(e, handleType);
          }
        }}
      >
        {/* Background track */}
        <div className="range-slider__track-bg" />
        
        {/* Active range track */}
        <div 
          className="range-slider__track-active"
          style={trackStyle}
        />
        
        {/* Minimum value handle */}
        <div
          ref={minHandleRef}
          className={`range-slider__handle range-slider__handle--min ${
            focusedHandle === 'min' ? 'range-slider__handle--focused' : ''
          } ${isDragging === 'min' ? 'range-slider__handle--dragging' : ''}`}
          style={minHandleStyle}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-label={`${label} minimum value`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={internalValue[0]}
          aria-valuetext={format(internalValue[0])}
          aria-disabled={disabled}
          onMouseDown={(e) => handlePointerDown(e, 'min')}
          onTouchStart={(e) => handlePointerDown(e, 'min')}
          onKeyDown={(e) => handleKeyDown(e, 'min')}
          onFocus={() => setFocusedHandle('min')}
          onBlur={() => setFocusedHandle(null)}
        >
          <div className="range-slider__handle-inner" />
        </div>
        
        {/* Maximum value handle */}
        <div
          ref={maxHandleRef}
          className={`range-slider__handle range-slider__handle--max ${
            focusedHandle === 'max' ? 'range-slider__handle--focused' : ''
          } ${isDragging === 'max' ? 'range-slider__handle--dragging' : ''}`}
          style={maxHandleStyle}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-label={`${label} maximum value`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={internalValue[1]}
          aria-valuetext={format(internalValue[1])}
          aria-disabled={disabled}
          onMouseDown={(e) => handlePointerDown(e, 'max')}
          onTouchStart={(e) => handlePointerDown(e, 'max')}
          onKeyDown={(e) => handleKeyDown(e, 'max')}
          onFocus={() => setFocusedHandle('max')}
          onBlur={() => setFocusedHandle(null)}
        >
          <div className="range-slider__handle-inner" />
        </div>
      </div>
      
      {/* Screen reader only instructions */}
      <div className="range-slider__sr-instructions" aria-hidden="true">
        Use arrow keys to adjust values. Page Up/Down for larger increments. Home/End for min/max values.
      </div>
    </div>
  );
};

export default RangeSlider;