import { CustomerReview, EquipmentCategory } from "@/types";

export interface CategoryInfo {
  id: EquipmentCategory;
  name: string;
  banglaName: string;
  description: string;
  banglaDescription: string;
  count: number;
  image: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "Power Tillers",
    name: "Power Tillers",
    banglaName: "পাওয়ার টিলার",
    description: "Two-wheel machines for soil tilling and field preparation.",
    banglaDescription: "জমি চাষ ও প্রস্তুতির জন্য দুই চাকার যন্ত্র।",
    count: 2,
    image: "https://images.unsplash.com/photo-1532929900024-6413d2ed39c8?q=80&w=1197&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    id: "Tractors",
    name: "Tractors",
    banglaName: "ট্রাক্টর",
    description: "Agricultural tractors for field work and transport.",
    banglaDescription: "জমি চাষ ও কৃষিপণ্য পরিবহনের ট্রাক্টর।",
    count: 2,
    image: "https://images.unsplash.com/photo-1783917131968-db105832cdf8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    id: "Harvesters",
    name: "Combine Harvesters",
    banglaName: "কম্বাইন হারভেস্টার",
    description: "Machines that combine crop cutting and grain separation.",
    banglaDescription: "ফসল কাটা ও শস্য আলাদা করার কম্বাইন যন্ত্র।",
    count: 2,
    image: "https://images.unsplash.com/photo-1633554587766-ffc8151e31c0?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    id: "Rice Transplanters",
    name: "Rice Transplanters",
    banglaName: "রাইস ট্রান্সপ্লান্টার",
    description: "Mechanical equipment for transplanting rice seedlings.",
    banglaDescription: "ধানের চারা রোপণের যান্ত্রিক সরঞ্জাম।",
    count: 2,
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=1091&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    id: "Irrigation Pumps",
    name: "Irrigation Pumps",
    banglaName: "সেচ পাম্প",
    description: "Water pumps used for agricultural irrigation.",
    banglaDescription: "কৃষিজমিতে সেচের জন্য পানির পাম্প।",
    count: 2,
    image: "https://images.unsplash.com/photo-1541024626294-9eb360170dd9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    id: "Sprayers",
    name: "Agricultural Sprayers",
    banglaName: "কৃষি স্প্রেয়ার",
    description: "Crop sprayers for applying agricultural treatments.",
    banglaDescription: "ফসলে কৃষি উপকরণ প্রয়োগের স্প্রেয়ার।",
    count: 2,
    image: "https://images.unsplash.com/photo-1711900177029-93798ef45bb7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    id: "Threshers",
    name: "Rice Threshers",
    banglaName: "ধান মাড়াই যন্ত্র",
    description: "Mechanized equipment for separating grain from harvested crops.",
    banglaDescription: "কাটা ফসল থেকে শস্য আলাদা করার যন্ত্র।",
    count: 2,
    image: "https://images.unsplash.com/photo-1649007251633-85114e7f2b7b?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    id: "Reapers",
    name: "Reapers",
    banglaName: "রিপার",
    description: "Harvesting machines for cutting standing crops.",
    banglaDescription: "দাঁড়ানো ফসল কাটার যন্ত্র।",
    count: 2,
    image: "https://images.unsplash.com/photo-1527847263472-aa5338d178b8?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    id: "Seed Drills",
    name: "Seed Drills",
    banglaName: "সিড ড্রিল",
    description: "Equipment for placing seed or granular inputs in rows.",
    banglaDescription: "সারিতে বীজ বা দানাদার উপকরণ বসানোর যন্ত্র।",
    count: 2,
    image: "https://images.unsplash.com/photo-1684677806819-a3c5d7ebc752?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
  {
    id: "Rotavators",
    name: "Rotavators",
    banglaName: "রোটাভেটর",
    description: "Rotary tillage attachments for preparing soil.",
    banglaDescription: "মাটি প্রস্তুত করার ঘূর্ণায়মান চাষের যন্ত্র।",
    count: 2,
    image: "https://images.unsplash.com/photo-1606739211185-2c846d734a6d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  },
];

export const BANGLADESH_DIVISIONS = [
  "All Divisions",
  "Dhaka",
  "Rajshahi",
  "Rangpur",
  "Mymensingh",
  "Khulna",
  "Chattogram",
  "Sylhet",
  "Barishal",
];

export const BANGLADESH_DISTRICTS = [
  "All Districts",
  "Bogura",
  "Dinajpur",
  "Cumilla",
  "Mymensingh",
  "Jessore",
  "Rajshahi",
  "Rangpur",
  "Tangail",
  "Naogaon",
  "Pabna",
  "Jamalpur",
  "Kushtia",
  "Sirajganj",
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    _id: "rev-01",
    renterId: "renter-101",
    renterName: "Md. Rafiqul Islam",
    renterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    renterLocation: "Sherpur, Bogura",
    cropType: "Aman Rice (আমন ধান)",
    rating: 5,
    date: "14 November 2026",
    comment:
      "যন্ত্রহাট থেকে গত সপ্তাহে আমন ধান মাড়াইয়ের জন্য পাওয়ার থ্রেশার ভাড়া নিয়েছিলাম। সময়মতো যন্ত্রপাতি পেয়েছি এবং ধান নষ্ট হওয়া থেকে রক্ষা পেয়েছে। ভাড়ার খরচও অনেক সাশ্রয়ী ছিল।",
    isDemo: true,
    createdAt: "2026-11-14T10:00:00Z",
  },
  {
    _id: "rev-02",
    renterId: "renter-102",
    renterName: "Abdul Barek Mia",
    renterAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    renterLocation: "Birol, Dinajpur",
    cropType: "Boro Seedbed (বোরো বীজতলা)",
    rating: 5,
    date: "10 November 2026",
    comment:
      "বোরো বীজতলার জমি তৈরির জন্য ডংফেং পাওয়ার টিলার একদিনের জন্য নিয়েছিলাম। মালিকের ব্যবহার চমৎকার ছিল এবং টিলার কোনো সমস্যা ছাড়াই পুরো জমি এক দিনেই চাষ করে দিয়েছে।",
    isDemo: true,
    createdAt: "2026-11-10T14:30:00Z",
  },
  {
    _id: "rev-03",
    renterId: "renter-103",
    renterName: "Golam Kibria Majumder",
    renterAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
    renterLocation: "Chandina, Cumilla",
    cropType: "Winter Vegetables (শীতকালীন সবজি)",
    rating: 5,
    date: "04 November 2026",
    comment:
      "আমরা ৪ জন কৃষক মিলে মাহিন্দ্রা ট্রাক্টর বুক করেছিলাম আলু ও সবজির জমি প্রস্তুতের জন্য। সঠিক সময়ে ডেলিভারি পেয়েছি। ছোট কৃষকদের জন্য যন্ত্রহাট সত্যিই অসাধারণ একটি উদ্যোগ।",
    isDemo: true,
    createdAt: "2026-11-04T12:00:00Z",
  },
  {
    _id: "rev-04",
    renterId: "renter-104",
    renterName: "Nazmul Hossain",
    renterAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80",
    renterLocation: "Trishal, Mymensingh",
    cropType: "Paddy & Mustard (ধান ও সরিষা)",
    rating: 5,
    date: "28 October 2026",
    comment:
      "হোন্ডা ৩ ইঞ্চি সেচ পাম্প দিয়ে ক্যানেল থেকে পানি তুলে মাত্র কয়েক ঘণ্টায় পুরো জমিতে সেচ দিয়েছি। পাম্প একদম নতুন ও নিখুঁত ছিল। ডিজিটাল ভাড়ার এমন সহজ ব্যবস্থা আগে কখনো দেখিনি।",
    isDemo: true,
    createdAt: "2026-10-28T16:15:00Z",
  },
];
