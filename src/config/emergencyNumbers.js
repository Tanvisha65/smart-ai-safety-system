// Emergency service numbers - single config file
export const EMERGENCY_NUMBERS = {
  emergency: { name: 'Emergency', number: '112', color: '#B3333A' },
  police: { name: 'Police', number: '100', color: '#1a3a6b' },
  fire: { name: 'Fire', number: '101', color: '#FF6B00' },
  medical: { name: 'Medical', number: '108', altNumber: '102', color: '#006B3C' },
  disaster: { name: 'Disaster', number: '1078', color: '#8B4513' },
  woman: { name: 'Women', number: '181', altNumber: '1091', color: '#9B2D8B' },
  child: { name: 'Child', number: '1098', color: '#0066CC' },
  elderly: { name: 'Elderly', number: '14567', color: '#5C4033' },
  railway: { name: 'Railway', number: '139', color: '#003399' },
  cyber: { name: 'Cyber Crime', number: '1930', color: '#1a1a4e' },
  legal: { name: 'Legal Aid', number: '15100', color: '#4a0082' },
  mental: { name: 'Kiran Mental Health', number: '1800-599-0019', color: '#006400' },
  nhrc: { name: 'NHRC', number: '14433', color: '#8B0000' },
};

export const HELPLINES = [
  { category: 'Emergency', name: 'National Emergency', number: '112', description: 'Police, Fire, Medical' },
  { category: 'Police', name: 'Police', number: '100', description: 'Law enforcement' },
  { category: 'Fire', name: 'Fire Brigade', number: '101', description: 'Fire emergencies' },
  { category: 'Medical', name: 'Ambulance', number: '108', description: 'Medical emergencies' },
  { category: 'Medical', name: 'AIIMS Ambulance', number: '102', description: 'Maternal & child health' },
  { category: 'Disaster', name: 'NDRF Disaster', number: '1078', description: 'Natural disasters' },
  { category: 'Women', name: 'Women Helpline', number: '181', description: 'Women in distress' },
  { category: 'Women', name: 'Women Helpline Alt', number: '1091', description: 'Alternate women helpline' },
  { category: 'Women', name: 'NCW Helpline', number: '7827170170', description: 'National Commission for Women' },
  { category: 'Child', name: 'Childline', number: '1098', description: 'Child safety & welfare' },
  { category: 'Elderly', name: 'Elder Helpline', number: '14567', description: 'Senior citizens' },
  { category: 'Railway', name: 'Railway Helpline', number: '139', description: 'Train emergencies' },
  { category: 'Cyber', name: 'Cyber Crime', number: '1930', description: 'Online fraud & cybercrime' },
  { category: 'Legal', name: 'Legal Aid', number: '15100', description: 'NALSA legal services' },
  { category: 'Mental', name: 'Kiran Mental Health', number: '1800-599-0019', description: 'Mental health support (free)' },
  { category: 'Rights', name: 'NHRC', number: '14433', description: 'Human rights commission' },
  { category: 'AntiDrug', name: 'Anti-Drug', number: '1800-11-0031', description: 'NCORD drug helpline' },
  { category: 'Suicide', name: 'iCall Suicide', number: '9152987821', description: 'Suicide prevention' },
  { category: 'Road', name: 'Road Accident', number: '1073', description: 'Highway accident' },
  { category: 'Poison', name: 'Poison Control', number: '1800-116-117', description: 'Poison emergency' },
];

export const COMPLAINT_PORTALS = [
  {
    category: 'Women',
    items: [
      { name: 'NCW Online Complaint', url: 'https://ncwapps.nic.in/onlinecomplaintsv2/frmPubRegistration.aspx', helpline: '7827170170', description: 'National Commission for Women' },
      { name: 'Women Helpline', url: 'https://wcd.gov.in/women/help', helpline: '181', description: 'Women & Child Development' },
      { name: '112 India', url: 'https://112.gov.in', helpline: '112', description: 'National Emergency Number' },
      { name: 'NALSA Legal Aid', url: 'https://nalsa.gov.in', helpline: '15100', description: 'Free legal services' },
    ]
  },
  {
    category: 'Child',
    items: [
      { name: 'eBaal Nidan', url: 'https://ncpcr.gov.in/index_ebaalnidan.php/main/complaint', helpline: '1098', description: 'Child complaint portal' },
      { name: 'POCSO Portal', url: 'https://ncpcr.gov.in/public/lodge-complaints', helpline: '1098', description: 'POCSO complaints' },
      { name: 'NCPCR', url: 'https://ncpcr.gov.in', helpline: '1098', description: 'Child rights commission' },
    ]
  },
  {
    category: 'Cyber',
    items: [
      { name: 'Cybercrime Portal', url: 'https://cybercrime.gov.in', helpline: '1930', description: 'National Cybercrime Reporting' },
      { name: 'SHe-Box', url: 'https://shebox.wcd.gov.in', helpline: '181', description: 'Sexual harassment at workplace' },
    ]
  },
  {
    category: 'Rights',
    items: [
      { name: 'NHRC', url: 'https://hrcnet.nic.in', helpline: '14433', description: 'Human Rights Commission' },
      { name: 'Maharashtra Police', url: 'https://www.mahapolice.gov.in', helpline: '100', description: 'State police portal' },
      { name: 'CPGRAMS', url: 'https://pgportal.gov.in', helpline: '1800-11-0031', description: 'Public Grievances portal' },
    ]
  },
];

export const HOW_TO_FILE_TIPS = [
  { title: 'Call 112 First in an Emergency', content: 'If you are in immediate danger, always call 112 first. File a complaint later once you are safe.' },
  { title: 'Keep Screenshots & Evidence', content: 'Save screenshots, messages, photos, and any other evidence before filing a complaint online.' },
  { title: 'Get an Acknowledgement Number', content: 'After filing, save the complaint/acknowledgement number. You will need it to track your case.' },
  { title: 'Commission Complaint ≠ FIR', content: 'A complaint to NCW, NHRC, or NCPCR is NOT an FIR. For criminal action, also file at your local police station.' },
  { title: 'Online Complaint vs. Police Station', content: 'Online portals help escalate civil rights issues. For theft, assault, or crimes, file an FIR directly at the police station.' },
];
