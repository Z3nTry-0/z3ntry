export interface CompanyCapability {
  index: string;
  name: string;
  keywords: [string, string, string];
  description: string;
}

export const companyCapabilities: CompanyCapability[] = [
  {
    index: "01",
    name: "Cybersecurity",
    keywords: ["Detect", "Test", "Protect"],
    description: "Identify exposure, test defenses and strengthen organizational resilience."
  },
  {
    index: "02",
    name: "Development",
    keywords: ["Build", "Integrate", "Scale"],
    description: "Engineer secure products, integrations and systems built for real operations."
  },
  {
    index: "03",
    name: "Design",
    keywords: ["Create", "Communicate", "Position"],
    description: "Create digital identities and experiences that communicate with clarity."
  }
];
