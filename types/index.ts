export interface User {
  uid: string;
  role: 'admin' | 'donor';
  fullName: string;
  age: number;
  phone: string;
  city: string;
  district: string;
  lastDonateDate: string;
  bloodGroup: string;
  profilePhoto?: string;
  createdAt: Date;
  email?: string;
}

export interface AppConfig {
  heroQuote: string;
  whatsappNumber: string;
}