// Receipt types for AI extraction and processing

export interface ExtractedReceiptData {
  date: string; // ISO format YYYY-MM-DD
  amount: number;
  merchant: string;
  category: string;
  items?: ReceiptItem[];
  currency: string;
  confidence: number; // 0-1
  taxAmount?: number;
  tipAmount?: number;
  paymentMethod?: string;
  notes?: string;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
}

export interface ReceiptUpload {
  id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  extracted_data?: ExtractedReceiptData;
  error_message?: string;
  expense_id?: string;
  created_at: string;
  processed_at?: string;
  updated_at: string;
}

export interface ReceiptProcessingResult {
  success: boolean;
  data?: ExtractedReceiptData;
  error?: string;
  uploadId?: string;
}

export interface UploadedFile {
  file: File;
  preview: string;
  path?: string;
}
