const AartiSchedule = require('../models/AartiSchedule');

const defaultAartiSchedule = [
  { date: '15-Sep-2026', day: 'Tuesday', morning: 'Sushant + Harshda + Sanket', evening: 'Kishor + Ratuja Gadekar' },
  { date: '16-Sep-2026', day: 'Wednesday', morning: 'Shraddha + Vidya + Yash + Pankaj Sir', evening: 'Megha + Vivek Patil' },
  { date: '17-Sep-2026', day: 'Thursday', morning: 'Ravindra + Shivani', evening: 'Vishwambhar + Anoop' },
  { date: '18-Sep-2026', day: 'Friday', morning: 'Shankar + Pratiksha', evening: 'Vedant + Dhananjay' },
  { date: '19-Sep-2026', day: 'Saturday', morning: 'Piyush + Savita H. + Keshav', evening: 'Janhavi + Kedar + Yash Bidgar' },
  { date: '20-Sep-2026', day: 'Sunday', morning: 'Mangesh + Omkar', evening: 'Kale Kaka' },
  { date: '21-Sep-2026', day: 'Monday', morning: 'Varsha + Vrushali', evening: 'Dipati + Tanuja Jadhav' },
  { date: '22-Sep-2026', day: 'Tuesday', morning: 'Prasad + Ritika', evening: 'Tanuja Deshmukh + Yash Ghodake' },
  { date: '23-Sep-2026', day: 'Wednesday', morning: 'Snehal + Rohini', evening: 'Satish Sir + Pooja + Sakshi' },
  { date: '24-Sep-2026', day: 'Thursday', morning: 'All Supportive Staff', evening: "Sudhir Sir + Sonali Ma'am" }
];

async function ensureAartiSchedule() {
  if (await AartiSchedule.exists({})) return;
  await AartiSchedule.insertMany(defaultAartiSchedule);
}

module.exports = { defaultAartiSchedule, ensureAartiSchedule };
