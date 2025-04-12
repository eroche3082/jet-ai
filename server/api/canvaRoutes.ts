/**
 * Canva Visual Engine API Routes
 * Handles API endpoints for Canva visual itinerary integration
 */
import { Router, Request, Response } from 'express';
import { canvaService } from '../lib/canvaService';

const router = Router();

interface TravelItineraryData {
  destination: string;
  startDate: Date;
  endDate: Date;
  activities: {
    day: number;
    title: string;
    description: string;
    location?: string;
  }[];
  accommodation: {
    name: string;
    location: string;
    imageUrl?: string;
  };
  travelStyle: string;
  travelerName?: string;
  budget?: string;
  coverImageUrl?: string;
  tripId?: number;
}

/**
 * Generate a visual travel itinerary with Canva
 * POST /api/canva/generate-itinerary
 */
router.post('/generate-itinerary', async (req: Request, res: Response) => {
  try {
    const travelData: TravelItineraryData = req.body;
    
    // Simple validation
    if (!travelData.destination || !travelData.activities || travelData.activities.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields: destination and at least one activity are required' 
      });
    }
    
    // Generate itinerary using Canva service
    const result = await canvaService.generateTravelItineraryVisual(travelData);
    
    // Return design ID and view URL
    res.status(200).json({
      designId: result.designId,
      viewUrl: result.viewUrl
    });
  } catch (error) {
    console.error('Error generating visual itinerary:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate visual itinerary' 
    });
  }
});

/**
 * Download a Canva design as PDF
 * GET /api/canva/download-pdf/:designId
 */
router.get('/download-pdf/:designId', async (req: Request, res: Response) => {
  try {
    const { designId } = req.params;
    
    if (!designId) {
      return res.status(400).json({ error: 'Design ID is required' });
    }
    
    // Get PDF buffer from Canva service
    const pdfBuffer = await canvaService.downloadItineraryPdf(designId);
    
    // Set appropriate headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="travel-itinerary-${designId}.pdf"`);
    
    // Send the PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to download PDF' 
    });
  }
});

/**
 * Generate an AI image for the itinerary
 * POST /api/canva/generate-image
 */
router.post('/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Image prompt is required' });
    }
    
    // Generate image using AI service
    const imageUrl = await canvaService.generateAiImage(prompt);
    
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating AI image:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate AI image' 
    });
  }
});

export default router;