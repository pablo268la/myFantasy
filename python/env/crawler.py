import requests
from bs4 import BeautifulSoup

# Collect the github page
page = requests.get('https://github.com/trending')
print(page)
soup = BeautifulSoup(page.text, 'html.parser')
print(soup)
