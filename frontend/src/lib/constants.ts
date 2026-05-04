export type OfficeBranch = {
  name: string;
  address: string;
  phone: string;
};

export const OFFICE_BRANCHES: OfficeBranch[] = [
  {
    name: "Physiorehab TB Simatupang",
    address: [
      "Bumame Health Clinic Simatupang",
      "Jl. TB Simatupang No.33",
      "Pasar Minggu, Jakarta Selatan 12550",
    ].join("\n"),
    phone: "0819 0819 1696",
  },
  {
    name: "Physiorehab Gandaria",
    address: [
      "Mantra Space Building Lt. UG",
      "Jl. Baru No. 3, Kebayoran Lama",
      "Jakarta Selatan 12240",
    ].join("\n"),
    phone: "0819 0819 5838",
  },
  {
    name: "Physiorehab Cideng",
    address: ["JAC Building", "Jl. Jati Baru Raya No.28", "Gambir, Jakarta Pusat 10160"].join("\n"),
    phone: "0819 0819 1698",
  },
  {
    name: "Physiorehab Surabaya Samator",
    address: [
      "Samator Tower Office Lt. 2 Unit 1-2",
      "Jl. Raya Kedung Baruk No.26-28",
      "Rungkut, Surabaya 60298",
    ].join("\n"),
    phone: "0819 0819 5848",
  },
  {
    name: "Physiorehab Gading Serpong",
    address: [
      "Ruko Downtown Drive Boulevard",
      "Jl. Volta Utama No.30-32",
      "Kab. Tangerang, Banten 15334",
    ].join("\n"),
    phone: "0819 0819 5469",
  },
  {
    name: "Physiorehab Kelapa Gading",
    address: [
      "Ruko SCBRE",
      "Jl. Agung Sedayu City, Boulevard Raya No.57 Blok E",
      "Kelapa Gading, Jakarta Timur 13910",
    ].join("\n"),
    phone: "0819 0819 5541",
  },
  {
    name: "Physiorehab Karawaci",
    address: [
      "Ruko Asia Milenium",
      "Jl. Taman Permata No.53-55 Blok C1",
      "Kab. Tangerang, Banten 15810",
    ].join("\n"),
    phone: "0819 0819 5769",
  },
  {
    name: "Physiorehab Bekasi",
    address: [
      "Jl. Grand Galaxy City Central Park 3",
      "Grand Galaxy City RRGB No.37-39",
      "Bekasi Selatan, Bekasi 17146",
    ].join("\n"),
    phone: "0819 0819 2615",
  },
  {
    name: "Physiorehab PIK",
    address: [
      "Ruko Ebony Island 2",
      "Soho Rodeo Drive No.51",
      "Pantai Indah Kapuk 2",
      "Jakarta Utara 11510",
    ].join("\n"),
    phone: "0819 0819 5542",
  },
  {
    name: "Physiorehab Medan",
    address: [
      "Jl. Mongonsidi No.59",
      "Polonia, Kec. Medan Polonia",
      "Medan, Sumatera Utara 20157",
    ].join("\n"),
    phone: "0819 0819 5641",
  },
  {
    name: "Physiorehab Meruya (Coming Soon)",
    address: ["Jl. Kembang Kencana No.86", "RT.7/RW.2, Meruya Utara", "Jakarta Barat 11620"].join(
      "\n",
    ),
    phone: "0819 0819 5900",
  },
];
