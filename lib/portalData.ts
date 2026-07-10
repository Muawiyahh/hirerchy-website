// First-level administrative divisions (states / provinces / regions) for each
// country in the portal's country list. The United States is handled separately
// via US_STATES in supabase.js. For a handful of very large countries the list
// covers the principal regions / major provinces — easily extended if needed.

export const COUNTRY_STATES = {
  'Canada': [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan',
    'Yukon',
  ],
  'Mexico': [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
    'Guerrero', 'Hidalgo', 'Jalisco', 'State of Mexico', 'Mexico City',
    'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
    'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora',
    'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
  ],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'Ireland': [
    'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin', 'Galway', 'Kerry',
    'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth',
    'Mayo', 'Meath', 'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary',
    'Waterford', 'Westmeath', 'Wexford', 'Wicklow',
  ],
  'India': [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
    'Ladakh', 'Lakshadweep', 'Puducherry',
  ],
  'China': [
    'Anhui', 'Beijing', 'Chongqing', 'Fujian', 'Gansu', 'Guangdong', 'Guangxi',
    'Guizhou', 'Hainan', 'Hebei', 'Heilongjiang', 'Henan', 'Hong Kong', 'Hubei',
    'Hunan', 'Inner Mongolia', 'Jiangsu', 'Jiangxi', 'Jilin', 'Liaoning',
    'Macau', 'Ningxia', 'Qinghai', 'Shaanxi', 'Shandong', 'Shanghai', 'Shanxi',
    'Sichuan', 'Tianjin', 'Tibet', 'Xinjiang', 'Yunnan', 'Zhejiang',
  ],
  'Philippines': [
    'National Capital Region (Metro Manila)', 'Cordillera Administrative Region',
    'Ilocos Region', 'Cagayan Valley', 'Central Luzon', 'CALABARZON',
    'MIMAROPA', 'Bicol Region', 'Western Visayas', 'Central Visayas',
    'Eastern Visayas', 'Zamboanga Peninsula', 'Northern Mindanao', 'Davao Region',
    'SOCCSKSARGEN', 'Caraga', 'Bangsamoro (BARMM)',
  ],
  'Pakistan': [
    'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan',
    'Azad Jammu and Kashmir', 'Islamabad Capital Territory',
  ],
  'Bangladesh': [
    'Barisal', 'Chittagong', 'Dhaka', 'Khulna', 'Mymensingh', 'Rajshahi',
    'Rangpur', 'Sylhet',
  ],
  'Nigeria': [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
    'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Federal Capital Territory',
  ],
  'Brazil': [
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
    'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
    'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
    'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
    'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins',
  ],
  'Colombia': [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar',
    'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
    'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
    'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
    'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
    'Valle del Cauca', 'Vaupés', 'Vichada',
  ],
  'Argentina': [
    'Buenos Aires', 'Ciudad Autónoma de Buenos Aires', 'Catamarca', 'Chaco',
    'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
    'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
    'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
    'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
  ],
  'Germany': [
    'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg',
    'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia',
    'Rhineland-Palatinate', 'Saarland', 'Saxony', 'Saxony-Anhalt',
    'Schleswig-Holstein', 'Thuringia',
  ],
  'France': [
    'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany',
    'Centre-Val de Loire', 'Corsica', 'Grand Est', 'Hauts-de-France',
    'Île-de-France', 'Normandy', 'Nouvelle-Aquitaine', 'Occitanie',
    'Pays de la Loire', "Provence-Alpes-Côte d'Azur", 'Guadeloupe', 'Martinique',
    'French Guiana', 'Réunion', 'Mayotte',
  ],
  'Spain': [
    'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country',
    'Canary Islands', 'Cantabria', 'Castile and León', 'Castilla-La Mancha',
    'Catalonia', 'Extremadura', 'Galicia', 'La Rioja', 'Madrid', 'Murcia',
    'Navarre', 'Valencian Community',
  ],
  'Italy': [
    'Abruzzo', 'Aosta Valley', 'Apulia', 'Basilicata', 'Calabria', 'Campania',
    'Emilia-Romagna', 'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardy',
    'Marche', 'Molise', 'Piedmont', 'Sardinia', 'Sicily', 'Trentino-Alto Adige',
    'Tuscany', 'Umbria', 'Veneto',
  ],
  'Poland': [
    'Greater Poland', 'Kuyavian-Pomeranian', 'Lesser Poland', 'Łódź',
    'Lower Silesian', 'Lublin', 'Lubusz', 'Masovian', 'Opole', 'Podlaskie',
    'Pomeranian', 'Silesian', 'Subcarpathian', 'Świętokrzyskie',
    'Warmian-Masurian', 'West Pomeranian',
  ],
  'Ukraine': [
    'Cherkasy', 'Chernihiv', 'Chernivtsi', 'Crimea', 'Dnipropetrovsk', 'Donetsk',
    'Ivano-Frankivsk', 'Kharkiv', 'Kherson', 'Khmelnytskyi', 'Kyiv City',
    'Kyiv Oblast', 'Kirovohrad', 'Luhansk', 'Lviv', 'Mykolaiv', 'Odesa',
    'Poltava', 'Rivne', 'Sumy', 'Ternopil', 'Vinnytsia', 'Volyn', 'Zakarpattia',
    'Zaporizhzhia', 'Zhytomyr',
  ],
  'Russia': [
    'Moscow', 'Saint Petersburg', 'Adygea', 'Altai Krai', 'Altai Republic',
    'Amur', 'Arkhangelsk', 'Astrakhan', 'Bashkortostan', 'Belgorod', 'Bryansk',
    'Buryatia', 'Chechnya', 'Chelyabinsk', 'Chuvashia', 'Dagestan', 'Irkutsk',
    'Ivanovo', 'Kaliningrad', 'Kaluga', 'Kamchatka', 'Kabardino-Balkaria',
    'Karelia', 'Kemerovo', 'Khabarovsk', 'Khanty-Mansi', 'Kirov', 'Komi',
    'Krasnodar', 'Krasnoyarsk', 'Kursk', 'Leningrad', 'Lipetsk', 'Magadan',
    'Mari El', 'Mordovia', 'Murmansk', 'Nizhny Novgorod', 'Novgorod',
    'Novosibirsk', 'Omsk', 'Orenburg', 'Oryol', 'Penza', 'Perm', 'Primorsky',
    'Pskov', 'Rostov', 'Ryazan', 'Sakha (Yakutia)', 'Sakhalin', 'Samara',
    'Saratov', 'Smolensk', 'Stavropol', 'Sverdlovsk', 'Tambov', 'Tatarstan',
    'Tomsk', 'Tula', 'Tver', 'Tyumen', 'Udmurtia', 'Ulyanovsk', 'Vladimir',
    'Volgograd', 'Vologda', 'Voronezh', 'Yaroslavl',
  ],
  'Australia': [
    'Australian Capital Territory', 'New South Wales', 'Northern Territory',
    'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia',
  ],
  'New Zealand': [
    'Auckland', 'Bay of Plenty', 'Canterbury', 'Gisborne', "Hawke's Bay",
    'Manawatū-Whanganui', 'Marlborough', 'Nelson', 'Northland', 'Otago',
    'Southland', 'Taranaki', 'Tasman', 'Waikato', 'Wellington', 'West Coast',
  ],
  'Japan': [
    'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima',
    'Ibaraki', 'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
    'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu',
    'Shizuoka', 'Aichi', 'Mie', 'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara',
    'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi',
    'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga', 'Nagasaki',
    'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa',
  ],
  'South Korea': [
    'Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju', 'Daejeon', 'Ulsan',
    'Sejong', 'Gyeonggi', 'Gangwon', 'North Chungcheong', 'South Chungcheong',
    'North Jeolla', 'South Jeolla', 'North Gyeongsang', 'South Gyeongsang',
    'Jeju',
  ],
  'Vietnam': [
    'Hanoi', 'Ho Chi Minh City', 'Hai Phong', 'Da Nang', 'Can Tho', 'An Giang',
    'Ba Ria-Vung Tau', 'Bac Giang', 'Bac Ninh', 'Binh Duong', 'Binh Dinh',
    'Dong Nai', 'Dak Lak', 'Gia Lai', 'Ha Tinh', 'Hai Duong', 'Khanh Hoa',
    'Kien Giang', 'Lam Dong', 'Long An', 'Nam Dinh', 'Nghe An', 'Quang Nam',
    'Quang Ninh', 'Thai Binh', 'Thai Nguyen', 'Thanh Hoa', 'Thua Thien Hue',
    'Tien Giang', 'Vinh Phuc',
  ],
  'Indonesia': [
    'Aceh', 'Bali', 'Bangka Belitung Islands', 'Banten', 'Bengkulu',
    'Central Java', 'Central Kalimantan', 'Central Sulawesi', 'East Java',
    'East Kalimantan', 'East Nusa Tenggara', 'Gorontalo', 'Jakarta', 'Jambi',
    'Lampung', 'Maluku', 'North Kalimantan', 'North Maluku', 'North Sulawesi',
    'North Sumatra', 'Papua', 'Riau', 'Riau Islands', 'South Kalimantan',
    'South Sulawesi', 'South Sumatra', 'Southeast Sulawesi', 'West Java',
    'West Kalimantan', 'West Nusa Tenggara', 'West Papua', 'West Sulawesi',
    'West Sumatra', 'Yogyakarta',
  ],
  'Malaysia': [
    'Johor', 'Kedah', 'Kelantan', 'Malacca', 'Negeri Sembilan', 'Pahang',
    'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu',
    'Kuala Lumpur', 'Labuan', 'Putrajaya',
  ],
  'Singapore': ['Central', 'East', 'North', 'North-East', 'West'],
  'Thailand': [
    'Bangkok', 'Chiang Mai', 'Chiang Rai', 'Chonburi', 'Nakhon Ratchasima',
    'Khon Kaen', 'Udon Thani', 'Phuket', 'Surat Thani', 'Songkhla',
    'Nonthaburi', 'Pathum Thani', 'Samut Prakan', 'Ayutthaya', 'Rayong',
    'Nakhon Si Thammarat', 'Ubon Ratchathani', 'Phitsanulok', 'Krabi',
    'Prachuap Khiri Khan',
  ],
  'Nepal': [
    'Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali',
    'Sudurpashchim',
  ],
  'Sri Lanka': [
    'Central', 'Eastern', 'North Central', 'Northern', 'North Western',
    'Sabaragamuwa', 'Southern', 'Uva', 'Western',
  ],
  'South Africa': [
    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
    'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape',
  ],
  'Kenya': [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu', 'Machakos', 'Kajiado',
    'Uasin Gishu', 'Kakamega', 'Meru', 'Nyeri', 'Kilifi', 'Bungoma', 'Kisii',
    'Garissa', 'Turkana', 'Kericho', 'Laikipia',
  ],
  'Egypt': [
    'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Sharqia', 'Qalyubia',
    'Beheira', 'Gharbia', 'Monufia', 'Kafr El Sheikh', 'Faiyum', 'Minya',
    'Asyut', 'Sohag', 'Qena', 'Aswan', 'Luxor', 'Port Said', 'Suez', 'Ismailia',
    'Damietta', 'Red Sea', 'New Valley', 'Matrouh', 'North Sinai', 'South Sinai',
    'Beni Suef',
  ],
  'Ghana': [
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Volta',
    'Northern', 'Upper East', 'Upper West', 'Bono', 'Bono East', 'Ahafo',
    'Western North', 'Oti', 'Savannah', 'North East',
  ],
  'Ethiopia': [
    'Addis Ababa', 'Afar', 'Amhara', 'Benishangul-Gumuz', 'Dire Dawa', 'Gambela',
    'Harari', 'Oromia', 'Sidama', 'Somali', 'Tigray',
    'South West Ethiopia Peoples', 'Southern Nations, Nationalities, and Peoples',
  ],
  'Saudi Arabia': [
    'Riyadh', 'Makkah', 'Madinah', 'Eastern Province', 'Asir', 'Tabuk', 'Hail',
    'Northern Borders', 'Jazan', 'Najran', 'Al Bahah', 'Al Jawf', 'Qassim',
  ],
  'United Arab Emirates': [
    'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain',
    'Ras Al Khaimah', 'Fujairah',
  ],
  'Israel': [
    'Jerusalem', 'Tel Aviv', 'Haifa', 'Central', 'Northern', 'Southern',
  ],
  'Turkey': [
    'Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya',
    'Gaziantep', 'Şanlıurfa', 'Kocaeli', 'Mersin', 'Diyarbakır', 'Kayseri',
    'Eskişehir', 'Samsun', 'Denizli', 'Trabzon', 'Malatya', 'Erzurum',
    'Sakarya', 'Hatay', 'Manisa', 'Balıkesir', 'Kahramanmaraş', 'Aydın',
    'Tekirdağ', 'Muğla', 'Van',
  ],
  'Iran': [
    'Tehran', 'Isfahan', 'Fars', 'Khuzestan', 'East Azerbaijan',
    'West Azerbaijan', 'Razavi Khorasan', 'Mazandaran', 'Gilan', 'Kerman',
    'Alborz', 'Qom', 'Kermanshah', 'Hormozgan', 'Sistan and Baluchestan',
    'Golestan', 'Hamadan', 'Lorestan', 'Markazi', 'Kurdistan', 'Yazd',
    'Ardabil', 'Bushehr', 'Zanjan', 'Qazvin',
  ],
  'Netherlands': [
    'Drenthe', 'Flevoland', 'Friesland', 'Gelderland', 'Groningen', 'Limburg',
    'North Brabant', 'North Holland', 'Overijssel', 'South Holland', 'Utrecht',
    'Zeeland',
  ],
  'Sweden': [
    'Stockholm', 'Uppsala', 'Södermanland', 'Östergötland', 'Jönköping',
    'Kronoberg', 'Kalmar', 'Gotland', 'Blekinge', 'Skåne', 'Halland',
    'Västra Götaland', 'Värmland', 'Örebro', 'Västmanland', 'Dalarna',
    'Gävleborg', 'Västernorrland', 'Jämtland', 'Västerbotten', 'Norrbotten',
  ],
  'Norway': [
    'Oslo', 'Rogaland', 'Møre og Romsdal', 'Nordland', 'Vestland', 'Innlandet',
    'Vestfold og Telemark', 'Agder', 'Viken', 'Trøndelag', 'Troms og Finnmark',
  ],
  'Denmark': [
    'Capital Region', 'Central Denmark', 'North Denmark', 'Region Zealand',
    'Southern Denmark',
  ],
  'Portugal': [
    'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra', 'Évora',
    'Faro', 'Guarda', 'Leiria', 'Lisbon', 'Portalegre', 'Porto', 'Santarém',
    'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu', 'Azores', 'Madeira',
  ],
  'Greece': [
    'Attica', 'Central Greece', 'Central Macedonia', 'Crete',
    'Eastern Macedonia and Thrace', 'Epirus', 'Ionian Islands', 'North Aegean',
    'Peloponnese', 'South Aegean', 'Thessaly', 'Western Greece',
    'Western Macedonia',
  ],
  'Romania': [
    'Bucharest', 'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud',
    'Botoșani', 'Brașov', 'Brăila', 'Buzău', 'Caraș-Severin', 'Călărași',
    'Cluj', 'Constanța', 'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu',
    'Gorj', 'Harghita', 'Hunedoara', 'Ialomița', 'Iași', 'Ilfov', 'Maramureș',
    'Mehedinți', 'Mureș', 'Neamț', 'Olt', 'Prahova', 'Satu Mare', 'Sălaj',
    'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vaslui', 'Vâlcea',
    'Vrancea',
  ],
  'Venezuela': [
    'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
    'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón',
    'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta',
    'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia',
  ],
  'Peru': [
    'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
    'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad',
    'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco',
    'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali',
  ],
  'Chile': [
    'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo',
    'Valparaíso', 'Santiago Metropolitan', "O'Higgins", 'Maule', 'Ñuble',
    'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes',
  ],
  'Ecuador': [
    'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro',
    'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos',
    'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha',
    'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos',
    'Tungurahua', 'Zamora Chinchipe',
  ],
  'Guatemala': [
    'Guatemala', 'Alta Verapaz', 'Baja Verapaz', 'Chimaltenango', 'Chiquimula',
    'El Progreso', 'Escuintla', 'Huehuetenango', 'Izabal', 'Jalapa', 'Jutiapa',
    'Petén', 'Quetzaltenango', 'Quiché', 'Retalhuleu', 'Sacatepéquez',
    'San Marcos', 'Santa Rosa', 'Sololá', 'Suchitepéquez', 'Totonicapán',
    'Zacapa',
  ],
  'Dominican Republic': [
    'Distrito Nacional', 'Santo Domingo', 'Santiago', 'La Vega', 'San Cristóbal',
    'Puerto Plata', 'Duarte', 'La Altagracia', 'San Pedro de Macorís',
    'La Romana', 'Espaillat', 'Azua', 'Barahona', 'Monseñor Nouel',
    'Sánchez Ramírez', 'María Trinidad Sánchez', 'Monte Plata', 'Valverde',
  ],
  'Jamaica': [
    'Kingston', 'St. Andrew', 'St. Catherine', 'Clarendon', 'Manchester',
    'St. Elizabeth', 'Westmoreland', 'Hanover', 'St. James', 'Trelawny',
    'St. Ann', 'St. Mary', 'Portland', 'St. Thomas',
  ],
  'Haiti': [
    'Ouest', 'Sud-Est', 'Nord', 'Nord-Est', 'Artibonite', 'Centre', 'Sud',
    'Grand’Anse', 'Nord-Ouest', 'Nippes',
  ],
};

// ISO 3166-1 alpha-2 codes, used for postal-code → city/state lookups
// (api.zippopotam.us/{code}/{zip}). Countries the lookup service doesn't cover
// simply return nothing and the user types manually.
export const COUNTRY_CODES = {
  'United States': 'us', 'Canada': 'ca', 'Mexico': 'mx', 'United Kingdom': 'gb',
  'Ireland': 'ie', 'India': 'in', 'China': 'cn', 'Philippines': 'ph',
  'Pakistan': 'pk', 'Bangladesh': 'bd', 'Nigeria': 'ng', 'Brazil': 'br',
  'Colombia': 'co', 'Argentina': 'ar', 'Germany': 'de', 'France': 'fr',
  'Spain': 'es', 'Italy': 'it', 'Poland': 'pl', 'Ukraine': 'ua', 'Russia': 'ru',
  'Australia': 'au', 'New Zealand': 'nz', 'Japan': 'jp', 'South Korea': 'kr',
  'Vietnam': 'vn', 'Indonesia': 'id', 'Malaysia': 'my', 'Singapore': 'sg',
  'Thailand': 'th', 'Nepal': 'np', 'Sri Lanka': 'lk', 'South Africa': 'za',
  'Kenya': 'ke', 'Egypt': 'eg', 'Ghana': 'gh', 'Ethiopia': 'et',
  'Saudi Arabia': 'sa', 'United Arab Emirates': 'ae', 'Israel': 'il',
  'Turkey': 'tr', 'Iran': 'ir', 'Netherlands': 'nl', 'Sweden': 'se',
  'Norway': 'no', 'Denmark': 'dk', 'Portugal': 'pt', 'Greece': 'gr',
  'Romania': 'ro', 'Venezuela': 've', 'Peru': 'pe', 'Chile': 'cl',
  'Ecuador': 'ec', 'Guatemala': 'gt', 'Dominican Republic': 'do',
  'Jamaica': 'jm', 'Haiti': 'ht',
};

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  'Puerto Rico',
];

export const COUNTRIES = [
  'United States', 'Canada', 'Mexico', 'United Kingdom', 'Ireland', 'India',
  'China', 'Philippines', 'Pakistan', 'Bangladesh', 'Nigeria', 'Brazil',
  'Colombia', 'Argentina', 'Germany', 'France', 'Spain', 'Italy', 'Poland',
  'Ukraine', 'Russia', 'Australia', 'New Zealand', 'Japan', 'South Korea',
  'Vietnam', 'Indonesia', 'Malaysia', 'Singapore', 'Thailand', 'Nepal',
  'Sri Lanka', 'South Africa', 'Kenya', 'Egypt', 'Ghana', 'Ethiopia',
  'Saudi Arabia', 'United Arab Emirates', 'Israel', 'Turkey', 'Iran',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Portugal', 'Greece',
  'Romania', 'Venezuela', 'Peru', 'Chile', 'Ecuador', 'Guatemala',
  'Dominican Republic', 'Jamaica', 'Haiti', 'Other',
];

export const DEGREE_TYPES = [
  'High School Diploma / GED', "Associate's Degree", "Bachelor's Degree",
  "Master's Degree", 'MBA', 'Doctorate (PhD)',
  'Professional Degree (JD, MD, etc.)', 'Certificate / Diploma', 'Other',
];

export function statesFor(country: string): string[] {
  if (country === 'United States') return US_STATES;
  return (COUNTRY_STATES as Record<string, string[]>)[country] || [];
}
