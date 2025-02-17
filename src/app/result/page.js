'use client'

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const result = searchParams.get('data');

  let parsedResult;
  if (result) {
    try {
      parsedResult = JSON.parse(result);
    } catch (e) {
      console.error("Failed to parse result:", e);
      parsedResult = null;
    }
  }

  const duties = parsedResult || [];

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Find the maximum number of duties for any day
  const maxDuties = Math.max(...duties.map(dayDuty => dayDuty.length));

  // Pad the days with fewer duties
  const paddedDuties = duties.map(dayDuty => {
    const missingDuties = maxDuties - dayDuty.length;
    return [...dayDuty, ...Array(missingDuties).fill(null)]; // Fill missing duties with null
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-2xl text-black">
      <h1 className="text-3xl font-bold text-center mb-8">ผลการจัดเวร</h1>

      {paddedDuties && paddedDuties.length > 0 ? (
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${maxDuties + 1}, minmax(0, 1fr))`, // Dynamically set columns based on max duties
            gridTemplateRows: `repeat(${paddedDuties.length}, auto)` // Automatically adjust row height for each day
          }}
        >
          {/* First column for "วัน" (Day) */}
          <div className="font-semibold">วัน</div>

          {/* Dynamic headers for each Duty */}
          {Array.from({ length: maxDuties }).map((_, dutyIndex) => (
            <div key={dutyIndex} className="font-semibold">{`Duty ${dutyIndex + 1}`}</div>
          ))}

          {/* Dynamic rows for each day */}
          {paddedDuties.map((dayDuty, dayIndex) => (
            <React.Fragment key={dayIndex}>
              {/* Day Name */}
              <div className="py-2 font-medium">{dayNames[dayIndex]}</div>

              {/* Day's Duties */}
              {dayDuty.map((duty, dutyIndex) => (
                <div key={dutyIndex} className="py-2">{duty !== null ? duty : '-'}</div> 
              ))}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="text-red-500">ไม่มีข้อมูล</div>
      )}
    </div>
  );
}