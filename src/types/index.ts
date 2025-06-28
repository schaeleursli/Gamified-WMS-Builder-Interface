// Core entity types for the WMS Builder application
export type Project = {
  id: string;
  name: string;
  location: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  wmsList: WMS[];
  createdAt: string;
  updatedAt: string;
};
export type WMS = {
  id: string;
  projectId: string;
  title: string;
  scope: string;
  tags: string[];
  steps: WorkStep[];
  risks: Risk[];
  templateId?: string;
  createdAt: string;
  updatedAt: string;
};
export type WorkStep = {
  id: string;
  wmsId: string;
  title: string;
  description: string;
  equipment: Equipment[];
  notes?: string;
  order: number;
};
export type RiskCategory = 'Lifting' | 'Transport' | 'OceanFreight' | 'General';
export type RiskSeverity = 1 | 2 | 3 | 4 | 5;
export type RiskLikelihood = 1 | 2 | 3 | 4 | 5;
export type RiskSource = 'manual' | 'ai';
export type Risk = {
  id: string;
  wmsId: string;
  type: RiskCategory;
  description: string;
  severity: RiskSeverity;
  likelihood: RiskLikelihood;
  mitigation: string;
  associatedStepIds?: string[]; // step IDs
  source: RiskSource;
};
export type EquipmentCategory = 'crane' | 'truck' | 'ppe' | 'container' | 'tool' | 'vehicle';
export type Equipment = {
  id: string;
  name: string;
  category: EquipmentCategory;
  quantity: number;
  icon?: string;
};
export type Template = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  wms: Omit<WMS, 'projectId' | 'id' | 'createdAt' | 'updatedAt'>;
  createdAt: string;
  updatedAt: string;
};
// Helper types for UI components
export type RiskLevel = 'Low' | 'Medium' | 'High';
export interface RiskLevelInfo {
  level: RiskLevel;
  color: string;
}