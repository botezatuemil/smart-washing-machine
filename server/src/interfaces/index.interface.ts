export interface TasmotaPayload {
  StatusSNS: {
    Time: string;
    ENERGY: {
      TotalStartTime: string;
      Total: number;
      Yesterday: number;
      Today: number;
      Power: number;
      ApparentPower: number;
      ReactivePower: number;
      Factor: number;
      Voltage: number;
      Current: number;
    };
  };
}
