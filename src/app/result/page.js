'use client'

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ResultContent() {
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

  if (!parsedResult || parsedResult.length < 3) {
    return <div className="text-red-500 text-center mt-4">ไม่มีข้อมูล</div>;
  }

  const [days, dutyNames, studentAssignments] = parsedResult;
  const maxDuties = Math.max(...studentAssignments.map(dayDuty => dayDuty.length));
  const paddedDuties = studentAssignments.map(dayDuty => [
    ...dayDuty,
    ...Array(maxDuties - dayDuty.length).fill(null)
  ]);

  return (
    <div className="max-w-6xl mt-10 mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-2xl text-black">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">ผลการจัดเวร</h1>
      {paddedDuties.length > 0 ? (
        <div
          className="grid gap-2 sm:gap-6 text-xs sm:text-sm"
          style={{
            gridTemplateColumns: `repeat(${maxDuties + 1}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${paddedDuties.length + 1}, auto)`
          }}
        >
          <div className="font-semibold py-2 px-1 sm:px-3">วัน</div>
          {dutyNames.map((duty, index) => (
            <div key={index} className="font-semibold py-2 px-1 sm:px-3">{duty}</div>
          ))}
          {paddedDuties.map((dayDuty, dayIndex) => (
            <React.Fragment key={dayIndex}>
              <div className="py-2 px-1 sm:px-3 font-medium bg-gray-100">{days[dayIndex]}</div>
              {dayDuty.map((duty, dutyIndex) => (
                <div key={dutyIndex} className="py-2 px-1 sm:px-3 text-center border border-gray-200">{duty !== null ? duty : '-'}</div>
              ))}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="text-red-500 text-center">ไม่มีข้อมูล</div>
      )}
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="text-center mt-4 text-gray-500">Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}