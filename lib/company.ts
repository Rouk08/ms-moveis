function envOr(name: string, label: string): string {
  return process.env[name]?.trim() || `[${label} NÃO CONFIGURADO]`;
}

export function getCompanyInfo() {
  return {
    nome: "MS Móveis Planejados",
    cnpj: envOr("COMPANY_CNPJ", "CNPJ"),
    endereco: envOr("COMPANY_ENDERECO", "ENDEREÇO"),
    cep: envOr("COMPANY_CEP", "CEP"),
    bairro: envOr("COMPANY_BAIRRO", "BAIRRO"),
    cidade: envOr("COMPANY_CIDADE", "CIDADE"),
    uf: envOr("COMPANY_UF", "UF"),
    repNome: envOr("COMPANY_REP_NOME", "NOME DO REPRESENTANTE"),
    repCpf: envOr("COMPANY_REP_CPF", "CPF DO REPRESENTANTE"),
    repRg: envOr("COMPANY_REP_RG", "RG DO REPRESENTANTE"),
    repCargo: envOr("COMPANY_REP_CARGO", "CARGO DO REPRESENTANTE"),
  };
}
