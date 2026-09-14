const AartiSchedule = require('../models/AartiSchedule');

const defaultAartiSchedule = [
  { date: '15-Sep-2026', day: 'Tuesday', morning: 'Sushant + Harshada + Sanket', evening: 'Kishor + Rutuja Gadekar + Chandrakant' },
  { date: '16-Sep-2026', day: 'Wednesday', morning: 'Shraddha + Vidya + Yash + Pankaj Sir', evening: 'Megha + Vivek Patil + Balaji' },
  { date: '17-Sep-2026', day: 'Thursday', morning: 'Ravindra + Shivani', evening: 'Vishwambhar + Anoop + Chetan' },
  { date: '18-Sep-2026', day: 'Friday', morning: 'Shankar + Pratiksha', evening: 'Vedant + Dhananjay + Anurag' },
  { date: '19-Sep-2026', day: 'Saturday', morning: 'Piyush + Savita H. + Keshav', evening: 'Janhavi + Kedar + Yash Bidgar' },
  { date: '20-Sep-2026', day: 'Sunday', morning: 'Mangesh + Omkar', evening: 'Kale Kaka + Mahesh' },
  { date: '21-Sep-2026', day: 'Monday', morning: 'Varsha + Vrushali', evening: 'Dipti + Tanuja Jadhav + Mukesh' },
  { date: '22-Sep-2026', day: 'Tuesday', morning: 'Prasad + Ritika', evening: 'Tanuja Deshmukh + Yash Ghodake + Pranav' },
  { date: '23-Sep-2026', day: 'Wednesday', morning: 'Snehal + Rohini', evening: 'Satish Sir + Pooja + Sakshi + Rahul' },
  { date: '24-Sep-2026', day: 'Thursday', morning: 'All Supportive Staff', evening: "Sudhir Sir + Sonali Ma'am + Satish" }
];

async function ensureAartiSchedule() {
  if (await AartiSchedule.exists({})) return;
  await AartiSchedule.insertMany(defaultAartiSchedule);
}

module.exports = { defaultAartiSchedule, ensureAartiSchedule };
