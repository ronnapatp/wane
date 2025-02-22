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
  const [studentsInput, setStudentsInput] = useState('');
  const [groups, setGroups] = useState([['']]);
  const [avoidGroups, setAvoidGroups] = useState([['']]);
  const [unavailableDays, setUnavailableDays] = useState([['', '']]);

  const studentNames = studentsInput.split('\n').map((name, index) => ({
    name: name.trim(),
    number: index + 1,
  })).filter(student => student.name !== ''); // Filter out any empty lines

  const selectedStudents = new Set(groups.flat().concat(avoidGroups.flat()));
  const availableStudents = studentNames.filter(student => !selectedStudents.has(student.number.toString()));

  const addGroup = (setFunction) => {
    setFunction((prev) => [...prev, ['', '']]);
  };

  const handleJobChange = (index, value) => {
    const newJobs = [...job];
    newJobs[index] = value;
    setJob(newJobs);
  };

  const removeJob = (index) => {
    if (job.length > 1) {
      setJob(job.filter((_, i) => i !== index));
    }
  };

  const removeGroup = (index) => {
    setGroups(groups.filter((_, i) => i !== index));
  };

  const removeAvoidGroup = (index) => {
    setAvoidGroups(avoidGroups.filter((_, i) => i !== index));
  };

  const removeUnavailableDay = (index) => {
    setUnavailableDays(unavailableDays.filter((_, i) => i !== index));
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

    if (type === 1) {
      newUnavailableDays[index][1] = value;
    } else {
      newUnavailableDays[index][0] = value;
    }

    setUnavailableDays(newUnavailableDays);
  };

  const handleSchedule = () => {
    const selectedDays = Object.keys(days).filter(day => days[day]);
    const totalJobs = selectedDays.length * job.length;

    const daysTrue = Object.values(days).filter(value => value === true).length;
  
    if (studentNames.length > totalJobs) {
      alert("จำนวนนักเรียนมากเกิน กรุณาเพิ่มงาน");
      return;
    }

    if (job.length > Math.ceil(studentNames.length/daysTrue)) {
      alert("จำนวนงานมากเกิน กรุณาลดงาน");
      return;
    }
  
    // Format groups and avoidGroups to remove empty values
    const formattedGroups = groups.map(group =>
      group.filter(student => student !== "").map(Number)
    );
    const formattedAvoidGroups = avoidGroups.map(group => group.filter(student => student !== "").map(Number));
  
    const formattedUnavailableDays = unavailableDays
      .filter(entry => entry[0] !== "" && entry[1] !== "")
      .map(entry => [Number(entry[0]), entry[1]]);
  
    // Pass the full studentNames array, not just the length
    const result = schedule(selectedDays, job, studentNames.length, formattedGroups, formattedAvoidGroups, formattedUnavailableDays, studentNames);
  
    console.log(result);
  
    // Format result for output on the page
    const formattedResult = result[2].map((dayStudents, index) => {
      return {
        day: selectedDays[index],
        students: dayStudents.join(", ")
      };
    });
  
    const queryParams = new URLSearchParams({
      data: JSON.stringify(formattedResult),
      jobNames: JSON.stringify(job)  // Pass the actual job names here
    }).toString();
    
    router.push(`/result?${queryParams}`);
  };

  return (
    <div className="max-w-lg mt-10 mb-10 mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-6 text-black">
      <h1 className="text-3xl font-bold text-center">จัดเวร</h1>

      <label className="block font-semibold">นักเรียน (กรุณากรอกชื่อแต่ละคนแยกด้วย Enter)</label>
      <textarea
        className="border p-2 rounded-md w-full"
        rows="5"
        value={studentsInput}
        onChange={(e) => setStudentsInput(e.target.value)}
        placeholder="กรุณากรอกชื่อแต่ละคนในบรรทัดใหม่"
      />

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
        {job.map((jobValue, index) => (
          <div key={index} className="flex space-x-2 mt-2">
            <input
              className="w-full border p-2 rounded-md"
              value={jobValue}
              onChange={(e) => handleJobChange(index, e.target.value)}
            />
            <button
              className="bg-white text-white px-2 rounded-md"
              onClick={() => removeJob(index)}
              disabled={job.length === 1}
            >
              ❌
            </button>
          </div>
        ))}
        <button
          className="mt-2 w-full bg-gray-200 p-2 rounded-md"
          onClick={() => setJob([...job, ""])}
        >
          เพิ่มงาน
        </button>
      </div>

      <div>
        <h2 className="font-semibold">คนที่อยากอยู่วันเดียวกัน</h2>
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="p-3 border rounded-md mb-3 flex items-center">
            <div className="flex-1">
              <p className="font-medium">Group {groupIndex + 1}</p>
              {group.map((student, studentIndex) => (
                <select
                  key={studentIndex}
                  className="w-full mt-2 border p-2 rounded-md"
                  value={groups[groupIndex][studentIndex]}
                  onChange={handleStudentSelection(groupIndex, studentIndex, setGroups)}
                >
                  <option value="">เลือกนักเรียน</option>
                  {studentNames.map((student) => (
                    <option key={student.number} value={student.number}>{student.name}</option>
                  ))}
                </select>
              ))}
            </div>
            <button
              className="ml-3 bg-white text-white px-2 rounded-md"
              onClick={() => removeGroup(groupIndex)}
            >
              ❌
            </button>
          </div>
        ))}
        <button className="mt-2 w-full bg-gray-200 p-2 rounded-md" onClick={() => addGroup(setGroups)}>เพิ่มกลุ่ม</button>
      </div>

      <div>
        <h2 className="font-semibold">คนที่ไม่อยากอยู่วันเดียวกัน</h2>
        {avoidGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="p-3 border rounded-md mb-3 flex items-center">
            <div className="flex-1">
              <p className="font-medium">Group {groupIndex + 1}</p>
              {group.map((student, studentIndex) => (
                <select
                  key={studentIndex}
                  className="w-full mt-2 border p-2 rounded-md"
                  value={avoidGroups[groupIndex][studentIndex]}
                  onChange={handleStudentSelection(groupIndex, studentIndex, setAvoidGroups)}
                >
                  <option value="">เลือกนักเรียน</option>
                  {studentNames.map((student) => (
                    <option key={student.number} value={student.number}>{student.name}</option>
                  ))}
                </select>
              ))}
            </div>
            <button
              className="ml-3 bg-white text-white px-2 rounded-md"
              onClick={() => removeAvoidGroup(groupIndex)}
            >
              ❌
            </button>
          </div>
        ))}
        <button className="mt-2 w-full bg-gray-200 p-2 rounded-md" onClick={() => addGroup(setAvoidGroups)}>เพิ่มกลุ่ม</button>
      </div>

      <div>
        <h2 className="font-semibold">คนที่มีวันไม่ว่าง</h2>
        {unavailableDays.map((_, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <select
              className="w-1/2 border p-2 rounded-md"
              value={unavailableDays[index][0]}
              onChange={handleUnavailableSelection(index, 0)}
            >
              <option value="">เลือกนักเรียน</option>
              {studentNames.map((student) => (
                <option key={student.number} value={student.number}>{student.name}</option>
              ))}
            </select>
            <select
              className="w-1/2 border p-2 rounded-md"
              value={unavailableDays[index][1]}
              onChange={handleUnavailableSelection(index, 1)}
            >
              <option value="">เลือกวัน</option>
              {Object.keys(days).map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <button
              className="ml-3 bg-white text-white px-2 rounded-md"
              onClick={() => removeUnavailableDay(index)}
            >
              ❌
            </button>
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