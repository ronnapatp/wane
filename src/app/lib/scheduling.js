
// const days = {Monday: true,
//     Tuesday: true,
//     Wednesday: true,
//     Thursday: true,
//     Friday: true} // also not used

// const job = ['mopping']; // not actually used
// const studentCount = 15;
// const groups = [[1,2,3,4],[5,6],[7,8,9,10]]; // distinct elements
// const avoidGroups = [[1,5],[5,9]]; // may only take pairs
// const unavailableDays = [[2,["Tuesday","Wednesday","Thursday","Friday"]]]; // may not include all 5 days
// // there is probability that a group maybe avoided

export default function schedule(days, job, studentCount, groups, avoidGroups, unavailableDays)
{ 
    const restraint = [[[],[]],[[],[]],[[],[]],[[],[]],[[],[]]];
    const out = [[0,0],[0,1],[0,2],[0,3],[0,4]];
    const students = []; 
    const grouped = [];
    const wdays = [[],[],[],[],[]];
    const mdays = [[],[],[],[],[]];
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
    students.sort(function(a, b) { if(b[2].length == a[2].length && b[3].length == a[3].length)return b[0] - a[0];if(b[2].length == a[2].length) return b[3].length - a[3].length; return  b[2].length - a[2].length});
    function canAccept(item,pointer,wdays){
        let days = ['Monday','Tuesday','Wednesday','Thursday','Friday']
        for(let d = 0 ; d < 5 ;d++)
        {
            if(pointer == d && !item[2].includes(days[d]))
                {
                    for(let i = 0 ; i < item[3].length; i++)
                    {
                        if(wdays[d].includes(item[3][i]))
                        {
                            console.log(days[d],' has the student ',item[3][i],' already');
                            return false;
                        }
                    }
                    return true;
                }
        }
        console.log('all days are  full');
        return false;
    }
    for (let i = 0; i < students.length;i++) {
        const item = students[i];
        out.sort((a,b) => a[0] - b[0]);
        for(let j = 0; j < 5; j++)
        {
            if(canAccept(item,out[j][1],wdays))
            {
                out[j][0] += item[0];
                for(let k = 0; k < item[3].length; k++)
                {
                    if(!wdays[out[j][1]].includes(item[3][k]))
                    {
                        wdays[out[j][1]].push(item[3][k]);
                    }
                }
                for(let k = 0 ; k < item[0]; k++)
                {
                    mdays[out[j][1]].push(item[1][k]);
                }
                break;
            }
        }
    }
    out.sort((a,b) => a[1] - b[1]);
    for(let i =0; i < 5;i++)
        {
            out[i][1] =mdays[i];
        }
    return mdays;   
}

// console.log(schedule(days, job, studentCount, groups, avoidGroups, unavailableDays));

// [
//     [
//       4,
//       [ 1, 2, 3, 4 ],
//       [ 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ],
//       [ 5 ]
//     ],
//     [ 2, [ 5, 6 ], [], [ 1, 9 ] ],
//     [ 4, [ 7, 8, 9, 10 ], [], [ 5 ] ],
//     [ 1, [ 11 ], [], [] ],
//     [ 1, [ 12 ], [], [] ],
//     [ 1, [ 13 ], [], [] ],
//     [ 1, [ 14 ], [], [] ],
//     [ 1, [ 15 ], [], [] ]
//   ]
