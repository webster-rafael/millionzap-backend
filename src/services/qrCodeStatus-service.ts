import axios, { AxiosInstance } from "axios";

interface ConnectionStatusResponse {
  state: "connecting" | "open" | "close";
}

export class QrCodeStatusService {
  private readonly evolutionApi: AxiosInstance;

  constructor(apikey: string) {
    this.evolutionApi = axios.create({
      baseURL: "https://evolution.omnizap.com.br/instance",
      headers: {
        "Content-Type": "application/json",
        "apikey": apikey,
      },
    });
  }

  async getConnectionStatus(
    instanceName: string
  ): Promise<ConnectionStatusResponse> {
    try {
      const response = await this.evolutionApi.get<ConnectionStatusResponse>(
        `/connectionState/${instanceName}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Erro na API da Evolution:", error.response?.data);
      } else {
        console.error("Erro inesperado ao buscar status:", error);
      }
      throw new Error("Falha ao se conectar com a API da Evolution.");
    }
  }
}
