/**
 * Canva Service for JetAI
 * Handles integration with Canva's API for creating visual travel itineraries
 */

import axios from 'axios';

// Canva API configuration
const CANVA_API_BASE_URL = 'https://api.canva.com/v1';
const CANVA_API_KEY = process.env.CANVA_API_KEY;
const CANVA_TEMPLATE_ID = process.env.CANVA_TEMPLATE_ID;

/**
 * Interface for travel itinerary data to be passed to Canva
 */
export interface TravelItineraryData {
  destination: string;
  startDate: string;
  endDate: string;
  activities: Array<{
    day: number;
    title: string;
    description: string;
    location?: string;
  }>;
  accommodation: {
    name: string;
    location: string;
    imageUrl?: string;
  };
  travelStyle: string;
  travelerName?: string;
  budget?: string;
  coverImageUrl?: string;
}

/**
 * Generate a visual travel itinerary using Canva API
 * @param data Travel itinerary data
 * @returns URL to the generated Canva design
 */
export async function generateTravelItineraryVisual(data: TravelItineraryData) {
  if (!CANVA_API_KEY || !CANVA_TEMPLATE_ID) {
    throw new Error('Canva API credentials are not configured');
  }

  try {
    // Step 1: Create a new design from template
    const createDesignResponse = await axios.post(
      `${CANVA_API_BASE_URL}/designs`,
      {
        templateId: CANVA_TEMPLATE_ID,
        title: `${data.destination} Travel Itinerary`,
      },
      {
        headers: {
          'Authorization': `Bearer ${CANVA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const designId = createDesignResponse.data.designId;

    // Step 2: Autofill the template with travel data
    await axios.post(
      `${CANVA_API_BASE_URL}/designs/${designId}/autofill`,
      {
        fields: {
          // Map data to template fields
          destinationTitle: data.destination,
          travelDates: `${data.startDate} - ${data.endDate}`,
          accommodation: data.accommodation.name,
          accommodationLocation: data.accommodation.location,
          travelStyle: data.travelStyle,
          travelerName: data.travelerName || 'Your Trip',
          budget: data.budget || 'Custom',
          // Activities
          ...data.activities.reduce((acc, activity, index) => {
            if (index < 10) { // Assume template has up to 10 activity slots
              acc[`activity${index + 1}Title`] = activity.title;
              acc[`activity${index + 1}Description`] = activity.description;
              acc[`activity${index + 1}Location`] = activity.location || '';
              acc[`activity${index + 1}Day`] = `Day ${activity.day}`;
            }
            return acc;
          }, {} as Record<string, string>),
        },
        // Handle images if available
        images: [
          ...(data.coverImageUrl ? [{
            fieldId: 'coverImage',
            url: data.coverImageUrl
          }] : []),
          ...(data.accommodation.imageUrl ? [{
            fieldId: 'accommodationImage',
            url: data.accommodation.imageUrl
          }] : []),
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${CANVA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Step 3: Generate edit URL and view/download URL
    const designUrlResponse = await axios.get(
      `${CANVA_API_BASE_URL}/designs/${designId}/urls`,
      {
        headers: {
          'Authorization': `Bearer ${CANVA_API_KEY}`,
        },
      }
    );

    return {
      designId,
      editUrl: designUrlResponse.data.editUrl,
      viewUrl: designUrlResponse.data.viewUrl,
      downloadPdfUrl: `${CANVA_API_BASE_URL}/designs/${designId}/export/pdf`,
      pngThumbnailUrl: `${CANVA_API_BASE_URL}/designs/${designId}/export/thumbnail?format=png&width=800`,
    };
  } catch (error) {
    console.error('Error generating Canva visual itinerary:', error);
    throw new Error('Failed to generate visual itinerary with Canva');
  }
}

/**
 * Download a generated design as PDF
 * @param designId The Canva design ID
 * @returns PDF file buffer
 */
export async function downloadDesignAsPdf(designId: string) {
  if (!CANVA_API_KEY) {
    throw new Error('Canva API credentials are not configured');
  }

  try {
    const response = await axios.get(
      `${CANVA_API_BASE_URL}/designs/${designId}/export/pdf`,
      {
        headers: {
          'Authorization': `Bearer ${CANVA_API_KEY}`,
        },
        responseType: 'arraybuffer'
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error downloading design as PDF:', error);
    throw new Error('Failed to download design as PDF');
  }
}

/**
 * Generate an image using AI for the itinerary
 * @param prompt Description of the image to generate
 * @returns URL to the generated image
 */
export async function generateAIImage(prompt: string) {
  // This function will use DALL-E or Gemini Vision API
  // Implementation will vary based on which AI image service you're using
  try {
    // Example implementation for OpenAI's DALL-E
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: `Travel photograph of ${prompt}, high resolution, professional travel photography style`,
        n: 1,
        size: '1024x1024',
        response_format: 'url'
      },
      {
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data[0].url;
  } catch (error) {
    console.error('Error generating AI image:', error);
    throw new Error('Failed to generate AI image');
  }
}