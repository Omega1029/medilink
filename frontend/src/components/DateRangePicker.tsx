import { useState, useEffect, useRef } from "react";
import "./DateRangePicker.css";

interface DateRangePickerProps {
  onRangeSelect?: (startDate: Date | null, endDate: Date | null) => void;
}

function DateRangePicker({ onRangeSelect }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handleDateClick = (date: Date) => {
    if (selectingStart || !startDate) {
      setStartDate(date);
      setEndDate(null);
      setSelectingStart(false);
    } else {
      if (date < startDate!) {
        // If clicked date is before start date, make it the new start date
        setStartDate(date);
        setEndDate(null);
      } else {
        setEndDate(date);
        setSelectingStart(true);
        onRangeSelect?.(startDate, date);
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!startDate) return false;
    if (!endDate) return date.getTime() === startDate.getTime();
    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (date: Date) => {
    if (!startDate) return false;
    if (!endDate) return date.getTime() === startDate.getTime();
    return date.getTime() === startDate.getTime() || date.getTime() === endDate.getTime();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectingStart(true);
    onRangeSelect?.(null, null);
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close picker when range is complete
  useEffect(() => {
    if (startDate && endDate) {
      // Small delay to show the selection before closing
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [startDate, endDate]);

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="date-range-picker" ref={pickerRef}>
      <button
        className="date-range-trigger"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {startDate && endDate
          ? `${formatDate(startDate)} - ${formatDate(endDate)}`
          : startDate
          ? `${formatDate(startDate)} - Select end date`
          : "Select date range"}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="date-range-picker-dropdown">
          <div className="calendar-header">
            <button
              className="calendar-nav-button"
              onClick={goToPreviousMonth}
              type="button"
              aria-label="Previous month"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <h3 className="calendar-month-year">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              className="calendar-nav-button"
              onClick={goToNextMonth}
              type="button"
              aria-label="Next month"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div className="calendar-grid">
            {daysOfWeek.map((day) => (
              <div key={day} className="calendar-day-header">
                {day}
              </div>
            ))}
            {days.map((date, index) => {
              if (date === null) {
                return <div key={`empty-${index}`} className="calendar-day empty"></div>;
              }

              const isToday = date.getTime() === today.getTime();
              const inRange = isDateInRange(date);
              const isSelected = isDateSelected(date);
              const isFuture = date > today;

              return (
                <button
                  key={date.getTime()}
                  className={`calendar-day ${isToday ? "today" : ""} ${inRange ? "in-range" : ""} ${isSelected ? "selected" : ""} ${isFuture ? "future" : ""}`}
                  onClick={() => handleDateClick(date)}
                  type="button"
                  disabled={isFuture}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="calendar-footer">
            {startDate && (
              <div className="selected-range-info">
                <span className="range-label">Start:</span>
                <span className="range-date">{formatDate(startDate)}</span>
                {endDate && (
                  <>
                    <span className="range-label">End:</span>
                    <span className="range-date">{formatDate(endDate)}</span>
                  </>
                )}
              </div>
            )}
            <div className="calendar-actions">
              {(startDate || endDate) && (
                <button
                  className="clear-button"
                  onClick={clearSelection}
                  type="button"
                >
                  Clear
                </button>
              )}
              <button
                className="close-button"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;

