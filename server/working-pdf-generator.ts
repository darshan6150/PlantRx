import PDFDocument from 'pdfkit';

interface UserInfo {
  name: string;
  goal: string;
  level: string;
  duration: string;
}

export function generateSimplePDF(type: string, userInfo: UserInfo): Buffer {
  const doc = new PDFDocument({ 
    margin: 50,
    size: 'A4'
  });
  
  const buffers: Buffer[] = [];
  doc.on('data', buffers.push.bind(buffers));
  
  // Generate content synchronously
  generatePDFContent(doc, type, userInfo);
  
  doc.end();
  
  return new Promise<Buffer>((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });
  }) as any;
}

function generatePDFContent(doc: PDFKit.PDFDocument, type: string, userInfo: UserInfo) {
  const planName = type.charAt(0).toUpperCase() + type.slice(1);
  
  // PAGE 1: COVER PAGE
  doc.fontSize(28)
     .fillColor('#16a34a')
     .text(`Your Personalized ${planName} Plan`, 50, 100, { width: 500, align: 'center' });
  
  doc.fontSize(16)
     .fillColor('#666')
     .text('Comprehensive Health Guide', 50, 150, { width: 500, align: 'center' });
  
  doc.fontSize(14)
     .fillColor('#333')
     .text(`Created for: ${userInfo.name}`, 50, 200, { width: 500, align: 'center' })
     .text(`Goal: ${userInfo.goal}`, 50, 220, { width: 500, align: 'center' })
     .text(`Level: ${userInfo.level}`, 50, 240, { width: 500, align: 'center' })
     .text(`Duration: ${userInfo.duration}`, 50, 260, { width: 500, align: 'center' });
  
  doc.fontSize(12)
     .fillColor('#999')
     .text(`Generated: ${new Date().toLocaleDateString()}`, 50, 300, { width: 500, align: 'center' })
     .text('PlantRx - Your Health Journey Partner', 50, 320, { width: 500, align: 'center' });
  
  // Add decorative line
  doc.moveTo(50, 350).lineTo(550, 350).strokeColor('#16a34a').lineWidth(3).stroke();
  
  doc.fontSize(11)
     .fillColor('#555')
     .text('This comprehensive guide includes:', 50, 380)
     .text('• Detailed weekly schedules', 70, 400)
     .text('• Daily tracking tools', 70, 420)
     .text('• Progress monitoring sheets', 70, 440)
     .text('• Tips and troubleshooting', 70, 460)
     .text('• Reflection and planning pages', 70, 480);

  // PAGE 2: OVERVIEW
  doc.addPage();
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text('Your Journey Overview', 50, 50);
  
  doc.fontSize(12)
     .fillColor('#333')
     .text(`Welcome ${userInfo.name}!`, 50, 100)
     .text(`This ${type} plan has been designed specifically for your goal: ${userInfo.goal}`, 50, 120, { width: 500 })
     .text(`As a ${userInfo.level.toLowerCase()} level participant, this ${userInfo.duration} program will help you achieve sustainable results.`, 50, 160, { width: 500 });
  
  doc.fontSize(14)
     .fillColor('#16a34a')
     .text('What You\'ll Achieve:', 50, 220);
  
  const achievements = getAchievements(type);
  let yPos = 250;
  achievements.forEach((achievement, index) => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`${index + 1}. ${achievement}`, 70, yPos);
    yPos += 20;
  });
  
  doc.fontSize(14)
     .fillColor('#16a34a')
     .text('Getting Started:', 50, yPos + 40);
  
  doc.fontSize(11)
     .fillColor('#333')
     .text('• Read through this entire guide before starting', 70, yPos + 70)
     .text('• Set up your tracking system', 70, yPos + 90)
     .text('• Plan your first week in detail', 70, yPos + 110)
     .text('• Commit to following the schedule', 70, yPos + 130);

  // PAGE 3: WEEKLY SCHEDULE
  doc.addPage();
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text(`${userInfo.duration} Weekly Schedule`, 50, 50);
  
  generateWeeklySchedule(doc, type, userInfo);

  // PAGE 4: DAILY TRACKING
  doc.addPage();
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text('Daily Tracking Tools', 50, 50);
  
  generateDailyTracking(doc, type);

  // PAGE 5: PROGRESS MONITORING
  doc.addPage();
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text('Progress Monitoring', 50, 50);
  
  generateProgressMonitoring(doc, type);

  // PAGE 6: RESOURCES & TIPS
  doc.addPage();
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text('Resources & Success Tips', 50, 50);
  
  generateResourcesAndTips(doc, type);

  // PAGE 7: REFLECTION PAGES
  doc.addPage();
  doc.fontSize(20)
     .fillColor('#16a34a')
     .text('Weekly Reflection & Planning', 50, 50);
  
  generateReflectionPages(doc);
}

function getAchievements(type: string): string[] {
  const achievements: Record<string, string[]> = {
    diet: [
      'Improved energy levels throughout the day',
      'Better digestion and gut health',
      'Sustainable weight management',
      'Enhanced nutrient intake and absorption',
      'Reduced cravings for processed foods',
      'Better relationship with food'
    ],
    fitness: [
      'Increased overall strength and endurance',
      'Improved cardiovascular health',
      'Enhanced flexibility and mobility',
      'Better muscle tone and definition',
      'Increased daily energy levels',
      'Improved sleep quality'
    ],
    wellness: [
      'Reduced stress and anxiety levels',
      'Better emotional regulation',
      'Improved sleep patterns',
      'Enhanced mindfulness and presence',
      'Greater life satisfaction',
      'Better work-life balance'
    ],
    skincare: [
      'Clearer, more radiant complexion',
      'Improved skin texture and tone',
      'Better hydration and moisture retention',
      'Reduced signs of aging',
      'Enhanced skin barrier function',
      'Improved confidence and self-esteem'
    ],
    recovery: [
      'Faster muscle recovery after exercise',
      'Improved sleep quality and duration',
      'Reduced inflammation and soreness',
      'Enhanced energy restoration',
      'Better stress management',
      'Improved overall resilience'
    ]
  };
  
  return achievements[type] || achievements.wellness;
}

function generateWeeklySchedule(doc: PDFKit.PDFDocument, type: string, userInfo: UserInfo) {
  doc.fontSize(14)
     .fillColor('#16a34a')
     .text('Weekly Focus Areas:', 50, 90);
  
  const weeks = [
    { week: 1, focus: 'Foundation Building', description: 'Establishing basic routines and habits' },
    { week: 2, focus: 'Skill Development', description: 'Learning and practicing new techniques' },
    { week: 3, focus: 'Optimization', description: 'Fine-tuning and maximizing results' },
    { week: 4, focus: 'Mastery & Maintenance', description: 'Solidifying habits for long-term success' }
  ];
  
  let yPos = 120;
  weeks.forEach(week => {
    doc.fontSize(12)
       .fillColor('#16a34a')
       .text(`Week ${week.week}: ${week.focus}`, 70, yPos);
    doc.fontSize(10)
       .fillColor('#555')
       .text(week.description, 90, yPos + 15);
    yPos += 45;
  });
  
  doc.fontSize(14)
     .fillColor('#16a34a')
     .text('Daily Structure Template:', 50, yPos + 30);
  
  const dailyStructure = [
    { time: 'Morning (6-9 AM)', activity: `Primary ${type} activity`, duration: '30-45 minutes' },
    { time: 'Midday (12-1 PM)', activity: 'Progress check-in', duration: '5-10 minutes' },
    { time: 'Evening (6-8 PM)', activity: 'Reflection & planning', duration: '10-15 minutes' }
  ];
  
  yPos += 60;
  dailyStructure.forEach(item => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`${item.time}:`, 70, yPos)
       .text(`${item.activity} (${item.duration})`, 200, yPos);
    yPos += 25;
  });
}

function generateDailyTracking(doc: PDFKit.PDFDocument, type: string) {
  doc.fontSize(14)
     .fillColor('#16a34a')
     .text('Weekly Progress Tracker:', 50, 90);
  
  // Create a simple table
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const startX = 70;
  const startY = 120;
  const cellWidth = 60;
  const cellHeight = 25;
  
  // Header row
  doc.fontSize(10).fillColor('#333');
  doc.text('Week', startX, startY);
  days.forEach((day, index) => {
    doc.text(day, startX + (index + 1) * cellWidth, startY);
  });
  
  // Data rows
  for (let week = 1; week <= 4; week++) {
    const y = startY + week * cellHeight;
    doc.text(`${week}`, startX, y);
    for (let day = 0; day < 7; day++) {
      doc.rect(startX + (day + 1) * cellWidth, y - 5, cellWidth - 5, cellHeight - 5).stroke();
    }
  }
  
  doc.fontSize(14)
     .fillColor('#16a34a')
     .text('Daily Habit Checklist:', 50, startY + 150);
  
  const habits = getHabits(type);
  let yPos = startY + 180;
  habits.forEach(habit => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`□ ${habit}`, 70, yPos);
    yPos += 20;
  });
}

function getHabits(type: string): string[] {
  const habits: Record<string, string[]> = {
    diet: [
      'Drink 8 glasses of water',
      'Eat 5 servings of fruits/vegetables',
      'Include protein in every meal',
      'Practice mindful eating',
      'Avoid processed snacks',
      'Plan tomorrow\'s meals'
    ],
    fitness: [
      'Complete planned workout',
      'Do 10 minutes of stretching',
      'Take at least 8,000 steps',
      'Practice proper form',
      'Log workout details',
      'Get adequate rest'
    ],
    wellness: [
      'Practice 10 minutes of meditation',
      'Write 3 gratitude items',
      'Spend time in nature',
      'Limit screen time before bed',
      'Connect with a friend/family',
      'Practice deep breathing'
    ],
    skincare: [
      'Complete morning routine',
      'Apply sunscreen',
      'Stay hydrated',
      'Complete evening routine',
      'Get 7-8 hours sleep',
      'Avoid touching face'
    ],
    recovery: [
      'Get quality sleep (7-9 hours)',
      'Practice relaxation techniques',
      'Do gentle movement',
      'Eat anti-inflammatory foods',
      'Limit stress exposure',
      'Monitor energy levels'
    ]
  };
  
  return habits[type] || habits.wellness;
}

function generateProgressMonitoring(doc: PDFKit.PDFDocument, type: string) {
  doc.fontSize(14)
     .fillColor('#16a34a')
     .text('Weekly Assessment Questions:', 50, 90);
  
  const questions = [
    'How did I feel overall this week? (1-10)',
    'What was my energy level like? (1-10)',
    'How well did I stick to my plan? (%)',
    'What was my biggest success?',
    'What was my biggest challenge?',
    'What will I focus on next week?'
  ];
  
  let yPos = 120;
  questions.forEach((question, index) => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`${index + 1}. ${question}`, 70, yPos);
    
    // Add lines for answers
    for (let i = 0; i < 2; i++) {
      doc.moveTo(70, yPos + 20 + (i * 15))
         .lineTo(500, yPos + 20 + (i * 15))
         .strokeColor('#ccc')
         .lineWidth(0.5)
         .stroke();
    }
    yPos += 50;
  });
  
  doc.fontSize(14)
     .fillColor('#16a34a')
     .text('Monthly Goal Review:', 50, yPos + 30);
  
  yPos += 60;
  const goals = ['Goal 1:', 'Goal 2:', 'Goal 3:'];
  goals.forEach(goal => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(goal, 70, yPos);
    
    // Add lines
    for (let i = 0; i < 3; i++) {
      doc.moveTo(120, yPos + (i * 15))
         .lineTo(500, yPos + (i * 15))
         .strokeColor('#ccc')
         .lineWidth(0.5)
         .stroke();
    }
    yPos += 60;
  });
}

function generateResourcesAndTips(doc: PDFKit.PDFDocument, type: string) {
  doc.fontSize(14)
     .fillColor('#16a34a')
     .text('Success Tips:', 50, 90);
  
  const tips = [
    'Start small and build consistency over time',
    'Track your progress daily to stay motivated',
    'Celebrate small wins along the way',
    'Don\'t be afraid to adjust the plan as needed',
    'Focus on progress, not perfection',
    'Be patient and kind to yourself',
    'Get support from friends and family',
    'Plan ahead to avoid obstacles'
  ];
  
  let yPos = 120;
  tips.forEach(tip => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`• ${tip}`, 70, yPos);
    yPos += 20;
  });
  
  doc.fontSize(14)
     .fillColor('#16a34a')
     .text('Troubleshooting Common Challenges:', 50, yPos + 30);
  
  yPos += 60;
  const challenges = [
    'Low motivation: Review your why and start with easier tasks',
    'Time constraints: Break activities into 10-15 minute segments',
    'Plateau: Gradually increase intensity or try variations',
    'Setbacks: Remember they\'re normal, focus on getting back on track'
  ];
  
  challenges.forEach(challenge => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(`• ${challenge}`, 70, yPos, { width: 450 });
    yPos += 30;
  });
}

function generateReflectionPages(doc: PDFKit.PDFDocument) {
  doc.fontSize(14)
     .fillColor('#16a34a')
     .text('End of Week Reflection:', 50, 90);
  
  const reflectionPrompts = [
    'What am I most proud of this week?',
    'What did I learn about myself?',
    'What would I do differently?',
    'How do I feel about my progress?',
    'What support do I need going forward?'
  ];
  
  let yPos = 120;
  reflectionPrompts.forEach(prompt => {
    doc.fontSize(11)
       .fillColor('#333')
       .text(prompt, 70, yPos);
    
    // Add lines for writing
    for (let i = 0; i < 4; i++) {
      doc.moveTo(70, yPos + 20 + (i * 15))
         .lineTo(500, yPos + 20 + (i * 15))
         .strokeColor('#ccc')
         .lineWidth(0.5)
         .stroke();
    }
    yPos += 80;
  });
  
  // Add footer
  doc.fontSize(10)
     .fillColor('#666')
     .text('PlantRx - Your Personalized Health Journey', 50, 750, { width: 500, align: 'center' })
     .text('This guide is for educational purposes only. Consult healthcare professionals for medical advice.', 50, 770, { width: 500, align: 'center' });
}