'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation';
import schedule from "./lib/scheduling.js"

export default function ScheduleForm() {
  
  const router = useRouter();
  
  const [days, setDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
  });
  const [job, setJob] = useState(['']);
  const [studentCount, setStudentCount] = useState(0);
  const [groups, setGroups] = useState([['']]);
  const [avoidGroups, setAvoidGroups] = useState([['']]);
  const [unavailableDays, setUnavailableDays] = useState([['', '']]);

  const studentNumbers = Array.from({ length: studentCount }, (_, i) => (i + 1).toString());
  
  const selectedStudents = new Set(groups.flat().concat(avoidGroups.flat()));
  const availableStudents = studentNumbers.filter(num => !selectedStudents.has(num));

  const addGroup = (setFunction) => {
    setFunction((prev) => [...prev, ['', '']]); // Add an empty student and day pair
  };

  const handleStudentSelection = (groupIndex, studentIndex, setFunction) => (e) => {
    setFunction((prev) => {
      const newGroups = prev.map((group, i) =>
        i === groupIndex
          ? group.map((student, j) => (j === studentIndex ? e.target.value : student))
          : group
      );
  
      if (!newGroups[groupIndex].includes("")) {
        newGroups[groupIndex].push("");
      }
  
      return newGroups;
    });
  };
  
  const handleUnavailableSelection = (index, type) => (e) => {
    const newUnavailableDays = [...unavailableDays];
    const value = e.target.value;
  
    // Update the corresponding day (type 1) for the student (type 0)
    if (type === 1) {
      newUnavailableDays[index][1] = value;
    } else {
      newUnavailableDays[index][0] = value;
    }
  
    setUnavailableDays(newUnavailableDays);
  };

  const handleSchedule = () => {
    const selectedDays = Object.keys(days).filter(day => days[day]);
  
    // Format groups and avoidGroups to remove empty values
    const formattedGroups = groups.map(group => group.filter(student => student !== ""));
    const formattedAvoidGroups = avoidGroups.map(group => group.filter(student => student !== ""));
    
    // Format unavailableDays to match the expected format [studentId, 'day']
    const formattedUnavailableDays = unavailableDays
      .filter(entry => entry[0] !== "" && entry[1] !== "")
      .map(entry => [entry[0], entry[1]]);
    
    console.log(formattedUnavailableDays)
  
    const result = schedule(selectedDays, job, studentCount, formattedGroups, formattedAvoidGroups, formattedUnavailableDays);
    
    // Redirect to the result page with the schedule data
    const queryParams = new URLSearchParams({
      data: JSON.stringify(result)
    }).toString();
  
    // router.push(`/result?${queryParams}`);
  };

  return (
    <div className="max-w-lg mt-10 mb-10 mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6 text-black">
      <h1 className="text-3xl font-bold text-center">จัดเวร</h1>
      
      <label className="block font-semibold">จำนวนนักเรียน</label>
      <input type="number" className="border p-2 rounded-md w-full" value={studentCount} onChange={(e) => setStudentCount(Number(e.target.value))} />
      
      <div>
        <h2 className="font-semibold">วันที่มีเวร</h2>
        {Object.keys(days).map((day) => (
          <div key={day} className="flex items-center space-x-2 py-2">
            <input type="checkbox" checked={days[day]} onChange={() => setDays({ ...days, [day]: !days[day] })} />
            <span>{day}</span>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-semibold">หน้าที่</h2>
        {job.map((_, index) => (
          <div key={index} className="flex space-x-2 mt-2">
            <input className="w-full border p-2 rounded-md" />
          </div>
        ))}
        <button className="mt-2 w-full bg-gray-200 p-2 rounded-md" onClick={() => addGroup(setJob)}>เพิ่มงาน</button>
      </div>
      
      <div>
        <h2 className="font-semibold">คนที่อยากอยู่วันเดียวกัน</h2>
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="p-3 border rounded-md mb-3">
            <p className="font-medium">Group {groupIndex + 1}</p>
            {group.map((student, studentIndex) => (
              <select
                key={studentIndex}
                className="w-full mt-2 border p-2 rounded-md"
                value={groups[groupIndex][studentIndex]}
                onChange={handleStudentSelection(groupIndex, studentIndex, setGroups)}
              >
                <option value="">เลือกนักเรียน</option>
                {studentNumbers.map((num) => (
                  <option key={num} value={num}>นักเรียน {num}</option>
                ))}
              </select>
            ))}
          </div>
        ))}
        <button className="mt-2 w-full bg-gray-200 p-2 rounded-md" onClick={() => addGroup(setGroups)}>เพิ่มกลุ่ม</button>
      </div>
      
      <div>
        <h2 className="font-semibold">คนที่ไม่อยากอยู่วันเดียวกัน</h2>
        {avoidGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="p-3 border rounded-md mb-3">
            <p className="font-medium">Group {groupIndex + 1}</p>
            {group.map((student, studentIndex) => (
              <select
                key={studentIndex}
                className="w-full mt-2 border p-2 rounded-md"
                value={avoidGroups[groupIndex][studentIndex]}
                onChange={handleStudentSelection(groupIndex, studentIndex, setAvoidGroups)}
              >
                <option value="">เลือกนักเรียน</option>
                {studentNumbers.map((num) => (
                  <option key={num} value={num}>นักเรียน {num}</option>
                ))}
              </select>
            ))}
          </div>
        ))}
        <button className="mt-2 w-full bg-gray-200 p-2 rounded-md" onClick={() => addGroup(setAvoidGroups)}>เพิ่มกลุ่ม</button>
      </div>
      
      <div>
        <h2 className="font-semibold">คนที่มีวันไม่ว่าง</h2>
        {unavailableDays.map((_, index) => (
          <div key={index} className="flex space-x-2 mt-2">
            <select
              className="w-1/2 border p-2 rounded-md"
              value={unavailableDays[index][0]} // student ID
              onChange={handleUnavailableSelection(index, 0)} // Update student selection
            >
              <option value="">เลือกนักเรียน</option>
              {studentNumbers.map((num) => (
                <option key={num} value={num}>นักเรียน {num}</option>
              ))}
            </select>
            <select
              className="w-1/2 border p-2 rounded-md"
              value={unavailableDays[index][1]} // unavailable day
              onChange={handleUnavailableSelection(index, 1)} // Update day selection
            >
              <option value="">เลือกวัน</option>
              {Object.keys(days).map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
        ))}
        <button className="mt-2 w-full bg-gray-200 p-2 rounded-md" onClick={() => addGroup(setUnavailableDays)}>เพิ่มคน</button>
      </div>

      <button
        className="mt-2 w-full bg-gray-600 text-white font-bold p-2 rounded-md"
        onClick={handleSchedule}
      >
        จัดเวร
      </button>
    </div>
  );
}
