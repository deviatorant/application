
import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import Button from '../common/Button';

interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

interface TimeSlotPickerProps {
  date: Date;
  timeSlots: TimeSlot[];
  maxSelections?: number;
  onSelectTimeSlots: (selectedSlots: TimeSlot[]) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  date,
  timeSlots,
  maxSelections = 3,
  onSelectTimeSlots
}) => {
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.isAvailable) return;

    setSelectedSlots(prev => {
      // If already selected, remove it
      if (prev.some(s => s.id === slot.id)) {
        return prev.filter(s => s.id !== slot.id);
      }
      
      // If maxSelections reached, show an alert
      if (prev.length >= maxSelections) {
        return prev;
      }
      
      // Add new selection
      return [...prev, slot];
    });
  };

  const handleConfirm = () => {
    onSelectTimeSlots(selectedSlots);
  };

  const isSlotSelected = (slotId: string) => {
    return selectedSlots.some(slot => slot.id === slotId);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Available time slots for {format(date, 'EEEE, MMMM d')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select up to {maxSelections} preferred time slots
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        {timeSlots.map(slot => (
          <div
            key={slot.id}
            onClick={() => handleSlotClick(slot)}
            className={cn(
              "p-3 rounded-xl text-center transition-all duration-200 border cursor-pointer",
              !slot.isAvailable && "bg-gray-100 text-muted-foreground cursor-not-allowed opacity-60",
              slot.isAvailable && !isSlotSelected(slot.id) && "hover:border-medical-300 bg-white",
              isSlotSelected(slot.id) && "bg-medical-50 border-medical-500 text-medical-800"
            )}
          >
            <p className="text-sm font-medium">
              {format(slot.startTime, 'h:mm a')} - {format(slot.endTime, 'h:mm a')}
            </p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {selectedSlots.length} of {maxSelections} selected
        </p>
        <Button 
          disabled={selectedSlots.length === 0} 
          onClick={handleConfirm}
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
};

export default TimeSlotPicker;
