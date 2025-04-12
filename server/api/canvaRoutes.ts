/**
 * Canva Visual Engine API Routes
 * Handles API endpoints for Canva visual itinerary integration
 */

import { Router, Request, Response } from 'express';
import { generateTravelItineraryVisual, downloadDesignAsPdf, generateAIImage, TravelItineraryData } from '../lib/canvaService';
import { storage } from '../storage';

const router = Router();

/**
 * Generate a visual travel itinerary with Canva
 * POST /api/canva/generate-itinerary
 */
router.post('/generate-itinerary', async (req: Request, res: Response) => {
  try {
    const travelData: TravelItineraryData = req.body;
    
    // Validate request data
    if (!travelData.destination || !travelData.startDate || !travelData.endDate || !travelData.activities) {
      return res.status(400).json({ 
        error: 'Incomplete travel data. Required fields: destination, startDate, endDate, activities' 
      });
    }

    // Generate visual itinerary with Canva
    const result = await generateTravelItineraryVisual(travelData);
    
    // If this is for a logged in user, save the design URL to their trip
    if (req.user && req.body.tripId) {
      try {
        await storage.updateItinerary(parseInt(req.body.tripId), {
          canvaDesignUrl: result.editUrl,
          canvaDesignId: result.designId
        });
      } catch (err) {
        console.error('Failed to save Canva design URL to trip:', err);
        // Continue with the response even if saving fails
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generating visual itinerary:', error);
    return res.status(500).json({ 
      error: 'Failed to generate visual itinerary',
      message: error instanceof Error ? error.message : 'Unknown error'
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
    
    const pdfBuffer = await downloadDesignAsPdf(designId);
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="travel-itinerary-${designId}.pdf"`);
    
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('Error downloading design as PDF:', error);
    return res.status(500).json({ 
      error: 'Failed to download design as PDF',
      message: error instanceof Error ? error.message : 'Unknown error'
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
    
    const imageUrl = await generateAIImage(prompt);
    
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating AI image:', error);
    return res.status(500).json({ 
      error: 'Failed to generate AI image',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;