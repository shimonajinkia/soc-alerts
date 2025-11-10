// src/types/Alert.ts
export type Alert = {
  id: number;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  timestamp?: string; // optional, if your backend provides it
};
