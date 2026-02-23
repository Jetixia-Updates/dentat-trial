/**
 * Insurance companies in Egypt – official/original names (health / medical / dental).
 * All listed companies are accepted. Names in their original legal form.
 */
export interface InsuranceCompany {
  id: string;
  nameEn: string;
  nameAr: string;
  accepted: boolean;
}

export const INSURANCE_COMPANIES_EGYPT: InsuranceCompany[] = [
  { id: "allianz-egypt", nameEn: "Allianz Insurance Company – Egypt", nameAr: "شركة أليانز للتأمين – مصر", accepted: true },
  { id: "allianz-life-egypt", nameEn: "Allianz Life Assurance Company – Egypt", nameAr: "شركة أليانز للتأمين على الحياة – مصر", accepted: true },
  { id: "axa-egypt", nameEn: "AXA Egypt for Insurance", nameAr: "أكسا مصر للتأمين", accepted: true },
  { id: "metlife-egypt", nameEn: "MetLife Egypt for Insurance and Reinsurance", nameAr: "ميت لايف مصر للتأمين وإعادة التأمين", accepted: true },
  { id: "alico-egypt", nameEn: "American Life Insurance Company (ALICO) Egypt", nameAr: "الشركة الأمريكية للتأمين على الحياة (أليكو) مصر", accepted: true },
  { id: "bupa-egypt", nameEn: "Bupa Egypt for Medical Insurance", nameAr: "بوبا مصر للتأمين الطبي", accepted: true },
  { id: "aig-egypt", nameEn: "AIG Egypt Insurance Company", nameAr: "شركة إيه آي جي مصر للتأمين", accepted: true },
  { id: "aig-life-egypt", nameEn: "AIG Life Egypt", nameAr: "إيه آي جي لايف مصر", accepted: true },
  { id: "ace-egypt", nameEn: "ACE Egypt for Insurance (Chubb)", nameAr: "إيس مصر للتأمين (تشب)", accepted: true },
  { id: "misr-insurance", nameEn: "Misr Insurance Company", nameAr: "شركة مصر للتأمين", accepted: true },
  { id: "misr-life", nameEn: "Misr Life Insurance Company", nameAr: "شركة مصر للتأمين على الحياة", accepted: true },
  { id: "delta-insurance", nameEn: "Delta Insurance Company", nameAr: "شركة الدلتا للتأمين", accepted: true },
  { id: "suez-canal-insurance", nameEn: "Suez Canal Insurance Company", nameAr: "شركة قناة السويس للتأمين", accepted: true },
  { id: "arop-insurance", nameEn: "Arop Insurance Company", nameAr: "شركة أوروب للتأمين", accepted: true },
  { id: "egyptian-takaful", nameEn: "Egyptian Takaful Insurance Company", nameAr: "شركة المصرية للتأمين التكافلي", accepted: true },
  { id: "wethaq-takaful", nameEn: "Wethaq Takaful Insurance Company", nameAr: "شركة وثاق للتأمين التكافلي", accepted: true },
  { id: "egyptian-takaful-life", nameEn: "Egyptian Takaful Life Insurance Company", nameAr: "شركة المصرية للتأمين التكافلي على الحياة", accepted: true },
  { id: "generali-egypt", nameEn: "Generali Egypt Insurance Company", nameAr: "شركة جنرالي مصر للتأمين", accepted: true },
  { id: "qnb-alahli-life", nameEn: "QNB Alahli Life Insurance Company", nameAr: "شركة قطر الوطني الأهلي للتأمين على الحياة", accepted: true },
  { id: "medmisr", nameEn: "Medmisr for Medical Insurance", nameAr: "مد مصر للتأمين الطبي", accepted: true },
  { id: "smart-medical", nameEn: "Smart Medical Services Company", nameAr: "شركة سمارت ميديكال سيرفسيز", accepted: true },
  { id: "cigna-egypt", nameEn: "Cigna Egypt for Health Insurance", nameAr: "سيجنا مصر للتأمين الصحي", accepted: true },
  { id: "hdi-egypt", nameEn: "HDI Egypt Insurance Company", nameAr: "شركة إتش دي آي مصر للتأمين", accepted: true },
  { id: "phoenix-egypt", nameEn: "Phoenix Egypt Insurance Company", nameAr: "شركة فينيكس مصر للتأمين", accepted: true },
  { id: "libya-insurance-egypt", nameEn: "Libya Insurance Company – Egypt Branch", nameAr: "شركة ليبيا للتأمين – فرع مصر", accepted: true },
  { id: "saic-egypt", nameEn: "United Arab Insurance Company (SAIC)", nameAr: "الشركة العربية المتحدة للتأمين", accepted: true },
  { id: "gig-egypt", nameEn: "Gulf Insurance Group – Egypt", nameAr: "المجموعة الخليجية للتأمين – مصر", accepted: true },
  { id: "takaful-watania", nameEn: "Takaful Watania Company", nameAr: "شركة التكافل الوطني", accepted: true },
  { id: "sahara-life", nameEn: "Sahara Life Insurance Company", nameAr: "شركة الصحراء للتأمين على الحياة", accepted: true },
  { id: "oriental-weaver-insurance", nameEn: "Oriental Weavers Insurance", nameAr: "تأمين الشركة الشرقية للغزل والنسيج", accepted: true },
  { id: "egyptian-reinsurance", nameEn: "Egyptian Reinsurance Company", nameAr: "الشركة المصرية لإعادة التأمين", accepted: true },
  { id: "nice-deer", nameEn: "Nice Deer for Health Services", nameAr: "نايس دير للخدمات الصحية", accepted: true },
  { id: "paynas", nameEn: "Paynas for Employee Benefits", nameAr: "بيناس لمزايا العاملين", accepted: true },
  { id: "amanleek", nameEn: "Amanleek for Medical Insurance", nameAr: "أمانليك للتأمين الطبي", accepted: true },
  { id: "sanad", nameEn: "Sanad for Health Insurance", nameAr: "سند للتأمين الصحي", accepted: true },
  { id: "other", nameEn: "Other Insurance", nameAr: "تأمين أخرى", accepted: true },
];

export const ACCEPTED_INSURANCE = INSURANCE_COMPANIES_EGYPT.filter((c) => c.accepted);

export const INSURANCE_IDS = INSURANCE_COMPANIES_EGYPT.map((c) => c.id) as readonly string[];

export function getInsuranceById(id: string): InsuranceCompany | undefined {
  return INSURANCE_COMPANIES_EGYPT.find((c) => c.id === id);
}

export function getInsuranceName(id: string, locale: string): string {
  const company = getInsuranceById(id);
  if (!company) return id;
  return locale === "ar" ? company.nameAr : company.nameEn;
}
