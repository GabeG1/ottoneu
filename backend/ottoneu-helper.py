import json
from uuid import RESERVED_FUTURE
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

from flask import Flask, request,render_template, make_response, url_for
from flask_cors import CORS, cross_origin

import pandas as pd
import html5lib
import lxml
from bs4 import BeautifulSoup

app = Flask("ottoneu-helper-server")

cors = CORS(app, supports_credentials=True)
#app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/',methods = ['POST','GET'])
def hello():
    return 'Hello, World!'

@app.route('/login',methods = ['POST'])
def login():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--mute-audio')
    options.add_argument('--lang=de')
    options.add_argument('--window-size=800,600')
    options.add_argument('--disable-notifications')
    options.add_argument('--enable-popup-blocking')

    driver = webdriver.Chrome(chrome_options=options)
    driver.get("https://blogs.fangraphs.com/wp-login.php?redirect_to=http%3A//www.fangraphs.com/redirect.aspx?s=ottoneu.fangraphs.com/football/")

    username = driver.find_element(By.ID, "user_login")
    password = driver.find_element(By.ID, "user_pass")
    submit = driver.find_element(By.ID, "wp-submit")

    username.send_keys(request.form['username'])
    password.send_keys(request.form['password'])
    submit.click()
    cookies = driver.get_cookies()

    resp = make_response("Hello")
    for cookie in cookies:
        key = cookie['name']
        value = cookie['value']
        #expiry = cookie['expiry']
        resp.set_cookie(key=key, value=value, path="/")
    #resp.headers['location'] = url_for('showcookies') 
    driver.close()
    return resp


@app.route('/team',methods = ['POST'])
def team():

    
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--mute-audio')
    options.add_argument('--lang=de')
    options.add_argument('--window-size=800,600')
    options.add_argument('--disable-notifications')
    options.add_argument('--enable-popup-blocking')
    driver = webdriver.Chrome(chrome_options=options)

    driver.get("https://ottoneu.fangraphs.com/football/")
    
    driver.delete_all_cookies()
    
    print("cookies",request.form.to_dict().items())
    
    for key, value in request.form.to_dict().items():
        driver.add_cookie({'name': key, 'value': value, 'domain': '.fangraphs.com',  'path': '/'})
    
    
    driver.get("https://ottoneu.fangraphs.com/football/")

    
    teamLink = driver.find_element(By.XPATH, "/html/body/main/div[2]/table/tbody/tr/td[1]/a[1]")
    teamLink.click()
    teamName = driver.find_element(By.CLASS_NAME, "teamName").text
    teamTbl = driver.find_element(By.XPATH, "/html/body/main/div[3]/div/table").get_attribute('outerHTML')

    df  = pd.read_html(teamTbl)[0]
    print(df)

    resp = make_response("Hello")
    data = {}
    data["team"] = df.to_json(orient='records')
    data["teamName"] = teamName
    resp.set_data(json.dumps(data))
    driver.close()
    return resp

if __name__ == "__main__":
    app.run()