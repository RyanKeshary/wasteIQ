/**
 * WasteIQ — Real-time OCR Suggestion API
 * Allows UI to get instant OCR insights for auto-filling or suggestions.
 */
import { NextRequest } from 'next/server';
import { processImageOCR } from '@/lib/ocr';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return apiError('Missing imageUrl for OCR processing', 400);
    }

    const result = await processImageOCR(imageUrl);

    return apiSuccess({
      ...result,
      suggestions: {
        title: result.keywords.length > 0 
          ? `${result.keywords[0]} Issue detected` 
          : 'Environmental Concern',
        description: `Identified keywords: ${result.keywords.join(', ')}. ${result.locationHint ? `Near: ${result.locationHint}` : ''}`
      }
    });
  } catch (error) {
    console.error('[API /ocr/process POST]', error);
    return apiError('OCR processing failed', 500);
  }
}
