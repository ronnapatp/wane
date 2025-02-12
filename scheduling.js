
const days = {Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true}

const job = ['mopping'];
const studentCount = 15;
const groups = [[1,2,3,4],[5,6],[7,8,9,10]];
const avoidGroups = [[1,5],[5,9]]; // may only take pairs
const unavailableDays = [[2,["Tuesday","Wednesday","Thursday","Friday"]]];

function schedule(days, job, studentCount, groups, avoidGroups, unavailableDays)
{ 
    const restraint = [[[],[]],[[],[]],[[],[]],[[],[]],[[],[]]];
    const out = [[0,[]],[0,[]],[0,[]],[0,[]],[0,[]]];
    let uDays = 0;
    let jobs = job.length;
    const students = []; 
    const grouped = [];
    for (const [key, value] of Object.entries(days))
    {
      if(value)
        uDays++;
    }
    const acc = Math.ceil(studentCount / uDays);
    for(let i = 0; i < groups.length; i++)
    {
      for(let j = 0; j < groups[i].length; j++)
      {
        grouped.push(groups[i][j]);
      }
    }
    grouped.sort((a, b) => a.length - b.length);
    grouped.push(studentCount+1);
    for(let i = 0,mod = 1; i <= studentCount; i++)
    {
      if(grouped[i] > i + mod)
      {
        groups.push([mod + i]);
        mod++;
        i--;
      }
    }
    for (let i = 0; i < groups.length; i++) {
      const size = groups[i].length;
      students.push([size,groups[i],[],[]]);
    }
    for(let i = 0; i < unavailableDays.length; i++)
    {
      for(let j = 0, id = unavailableDays[i][0]; j < students.length; j++)
      {
        if(students[j][1].includes(id))
        {
          for(let k = 0; k < unavailableDays[i][1].length; k++)
          {
            if(!students[j][2].includes(unavailableDays[i][1][k]) )
            { 
              students[j][2].push(unavailableDays[i][1][k]);
            }
          }
          break;
        }
      }
    }
    for(let i = 0; i < avoidGroups.length; i++)
    {
      for(let j = 0, id1 = avoidGroups[i][0],id2 = avoidGroups[i][1]; j < students.length; j++)
      {
        if(students[j][1].includes(id1) && !students[j][3].includes(id2))
        {
              students[j][3].push(id2);
        }
        else if(students[j][1].includes(id2) && !students[j][3].includes(id1))
        {
              students[j][3].push(id1);
        }
      }
    }
    students.sort((a, b) =>  b[0] - a[0]);
    console.log(students);
    for (let i = 0, pointer = 0, mx = 0; i < students.length; i++,pointer = ((pointer + 1) % 5)) {
      const item = students[i][0];
      while(out[pointer][0] + item > mx)
      {
        if(pointer == 4)
          mx++;
        pointer = ((pointer + 1) % 5);
      }
      out[pointer][0] = out[pointer][0] + item;
      mx = Math.max(mx,out[pointer][0]);
    }
    return out;
}

console.log(schedule(days, job, studentCount, groups, avoidGroups, unavailableDays));