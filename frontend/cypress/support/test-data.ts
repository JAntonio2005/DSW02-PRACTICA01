export type TestDataProfile = {
  runId: string;
  departamentoClave: string;
  empleadoClave: string;
};

export function buildTestDataProfile(prefix = 'E2E'): TestDataProfile {
  const runId = `${Date.now()}`;
  const shortId = runId.slice(-6);

  return {
    runId,
    departamentoClave: `${prefix}D${shortId}`,
    empleadoClave: `${prefix}E${shortId}`
  };
}
