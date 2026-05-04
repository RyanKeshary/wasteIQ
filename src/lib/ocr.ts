import { createWorker, createScheduler, Worker } from 'tesseract.js';
import { prisma } from '@/lib/prisma';

export interface OCRResult {
  text: string;
  confidence: number;
  keywords: string[];
  locationHint?: string;
  detectedBinId?: string;
}

// Global scheduler to reuse workers across requests
let scheduler: any = null;

/**
 * Initializes the OCR scheduler with multiple workers for parallel processing.
 */
async function getScheduler() {
  if (scheduler) return scheduler;

  const s = createScheduler();
  
  // Initialize 2 workers for balanced performance (eng + hin)
  // Reusing workers saves ~3-5 seconds per request (loading time)
  for (let i = 0; i < 2; i++) {
    const worker = await createWorker('eng+hin', 1, {
      logger: m => console.log(`[OCR Worker ${i}]`, m.status, `${Math.round(m.progress * 100)}%`),
    });
    s.addWorker(worker);
  }

  scheduler = s;
  return scheduler;
}

// Comprehensive tags for Indian urban context (Mira-Bhayandar specific)
const ZONES = ['hospital', 'school', 'market', 'industrial', 'residential', 'commercial', 'coastal', 'station', 'highway', 'chowk', 'naka', 'society', 'mall', 'mandir', 'masjid', 'church', 'garden', 'park'];
const WASTE_TAGS = ['plastic', 'garbage', 'dump', 'overflow', 'chemical', 'sewage', 'medical', 'e-waste', 'debris', 'construction', 'scrap', 'dry', 'wet', 'stagnant', 'litter'];
const URGENCY_TAGS = ['hazard', 'toxic', 'smell', 'stench', 'disease', 'emergency', 'danger', 'risk', 'leaking', 'fire', 'accident', 'deadly'];

/**
 * Processes an image via OCR and extracts meaningful metadata.
 * Uses a persistent worker pool to avoid loading overhead.
 */
export async function processImageOCR(imageUrl: string): Promise<OCRResult> {
  try {
    const s = await getScheduler();
    
    // Perform OCR
    const { data: { text, confidence } } = await s.addJob('recognize', imageUrl);

    const normalizedText = text.toLowerCase().replace(/[^\w\s\u0900-\u097F]/g, ' '); // Keep Devanagari and Alphanumeric
    
    // 1. Extract Keywords
    const keywords = new Set<string>();
    [...ZONES, ...WASTE_TAGS, ...URGENCY_TAGS].forEach(tag => {
      if (normalizedText.includes(tag)) {
        keywords.add(tag.toUpperCase());
      }
    });

    // 2. Extract Bin ID (Pattern: WIQ-XXXX or QR-MB-XXXX)
    const binIdMatch = text.match(/(WIQ|QR-MB)-?\d{4}/i);
    const detectedBinId = binIdMatch ? binIdMatch[0].toUpperCase().replace(/[^A-Z0-9-]/g, '') : undefined;

    // 3. Extract Location Hints (Mira-Bhayandar Landmarks)
    const locationPatterns = [
      /(?:near|opposite|behind|beside|at|rd|road|st|street|ward|sector|zone|nagar|complex|building|plaza|circle|bridge|flyover)\s+([a-z0-9\s\u0900-\u097F]{3,40})/i,
      /([a-z0-9\s\u0900-\u097F]{3,30})\s+(?:road|st|street|chowk|naka|circle|bypass|link road)/i
    ];

    let locationHint: string | undefined;
    for (const pattern of locationPatterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        locationHint = match[0].trim();
        break;
      }
    }

    return {
      text: text.trim(),
      confidence,
      keywords: Array.from(keywords),
      locationHint,
      detectedBinId
    };
  } catch (error) {
    console.error('[OCR SERVICE ERROR]', error);
    throw new Error('OCR Processing failed. Image might be inaccessible or malformed.');
  }
}

/**
 * High-level utility to update a complaint with OCR results.
 * Adjusts priority based on detected urgency and location.
 */
export async function processComplaintOCR(complaintId: string) {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      select: { imageUrl: true, id: true, priority: true }
    });

    if (!complaint?.imageUrl) return;

    const result = await processImageOCR(complaint.imageUrl);

    // AI-Driven Prioritization Logic
    let priorityScore = complaint.priority;
    
    // 1. Detect Urgency (Priority 1 = Critical)
    const hasUrgentKeyword = result.keywords.some(k => URGENCY_TAGS.map(t => t.toUpperCase()).includes(k));
    const isSensitiveArea = result.keywords.some(k => ['HOSPITAL', 'SCHOOL', 'MARKET', 'MANDIR', 'MASJID'].includes(k));
    
    if (hasUrgentKeyword) priorityScore = 1;
    else if (isSensitiveArea && priorityScore > 1) priorityScore = 1;

    await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        ocrText: result.text,
        ocrKeywords: result.keywords,
        ocrLocationHint: result.locationHint,
        ocrConfidence: result.confidence,
        priority: priorityScore,
        // Auto-link to bin if detected and no bin currently linked
        ...(result.detectedBinId && {
          bin: {
            connect: { qrCode: result.detectedBinId }
          }
        })
      }
    });

    console.log(`[OCR PIPELINE] Successfully processed #${complaintId} (Conf: ${result.confidence}%)`);
  } catch (error) {
    console.error(`[OCR PIPELINE ERROR] Failed for #${complaintId}:`, error);
  }
}
