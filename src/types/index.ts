export interface ResearchEntry {
  id: string;
  contentNumber: string;
  title: string;
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok';
  contentType: 'video' | 'reel' | 'post';
  sources: Source[];
  uploadDate: string;
  description?: string;
  tags: string[];
}

export interface Source {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'research_paper' | 'website' | 'book' | 'video' | 'other';
  credibility: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface Correction {
  id: string;
  contentNumber: string;
  title: string;
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok';
  mistakeDescription: string;
  correction: string;
  correctionDate: string;
  severity: 'minor' | 'moderate' | 'major';
  status: 'pending' | 'corrected' | 'acknowledged';
}

export interface ContentStats {
  totalContent: number;
  platformBreakdown: Record<string, number>;
  totalSources: number;
  totalCorrections: number;
}