export function getBusinessStatus(hours: any): { isOpen: boolean; message: string } {
  const now = new Date();
  // Gunakan zona waktu Makassar (WITA)
  const witaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Makassar" }));
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayName = dayNames[witaTime.getDay()];
  
  const currentTime = witaTime.getHours() * 100 + witaTime.getMinutes(); 

  const todaySchedule = hours[dayName]; 
  if (!todaySchedule || todaySchedule === "Closed") return { isOpen: false, message: "Tutup Hari Ini" };

  const [start, end] = todaySchedule.split("-");
  const startTime = parseInt(start.replace(":", ""));
  const endTime = parseInt(end.replace(":", ""));

  const isOpen = currentTime >= startTime && currentTime <= endTime;
  
  return {
    isOpen,
    message: isOpen ? `Buka Sekarang (Tutup jam ${end})` : `Tutup (Buka jam ${start})`,
  };
}