import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    # CSV dosyasını okuma
    with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        
        # JSON’a dönüştürülecek verilerin saklanacağı liste
        data = []
        for row in csv_reader:
            data.append(row)
    
    # Veriyi JSON formatında dosyaya yazma
    with open(json_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)

# Örnek kullanım:
csv_to_json(
    '/Users/emrekardas/Downloads/london-laptop-friendly.csv',
    '/Users/emrekardas/Downloads/london-laptop-friendly.json'
)

print("CSV dosyası başarıyla JSON formatına dönüştürüldü!")