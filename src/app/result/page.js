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

  if (!parsedResult || parsedResult.length < 1) {
    return <div className="text-red-500 text-center mt-4">ไม่มีข้อมูล</div>;
  }

  // Extract days, student assignments, and job names
  const days = parsedResult.map(item => item.day); // Extract days (e.g. "Monday", "Tuesday")
  const studentAssignments = parsedResult.map(item => item.students.split(',').map(student => student.trim())); // Split the students by commas
  
  // Extract job names from the query params (or use a default if not available)
  const jobNames = searchParams.get('jobNames') ? JSON.parse(searchParams.get('jobNames')) : ['Duty1', 'Duty2'];

  return (
    <div className="max-w-6xl mt-10 mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-2xl text-black">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">ผลการจัดเวร</h1>

      {/* Table header with dynamic job names */}
      <div className="grid gap-2 sm:gap-6 text-xs sm:text-sm" style={{ gridTemplateColumns: `repeat(${jobNames.length + 1}, minmax(0, 1fr))` }}>
        <div className="font-semibold py-2 px-1 sm:px-3">วัน</div>
        {jobNames.map((job, index) => (
          <div key={index} className="font-semibold py-2 px-1 sm:px-3">{job}</div>
        ))}
      </div>

      {/* Table content with student assignments */}
      {studentAssignments.length > 0 ? (
        <div className="grid gap-2 sm:gap-6 text-xs sm:text-sm" style={{ gridTemplateColumns: `repeat(${jobNames.length + 1}, minmax(0, 1fr))` }}>
          {studentAssignments.map((dayAssignments, dayIndex) => (
            <React.Fragment key={dayIndex}>
              <div className="py-2 px-1 sm:px-3 font-medium bg-gray-100">{days[dayIndex]}</div>
              {dayAssignments.map((student, dutyIndex) => (
                <div key={dutyIndex} className="py-2 px-1 sm:px-3 text-center border border-gray-200">{student || '-'}</div>
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