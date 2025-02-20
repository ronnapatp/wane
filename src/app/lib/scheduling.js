const days = {Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true} // also not used

const job = ['mopping']; // not actually used
const studentCount = 15;
const groups = [[1,2,3,4],[5,6],[7,8,9,10]]; // distinct elements
const avoidGroups = [[1,5],[5,9]]; // may only take pairs
const unavailableDays = [[2,"Monday"],[2,"Wednesday"]]; // may not include all 5 days
// // there is probability that a group maybe avoided

export default function schedule(days, job, studentCount, groups, avoidGroups, unavailableDays) { 
  const dayCount = days.length;
  const restraint = Array.from({ length: dayCount }, () => [[], []]);
  const out = Array.from({ length: dayCount }, (_, i) => [0, i]);
  const students = []; 
  const grouped = [];
  const wdays = Array.from({ length: dayCount }, () => []);
  const mdays = Array.from({ length: dayCount }, () => []);
    const ext = [];
    for(let i = 0; i<= studentCount; i++){
        ext.push(0);
    }
  for (let i = 0; i < groups.length; i++) {
      for (let j = 0; j < groups[i].length; j++) {
          ext[groups[i][j]] = 1;
      }
  }
  for (let i = 1; i <= studentCount; i++) {
      if (ext[i] == 0) {
            groups.push([i]);
      }
  }
  for (let i = 0; i < groups.length; i++) {
      const size = groups[i].length;
      students.push([size, groups[i], [], []]);
  }
  for (let i = 0; i < unavailableDays.length; i++) {
      for (let j = 0, id = unavailableDays[i][0]; j < students.length; j++) {
          if (students[j][1].includes(id) && !students[j][2].includes(unavailableDays[i][1])) {
              students[j][2].push(unavailableDays[i][1]);
          }
      }
  }
  for (let i = 0; i < avoidGroups.length; i++) {
      for (let j = 0, id1 = avoidGroups[i][0], id2 = avoidGroups[i][1]; j < students.length; j++) {
          if (students[j][1].includes(id1) && !students[j][3].includes(id2)) {
              students[j][3].push(id2);
          } else if (students[j][1].includes(id2) && !students[j][3].includes(id1)) {
              students[j][3].push(id1);
          }
      }
  }
  students.sort(function(a, b) {
      if (b[2].length == a[2].length && b[3].length == a[3].length) return b[0] - a[0];
      if (b[2].length == a[2].length) return b[3].length - a[3].length;
      return b[2].length - a[2].length;
  });
  console.log(students);
  function canAccept(item, pointer, wdays,dayCount) {
      for (let d = 0; d < dayCount; d++) {
          if (pointer == d && !item[2].includes(days[d])) {
              for (let i = 0; i < item[3].length; i++) {
                  if (wdays[d].includes(item[3][i])) {
                      console.log(days[d], ' has the student ', item[3][i], ' already');
                      return false;
                  }
              }
              return true;
          }
      }
      console.log('all days are full');
      return false;
  }
  for (let i = 0; i < students.length; i++) {
      const item = students[i];
      out.sort((a, b) => a[0] - b[0]);
      for (let j = 0; j < dayCount; j++) {
          if (canAccept(item, out[j][1], wdays,dayCount)) {
              out[j][0] += item[0];
              for (let k = 0; k < item[3].length; k++) {
                  if (!wdays[out[j][1]].includes(item[3][k])) {
                      wdays[out[j][1]].push(item[3][k]);
                  }
              }
              for (let k = 0; k < item[0]; k++) {
                  mdays[out[j][1]].push(item[1][k]);
              }
              break;
          }
      }
  }
  out.sort((a, b) => a[1] - b[1]);
  for (let i = 0; i < dayCount; i++) {
      out[i][1] = mdays[i];
  }
  return [days, job, mdays];
}

// console.log(schedule(days, job, studentCount, groups, avoidGroups, unavailableDays)[2]);
