'use client'

import { useState } from "react";
import schedule from "./scheduling.js"

export default function ScheduleForm() {
  
  // schedule(job,studentCount,groups,unavailibleDays); return 2d array of int refering to student id
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
    setFunction((prev) => [...prev, ['']]);
  };

  const handleStudentSelection = (groupIndex, studentIndex, setFunction) => (e) => {
    setFunction((prev) => {
      const newGroups = [...prev];
      newGroups[groupIndex][studentIndex] = e.target.value;
      if (!newGroups[groupIndex].includes("")) {
        newGroups[groupIndex].push(" ");
      }
      return newGroups;
    });
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
            <input className="w-full border p-2 rounded-md">
            </input>
          </div>
        ))}
        <button className="mt-2 w-full bg-gray-200 p-2 rounded-md" onClick={() => addGroup(setJob)}>เพิ่มคน</button>
      </div>
      
      <div>
        <h2 className="font-semibold">คนที่อยากอยู่วันเดียวกัน</h2>
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="p-3 border rounded-md mb-3">
            <p className="font-medium">Group {groupIndex + 1}</p>
            {group.map((student, studentIndex) => (
              <select key={studentIndex} className="w-full mt-2 border p-2 rounded-md" onChange={handleStudentSelection(groupIndex, studentIndex, setGroups)}>
                <option value="">เลือกนักเรียน</option>
                {availableStudents.map((num) => (
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
              <select key={studentIndex} className="w-full mt-2 border p-2 rounded-md" onChange={handleStudentSelection(groupIndex, studentIndex, setAvoidGroups)}>
                <option value="">เลือกนักเรียน</option>
                {availableStudents.map((num) => (
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
            <select className="w-1/2 border p-2 rounded-md">
              <option value="">เลือกนักเรียน</option>
              {studentNumbers.map((num) => (
                <option key={num} value={num}>นักเรียน {num}</option>
              ))}
            </select>
            <select className="w-1/2 border p-2 rounded-md">
              <option value="">เลือกวัน</option>
            </select>
          </div>
        ))}
        <button className="mt-2 w-full bg-gray-200 p-2 rounded-md" onClick={() => addGroup(setUnavailableDays)}>เพิ่มคน</button>
      </div>

      <button className="mt-2 w-full bg-gray-600 text-white font-bold p-2 rounded-md" >จัดเวร</button>

    </div>
  );
}
