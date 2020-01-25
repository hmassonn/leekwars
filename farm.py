#!/usr/bin/env python3

import os
import platform
import json
import selenium
import signal
import random
import pyautogui
from secrets                                            import token_hex
from bson                                               import json_util
# selenium
import selenium.webdriver.support.expected_conditions   as EC
from selenium.webdriver.common.by                       import By
from selenium                                           import webdriver
from selenium.webdriver.support.ui                      import WebDriverWait
from selenium.webdriver.common.keys                     import Keys
from selenium.webdriver.common.action_chains            import ActionChains
from selenium.common.exceptions                         import (
    TimeoutException, WebDriverException,
    StaleElementReferenceException, NoSuchElementException
)
# time
import time
import pytz
from datetime                                           import date, datetime, timedelta
from dateutil.parser                                    import parse
from dateutil.relativedelta                             import relativedelta

TIMEZONE = 'Europe/Paris'
tz = pytz.timezone(TIMEZONE)


TOTAL_ATTACK        = 50
TOTAL_ATTACK_TEAM   = 10
# Bondu         73987
# Gradin        74172
# Eglair        74480
ID_POIRO            = '74480'
ID_BESTOF           = '23613'

class Leekwar():
    def receiveSignal(self, signalNumber, frame):
        if signalNumber == 2:
            print('Received SIGINT maybe ctrl+c')
        self.quit()
        return

    def catch_find_xpath(self, driver, xpath):
        result = False
        attempts = 0
        # print(xpath)
        while(attempts < 2 or result):
            try:
                ret = driver.find_elements_by_xpath(xpath)
                result = True
                break
            except StaleElementReferenceException:
                attempts += 1
        return ret

    def init(self):
        self.data_json = {}
        file_json = open('leekwar.json', "r+")
        data_file = file_json.read()
        if data_file and len(data_file) > 0:
            self.data_json = json.loads(data_file, object_hook=json_util.object_hook)
        signal.signal(signal.SIGINT, self.receiveSignal)
        self.driver = webdriver.Firefox()

    def quit(self):
        self.driver.quit()
        exit()

    def leekwar(self):
        i = 0
        self.driver.get('https://leekwars.com/login')
        time.sleep(2)
        login_field = self.driver.find_element_by_name('login')
        login_field.clear()
        login_field.send_keys(self.data_json['login'])
        pass_field = self.driver.find_element_by_name('password')
        pass_field.clear()
        pass_field.send_keys(self.data_json['password'])
        pass_field.send_keys(Keys.RETURN)
        time.sleep(2)
        self.driver.get('https://leekwars.com/garden/team/'+ ID_BESTOF)
        # kill news
        time.sleep(2)
        cross = self.catch_find_xpath(self.driver, "//div[@class='options']/div[@class='option']")
        cross[0].click()
        time.sleep(1)
        enemy = self.catch_find_xpath(self.driver, "//div[@class='opponents']/div")
        enemy[0].click()
        time.sleep(2)
        while (i < TOTAL_ATTACK_TEAM):
            self.driver.get('https://leekwars.com/garden/team/'+ ID_BESTOF)
            time.sleep(2)
            enemy = self.catch_find_xpath(self.driver, "//div[@class='opponents']/div")
            enemy[0].click()
            i += 1
        while (i < TOTAL_ATTACK):
            self.driver.get('https://leekwars.com/garden/solo/'+ ID_POIRO)
            time.sleep(2)
            enemy = self.catch_find_xpath(self.driver, "//div[@class='opponents']/div")
            enemy[0].click()
            i += 1

run = Leekwar()
try:
    run.init()
    run.leekwar()
except Exception as e:
    print(e)
run.quit()