// Field configuration for the client-portal profile form. Mirrors the fields the
// extension autofills from (the `clients` table) and the standalone portal.

export type FieldType =
  | "text" | "email" | "url" | "tel" | "date" | "number"
  | "textarea" | "select" | "multiselect";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  hint?: string;
  full?: boolean; // span the whole row
  required?: boolean; // must be filled before the profile can be completed
}

export interface Section {
  id: string;
  nav: string;   // sidebar label
  title: string; // heading
  fields?: Field[];
  custom?: "experience" | "education" | "cover" | "resume" | "applications";
  hint?: string;
}

const YN = ["Yes", "No"];

export const VISA_TYPES = [
  "U.S. Citizen", "Green Card / Permanent Resident", "H-1B Visa", "H-4 EAD",
  "L-1 Visa", "F-1 OPT", "F-1 CPT", "TN Visa", "E-3 Visa", "Other",
];

export const SECTIONS: Section[] = [
  {
    id: "personal", nav: "Personal", title: "Personal information",
    fields: [
      { name: "first_name", label: "First name", type: "text", required: true },
      { name: "middle_name", label: "Middle name", type: "text" },
      { name: "last_name", label: "Last name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "tel", placeholder: "+1 555 000 0000", required: true },
      { name: "date_of_birth", label: "Date of birth", type: "date" },
    ],
  },
  {
    id: "address", nav: "Address", title: "Address",
    hint: "Choose your country first, then enter your ZIP / postal code — we'll fill in your city and state automatically.",
    fields: [
      { name: "country", label: "Country", type: "select", options: [] /* filled at runtime */, required: true },
      { name: "zip", label: "ZIP / Postal code", type: "text", required: true },
      { name: "state", label: "State", type: "select", options: [] /* depends on country */, required: true },
      { name: "city", label: "City", type: "text", required: true },
      { name: "address_line1", label: "Street address", type: "text", full: true, required: true },
    ],
  },
  {
    id: "legal", nav: "Legal", title: "Legal & work authorization",
    hint: "These answers autofill compliance questions on job applications.",
    fields: [
      { name: "is_18_plus", label: "Are you at least 18 years of age?", type: "select", options: YN },
      { name: "work_authorized", label: "Are you legally authorized to work in the US?", type: "select", options: YN, required: true },
      { name: "requires_sponsorship", label: "Do you require visa sponsorship now or in the future?", type: "select", options: YN },
      { name: "visa_type", label: "Work authorization status", type: "select", options: VISA_TYPES },
      { name: "non_compete", label: "Are you subject to a non-compete agreement?", type: "select", options: YN },
      { name: "worked_for_government", label: "Have you previously worked for a federal entity?", type: "select", options: YN },
    ],
  },
  {
    id: "work-prefs", nav: "Work Preferences", title: "Work preferences",
    fields: [
      { name: "employment_type", label: "Desired employment type", type: "multiselect",
        options: ["Full-time", "Part-time", "Contract", "Temporary", "Internship"], hint: "select all that apply" },
      { name: "work_arrangement", label: "Work arrangement", type: "multiselect",
        options: ["Remote", "Hybrid", "On-site", "No preference"], hint: "select all that apply" },
      { name: "years_experience", label: "Years of experience", type: "select",
        options: ["Less than 1 year", "1-2 years", "3-5 years", "5-7 years", "7-10 years", "10+ years"] },
      { name: "availability", label: "When can you start?", type: "select",
        options: ["Immediately", "Within 1 week", "Within 2 weeks", "Within 1 month", "More than 1 month"] },
      { name: "notice_period", label: "Notice period (days)", type: "number", placeholder: "e.g. 30" },
      { name: "salary_expectation", label: "Expected salary / salary range", type: "text", placeholder: "e.g. $80,000 – $100,000" },
      { name: "has_drivers_license", label: "Do you have a valid driver's license?", type: "select", options: YN },
      { name: "willing_to_relocate", label: "Are you willing to relocate?", type: "select", options: YN },
      { name: "preferred_locations", label: "Preferred locations (if relocating)", type: "text", placeholder: "e.g. Austin TX, Denver CO" },
      { name: "willing_to_travel", label: "Are you willing to travel for work?", type: "select", options: YN },
      { name: "travel_percentage", label: "Percentage willing to travel", type: "select",
        options: ["No travel", "Up to 25%", "Up to 50%", "Up to 75%", "Up to 100%"] },
    ],
  },
  {
    id: "portfolio", nav: "Portfolio", title: "Portfolio links",
    fields: [
      { name: "linkedin_url", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/in/..." },
      { name: "portfolio_url", label: "Portfolio / Website", type: "url", placeholder: "https://..." },
      { name: "additional_links", label: "Additional links (GitHub, Behance, etc.)", type: "text",
        placeholder: "https://github.com/..., https://behance.net/...", full: true },
    ],
  },
  {
    id: "skills", nav: "Skills", title: "Skills",
    fields: [
      { name: "skills", label: "Skills (comma-separated)", type: "text",
        placeholder: "React, Python, Project Management, Communication...", full: true },
    ],
  },
  { id: "experience", nav: "Experience", title: "Work experience", custom: "experience" },
  { id: "education", nav: "Education", title: "Education history", custom: "education" },
  {
    id: "eeo", nav: "EEO", title: "Equal opportunity (optional)",
    hint: "Voluntary. Used only to autofill EEO questions where asked — leave any blank.",
    fields: [
      { name: "gender", label: "Gender identity", type: "select",
        options: ["Male", "Female", "Non-binary", "Decline to self-identify"] },
      { name: "ethnicity", label: "Race / Ethnicity", type: "select",
        options: ["Hispanic or Latino", "White", "Black or African American", "Asian",
          "Native Hawaiian or Other Pacific Islander", "American Indian or Alaska Native",
          "Two or More Races", "Decline to self-identify"] },
      { name: "veteran_status", label: "Veteran status", type: "select",
        options: ["I am not a protected veteran", "I identify as one or more of the classifications of a protected veteran", "I don't wish to answer"] },
      { name: "disability_status", label: "Disability status", type: "select",
        options: ["No, I do not have a disability", "Yes, I have a disability (or previously had one)", "I do not wish to answer"] },
    ],
  },
  { id: "cover", nav: "Cover Letter", title: "Cover letter (optional)", custom: "cover" },
  { id: "resume", nav: "Resume", title: "Resume", custom: "resume" },
  { id: "applications", nav: "Applications", title: "Your applications", custom: "applications" },
];
