import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface ProcessReceiptRequest {
  imageUrl: string;
  uploadId: string;
}

interface ExtractedReceiptData {
  date: string;
  amount: number;
  merchant: string;
  category: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  currency: string;
  confidence: number;
  taxAmount?: number;
  tipAmount?: number;
  paymentMethod?: string;
  notes?: string;
}

const EXTRACTION_PROMPT = `Analyze this receipt or invoice image and extract the following information in JSON format:

{
  "date": "YYYY-MM-DD (date of purchase/transaction)",
  "amount": number (total amount paid),
  "merchant": "string (store/business name)",
  "category": "string (suggested expense category: Groceries, Restaurants, Transportation, Utilities, Entertainment, Shopping, Health, etc.)",
  "items": [
    {
      "name": "string (item name)",
      "quantity": number,
      "price": number
    }
  ],
  "currency": "string (3-letter currency code, e.g., USD, EUR, MXN)",
  "confidence": number (0-1, your confidence in the extraction accuracy),
  "taxAmount": number (tax amount if visible),
  "tipAmount": number (tip amount if visible),
  "paymentMethod": "string (cash, card, etc. if visible)",
  "notes": "string (any additional relevant information)"
}

Rules:
- If you cannot find a specific field, use null for that field
- For items, only include if clearly visible on the receipt
- Be conservative with confidence score
- Date should be in YYYY-MM-DD format
- Amount should be the total final amount paid
- Category should be in Spanish if possible
- Merchant name should be cleaned up (remove address, etc.)

Return ONLY the JSON object, no additional text.`;

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { imageUrl, uploadId }: ProcessReceiptRequest = JSON.parse(event.body || '{}');

    if (!imageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'imageUrl is required' })
      };
    }

    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'AI service not configured' })
      };
    }

    console.log('Processing receipt', { uploadId, imageUrl: imageUrl.substring(0, 50) + '...' });

    // Call OpenAI GPT-4 Vision API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: EXTRACTION_PROMPT
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.2 // Low temperature for more consistent results
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          success: false,
          error: 'Error calling AI service'
        })
      };
    }

    const aiResponse = await response.json();
    console.log('OpenAI response received', { uploadId });

    // Extract the message content
    const messageContent = aiResponse.choices[0]?.message?.content;
    if (!messageContent) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'No response from AI'
        })
      };
    }

    // Parse the JSON response
    let extractedData: ExtractedReceiptData;
    try {
      // Remove markdown code blocks if present
      const cleanedContent = messageContent
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      extractedData = JSON.parse(cleanedContent);

      // Validate required fields
      if (!extractedData.date || !extractedData.amount || !extractedData.merchant) {
        throw new Error('Missing required fields in extracted data');
      }

      // Set defaults
      extractedData.currency = extractedData.currency || 'USD';
      extractedData.confidence = extractedData.confidence || 0.5;

      console.log('Receipt extracted successfully', {
        uploadId,
        merchant: extractedData.merchant,
        amount: extractedData.amount,
        confidence: extractedData.confidence
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: extractedData
        })
      };

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError, messageContent);
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'Error parsing AI response: ' + (parseError as Error).message
        })
      };
    }

  } catch (error) {
    console.error('Error processing receipt:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error: ' + (error as Error).message
      })
    };
  }
};
