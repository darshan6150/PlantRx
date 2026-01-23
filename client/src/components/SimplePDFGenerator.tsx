import jsPDF from 'jspdf';
import { generatePersonalizedContent, type PersonalizedContent } from '@/utils/aiContentGenerator';

interface GeneratePDFProps {
  selectedPlan: any;
  generatedPlan: any;
  selectedTemplate: string;
}

export const generateAIPoweredPDF = async ({ selectedPlan, generatedPlan, selectedTemplate }: GeneratePDFProps) => {
  try {
    console.log('Starting AI-powered PDF generation...');
    
    // Generate AI-powered personalized content
    const aiContent = await generatePersonalizedContent(
      selectedPlan?.id || 'diet',
      generatedPlan?.duration || '7 days',
      generatedPlan?.answers || {}
    );

    console.log('AI content generated successfully:', aiContent);

    const pdf = new jsPDF('p', 'mm', 'a4');
    let yPosition = 25;
    const margin = 20;
    const maxWidth = pdf.internal.pageSize.width - (margin * 2);
    const pageHeight = pdf.internal.pageSize.height;

    // Helper functions
    const checkPageBreak = (neededSpace = 25) => {
      if (yPosition + neededSpace > pageHeight - 25) {
        pdf.addPage();
        yPosition = 25;
        return true;
      }
      return false;
    };

    const addRichText = (text: string, fontSize = 11, color = '#333333') => {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(color);
      const lines = pdf.splitTextToSize(text, maxWidth - 20);
      lines.forEach((line: string) => {
        checkPageBreak(10);
        pdf.text(line, margin + 10, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    };

    // COVER PAGE
    pdf.setTextColor('#2563eb');
    pdf.setFontSize(28);
    pdf.setFont("helvetica", "bold");
    
    const mainTitle = `Your Personalized ${selectedPlan?.name || 'Health'} Plan`;
    pdf.text(mainTitle, margin, yPosition + 20);
    yPosition += 50;

    pdf.setTextColor('#444444');
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Duration: ${generatedPlan?.duration || '7 days'}`, margin, yPosition);
    yPosition += 20;
    pdf.text(`Created: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 40;

    // Introduction
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("🎯 Your Personalized Guide Includes:", margin, yPosition);
    yPosition += 20;

    const features = [
      "AI-generated content tailored to your goals",
      "Detailed recipes and step-by-step instructions", 
      "Personalized shopping lists and meal plans",
      "Expert tips and professional recommendations",
      "Progress tracking tools and interactive checklists"
    ];

    features.forEach(feature => {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`✓ ${feature}`, margin + 5, yPosition);
      yPosition += 15;
    });

    // MEAL PLANS SECTION (for diet plans)
    if (selectedPlan?.id === 'diet' && aiContent.mealPlans) {
      pdf.addPage();
      yPosition = 25;
      
      pdf.setTextColor('#2563eb');
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("🍽️ Your Personalized Meal Plans", margin, yPosition);
      yPosition += 30;

      aiContent.mealPlans.forEach((dayPlan, index) => {
        checkPageBreak(120);
        
        // Day header
        pdf.setTextColor('#1f2937');
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Day ${dayPlan.day}`, margin, yPosition);
        yPosition += 20;

        // Meals
        const meals = [
          { label: "🍳 Breakfast", data: dayPlan.breakfast },
          { label: "🥗 Lunch", data: dayPlan.lunch },
          { label: "🍽️ Dinner", data: dayPlan.dinner }
        ];

        meals.forEach(meal => {
          checkPageBreak(40);
          
          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text(`${meal.label}: ${meal.data.name}`, margin, yPosition);
          yPosition += 12;
          
          addRichText(`Recipe: ${meal.data.recipe}`, 10);
          addRichText(`Benefits: ${meal.data.nutrition}`, 9, '#666666');
        });

        if (dayPlan.snacks && dayPlan.snacks.length > 0) {
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text("🍎 Healthy Snacks:", margin, yPosition);
          yPosition += 10;
          
          dayPlan.snacks.forEach(snack => {
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            pdf.text(`• ${snack}`, margin + 10, yPosition);
            yPosition += 8;
          });
        }
        
        yPosition += 20;
      });
    }

    // SHOPPING LIST SECTION
    if (aiContent.shoppingList && aiContent.shoppingList.length > 0) {
      pdf.addPage();
      yPosition = 25;
      
      pdf.setTextColor('#2563eb');
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("🛒 Your Personalized Shopping List", margin, yPosition);
      yPosition += 30;

      aiContent.shoppingList.forEach(category => {
        checkPageBreak(40);
        
        pdf.setTextColor('#1f2937');
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(category.category, margin, yPosition);
        yPosition += 15;
        
        category.items.forEach(item => {
          // Add checkbox
          pdf.setDrawColor('#666666');
          pdf.setLineWidth(0.5);
          pdf.rect(margin + 10, yPosition - 3, 4, 4);
          
          pdf.setFontSize(11);
          pdf.setFont("helvetica", "normal");
          pdf.text(item, margin + 20, yPosition);
          yPosition += 12;
        });
        yPosition += 10;
      });
    }

    // EXPERT TIPS SECTION
    if (aiContent.tips && aiContent.tips.length > 0) {
      pdf.addPage();
      yPosition = 25;
      
      pdf.setTextColor('#2563eb');
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("💡 Expert Tips & Advice", margin, yPosition);
      yPosition += 30;

      aiContent.tips.forEach((tip, index) => {
        checkPageBreak(40);
        
        pdf.setTextColor('#1f2937');
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Tip #${index + 1}:`, margin, yPosition);
        yPosition += 15;
        
        addRichText(tip, 11);
        yPosition += 10;
      });
    }

    // WORKOUT PLANS SECTION (for fitness plans)
    if (selectedPlan?.id === 'workout' && aiContent.workoutPlans) {
      pdf.addPage();
      yPosition = 25;
      
      pdf.setTextColor('#2563eb');
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("💪 Your Personal Fitness Program", margin, yPosition);
      yPosition += 30;

      aiContent.workoutPlans.forEach(workout => {
        checkPageBreak(100);
        
        pdf.setTextColor('#1f2937');
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Day ${workout.day}: ${workout.workoutName}`, margin, yPosition);
        yPosition += 15;
        
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Duration: ${workout.duration}`, margin, yPosition);
        yPosition += 20;

        workout.exercises?.forEach(exercise => {
          checkPageBreak(30);
          
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text(`• ${exercise.name}`, margin + 5, yPosition);
          yPosition += 12;
          
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.text(`Sets: ${exercise.sets} | Reps: ${exercise.reps}`, margin + 15, yPosition);
          yPosition += 8;
          
          addRichText(exercise.description, 9);
        });
        
        yPosition += 20;
      });
    }

    // Save the PDF
    const filename = `PlantRx_${selectedPlan?.name?.replace(/\s+/g, '_') || 'Health'}_${generatedPlan?.duration?.replace(/\s+/g, '_') || '7_Days'}_Plan.pdf`;
    pdf.save(filename);
    
    console.log('PDF generated successfully:', filename);
    return true;

  } catch (error) {
    console.error('PDF Generation Error:', error);
    
    // Fallback to basic PDF if AI generation fails
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    pdf.setTextColor('#2563eb');
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("Your Personalized Health Plan", 20, 40);
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("We're generating your personalized AI content.", 20, 60);
    pdf.text("Please try again in a moment while our AI creates your custom plan.", 20, 75);
    
    pdf.save(`PlantRx_${selectedPlan?.name?.replace(/\s+/g, '_') || 'Health'}_Fallback.pdf`);
    return false;
  }
};