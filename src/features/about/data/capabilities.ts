import { companyCapabilities } from "../../../data/companyCapabilities";

const serviceDetails = {
  Cybersecurity: {
    statement: "We secure",
    description: "Find where your defenses can fail and strengthen the systems, applications, and networks you rely on.",
    services: ["Pentesting", "Red teaming", "Security operations (SOC)", "Threat intelligence", "Incident response", "DevSecOps"],
  },
  Development: {
    statement: "We engineer",
    description: "Build secure software around how your team actually works, from customer-facing apps to internal systems.",
    services: ["Web and mobile apps", "APIs and integrations", "Business systems", "Automation", "Cloud"],
  },
  Design: {
    statement: "We position",
    description: "Define how your brand looks, speaks, and shows up online, so the right people know what sets you apart.",
    services: ["Brand identity", "Brand guidelines", "Content", "Social media", "Community management", "Digital growth"],
  },
};

export const aboutCapabilities = companyCapabilities.map(({ name }) => ({
  name,
  ...serviceDetails[name],
}));

export const experienceFacts = [
  { value: "3+", label: "Years of experience" },
  { value: "4+", label: "Countries reached" },
  { value: "30+", label: "Organizations and projects" },
  { value: "12+", label: "Certifications" },
];
