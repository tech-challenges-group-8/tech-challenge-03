function formatarData(dataIso: string) {
  if (!dataIso) return "";
  try {
    return new Date(dataIso).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Sao_Paulo",
    });
  } catch {
    return dataIso;
  }
}

export { formatarData };
