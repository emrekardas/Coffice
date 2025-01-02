const fs = require('fs');

// JSON dosyasını okuyun
const filePath = 'london_study_laptop_friendly.json';
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Her kayıttaki adres alanındaki bilinmeyen karakterleri temizleyin
const cleanedData = jsonData.map(item => {
  if (item.address) {
    // Bilinmeyen karakterleri (örneğin: ``) temizle
    item.address = item.address.replace(/[^a-zA-Z0-9\s,.-]/g, '').trim();
  }
  return item;
});

// Temizlenmiş JSON'u yeni bir dosyaya kaydedin
const outputFilePath = 'cleaned_london_study_laptop_friendly.json';
fs.writeFileSync(outputFilePath, JSON.stringify(cleanedData, null, 2), 'utf8');

console.log(`Bilinmeyen karakterler temizlendi ve ${outputFilePath} dosyasına kaydedildi.`);