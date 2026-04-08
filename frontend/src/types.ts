export interface Sensors {
  temp: number;
  humi: number;
  light: number;
  motion: boolean;
}

export interface Devices {
  led: boolean;
  fan: boolean;
  relay: boolean;
}

export interface HistoryEntry {
  time: string;
  temp: number;
  humi: number;
}
